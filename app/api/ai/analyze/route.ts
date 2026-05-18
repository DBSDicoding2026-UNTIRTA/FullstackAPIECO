import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_AI_MODEL_URL =
  "https://hugpy-klasifikasi-sampah-risol-matcha.hf.space/";
const AI_MODEL_TIMEOUT_MS = 60_000;

interface FastAPIResponse {
  label: string;
  confidence: number;
}

interface PilahYukModelResponse {
  status?: string;
  label?: unknown;
  result?: unknown;
  jenis_sampah?: unknown;
  confidence?: unknown;
  data?: {
    label?: unknown;
    result?: unknown;
    jenis_sampah?: unknown;
    confidence?: unknown;
  };
}

function getAiModelUrl() {
  const configuredUrl = process.env.AI_MODEL_URL || DEFAULT_AI_MODEL_URL;
  const modelUrl = new URL(configuredUrl);

  if (modelUrl.pathname === "/" || modelUrl.pathname === "") {
    modelUrl.pathname = "/predict";
  }

  return modelUrl.toString();
}

function formatWasteLabel(label: string) {
  const normalized = label.trim().toLowerCase();

  if (
    normalized.includes("clothes") ||
    normalized.includes("cloth") ||
    normalized.includes("clothing") ||
    normalized.includes("textile") ||
    normalized.includes("fabric") ||
    normalized.includes("pakaian") ||
    normalized.includes("kain") ||
    normalized.includes("baju")
  ) {
    return "Pakaian / Kain";
  }

  if (normalized.includes("plastic") || normalized.includes("plastik")) {
    return "Plastik";
  }

  if (normalized.includes("paper") || normalized.includes("kertas")) {
    return "Kertas";
  }

  if (normalized.includes("glass") || normalized.includes("kaca")) {
    return "Kaca";
  }

  if (normalized.includes("metal") || normalized.includes("logam")) {
    return "Logam";
  }

  if (
    normalized.includes("organic") ||
    normalized.includes("organik") ||
    normalized.includes("food") ||
    normalized.includes("makanan") ||
    normalized.includes("daun") ||
    normalized.includes("sisa")
  ) {
    return "Organik";
  }

  return "Tidak Dikenali";
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function readConfidence(value: unknown) {
  const confidence =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (!Number.isFinite(confidence)) {
    return null;
  }

  const normalizedConfidence = confidence > 1 ? confidence / 100 : confidence;
  return Math.min(Math.max(normalizedConfidence, 0), 1);
}

function normalizeModelResponse(payload: PilahYukModelResponse): FastAPIResponse {
  const label =
    readString(payload.data?.jenis_sampah) ||
    readString(payload.data?.label) ||
    readString(payload.data?.result) ||
    readString(payload.jenis_sampah) ||
    readString(payload.label) ||
    readString(payload.result);

  const confidence = readConfidence(
    payload.data?.confidence ?? payload.confidence
  );

  if (!label || confidence === null) {
    throw new Error("Model response format is invalid");
  }

  return { label, confidence };
}

async function classifyWaste(imageFile: File): Promise<FastAPIResponse> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_MODEL_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(getAiModelUrl(), {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `AI model request failed (${response.status}): ${
        errorText || response.statusText
      }`
    );
  }

  const payload = (await response.json()) as PilahYukModelResponse;
  return normalizeModelResponse(payload);
}

export async function POST(request: NextRequest) {
  try {
    // Check session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "USER") {
      return NextResponse.json(
        { error: "Only users can access this endpoint" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get("file");

    if (!(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be less than 5MB" },
        { status: 400 }
      );
    }

    // Call FastAPI
    const classification = await classifyWaste(imageFile);

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const imageUrl = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    const result = formatWasteLabel(classification.label);

    // Save to database
    const analysis = await prisma.aIAnalysisHistory.create({
      data: {
        userId: session.user.id,
        imageUrl,
        result,
        confidence: classification.confidence,
      },
    });

    return NextResponse.json({
      id: analysis.id,
      label: classification.label,
      result,
      confidence: classification.confidence,
    });
  } catch (error) {
    console.error("[AI_ANALYZE_ERROR]", error);
    const message =
      error instanceof Error ? error.message : "Failed to analyze image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
