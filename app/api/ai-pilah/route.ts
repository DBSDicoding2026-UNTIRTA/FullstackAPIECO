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



type AiChatRole = "user" | "assistant";

interface AiChatMessageDto {
  id: string;
  role: AiChatRole;
  content: string;
  createdAt: string;
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