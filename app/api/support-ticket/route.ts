import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const supportTicketSchema = z.object({
  title: z.string().trim().min(1, "Judul masalah wajib diisi.").max(160),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi masalah wajib diisi.")
    .max(4000),
});

const ticketSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

function serializeTicket(ticket: {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...ticket,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}

async function requireUserSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  if (session.user.role !== "USER") {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  return { session, error: null };
}

export async function POST(request: Request) {
  const auth = await requireUserSession();
  if (auth.error) return auth.error;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Format JSON tidak valid." },
      { status: 400 },
    );
  }

  const parsed = supportTicketSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      },
      { status: 400 },
    );
  }

  try {
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: auth.session.user.id,
        title: parsed.data.title,
        description: parsed.data.description,
      },
      select: ticketSelect,
    });

    return NextResponse.json({
      success: true,
      message: "Laporan berhasil dikirim",
      ticket: serializeTicket(ticket),
    });
  } catch (error) {
    console.error("[SUPPORT_TICKET_POST]", error);

    return NextResponse.json(
      { success: false, message: "Laporan gagal dikirim." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const auth = await requireUserSession();
  if (auth.error) return auth.error;

  try {
    const tickets = await prisma.supportTicket.findMany({
      where: {
        userId: auth.session.user.id,
      },
      select: ticketSelect,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      tickets: tickets.map(serializeTicket),
    });
  } catch (error) {
    console.error("[SUPPORT_TICKET_GET]", error);

    return NextResponse.json(
      { success: false, message: "Riwayat laporan gagal dimuat." },
      { status: 500 },
    );
  }
}
