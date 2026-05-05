import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const AI_MODEL_URL = process.env.AI_MODEL_URL || "http://localhost:8000/predict";

interface FastAPIResponse {
  label: string;
  confidence: number;
}

function formatWasteLabel(label: string) {
  const normalized = label.trim().toLowerCase();

  if (normalized.includes("plastik")) return "Plastik";
  if (normalized.includes("kertas")) return "Kertas";
  if (normalized.includes("kaca")) return "Kaca";
  if (normalized.includes("logam")) return "Logam";
  return "Organik";
}

async function classifyWaste(imageFile: File): Promise<FastAPIResponse> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch(AI_MODEL_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`FastAPI error: ${response.statusText}`);
  }

  return response.json();
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
