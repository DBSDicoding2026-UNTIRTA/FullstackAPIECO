import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminApi } from "@/lib/admin-api-auth";
import prisma from "@/lib/prisma";

const statusUpdateSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], {
    message: "Status ticket tidak valid.",
  }),
});

const ticketInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      avatar: true,
    },
  },
} as const;

function serializeTicket(ticket: {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    avatar: string | null;
  };
}) {
  return {
    ...ticket,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await params;

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: ticketInclude,
  });

  if (!ticket) {
    return NextResponse.json(
      { message: "Ticket tidak ditemukan." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ticket: serializeTicket(ticket),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Format JSON tidak valid." },
      { status: 400 },
    );
  }

  const parsed = statusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Data tidak valid." },
      { status: 400 },
    );
  }

  const existingTicket = await prisma.supportTicket.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingTicket) {
    return NextResponse.json(
      { message: "Ticket tidak ditemukan." },
      { status: 404 },
    );
  }

  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: {
      status: parsed.data.status,
    },
    include: ticketInclude,
  });

  return NextResponse.json({
    message: "Status ticket berhasil diperbarui.",
    ticket: serializeTicket(ticket),
  });
}
