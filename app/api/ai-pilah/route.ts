import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAiPilahReply } from "@/lib/gemini";

export const runtime = "nodejs";

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

const chatHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

type AiChatRole = "user" | "assistant";

interface AiChatMessageDto {
  id: string;
  role: AiChatRole;
  content: string;
  createdAt: string;
}

interface AiChatApiResponse {
  data: AiChatMessageDto[];
}

interface AiChatReplyResponse {
  data: {
    reply: AiChatMessageDto;
  };
}

function serializeMessage(message: {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}): AiChatMessageDto {
  return {
    id: message.id,
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = chatHistoryQuerySchema.safeParse({
      limit: request.nextUrl.searchParams.get("limit") ?? undefined,
    });

    if (!query.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const messages = await prisma.aiChatMessage.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: query.data.limit,
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    const payload: AiChatApiResponse = {
      data: messages.map(serializeMessage),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[AI_PILAH_HISTORY_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = (await request.json().catch(() => null)) as unknown;
    const parsedBody = chatRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Pesan tidak valid" },
        { status: 400 }
      );
    }

    const reply = await generateAiPilahReply(parsedBody.data.message);
    const replyMessage = serializeMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      content: reply,
      createdAt: new Date(),
    });

    if (session?.user?.id) {
      await prisma.$transaction([
        prisma.aiChatMessage.create({
          data: {
            userId: session.user.id,
            role: "user",
            content: parsedBody.data.message,
          },
        }),
        prisma.aiChatMessage.create({
          data: {
            userId: session.user.id,
            role: "assistant",
            content: reply,
          },
        }),
      ]);
    }

    const payload: AiChatReplyResponse = {
      data: {
        reply: replyMessage,
      },
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[AI_PILAH_CHAT_ERROR]", error);

    // Specific error handling based on error type
    if (error instanceof Error) {
      // Quota/Rate limit error
      if (error.message === "QUOTA_EXCEEDED_FINAL") {
        return NextResponse.json(
          { error: "Quota Gemini API sedang habis atau rate limit tercapai. Coba lagi beberapa saat." },
          { status: 429 }
        );
      }

      // Model not found error
      if (error.message === "MODEL_NOT_FOUND") {
        console.error("[GEMINI_MODEL_ERROR] Model gemini-2.5-flash tidak ditemukan");
        return NextResponse.json(
          { error: "Model AI tidak tersedia. Hubungi administrator." },
          { status: 404 }
        );
      }

      // API key error
      if (error.message === "INVALID_API_KEY" || error.message === "Missing GEMINI_API_KEY") {
        console.error("[GEMINI_API_KEY_ERROR] API key tidak valid atau tidak diset");
        return NextResponse.json(
          { error: "Konfigurasi API tidak valid. Hubungi administrator." },
          { status: 401 }
        );
      }
    }

    // Generic error response
    const message = error instanceof Error ? error.message : "Gagal memproses chat";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}