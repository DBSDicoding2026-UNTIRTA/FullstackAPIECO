import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin-api-auth";
import type { TicketStatus } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";

const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

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

function getValidStatus(value: string | null): TicketStatus | undefined {
  if (!value || value === "ALL") return undefined;
  return TICKET_STATUSES.includes(value as TicketStatus)
    ? (value as TicketStatus)
    : undefined;
}

function serializeTicket(ticket: {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TicketStatus;
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

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const status = getValidStatus(searchParams.get("status"));
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")));
  const skip = (page - 1) * limit;

  const where = {
    ...(status ? { status } : {}),
    ...(search.length > 0
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { user: { name: { contains: search, mode: "insensitive" as const } } },
            { user: { email: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [tickets, total, totalTickets, openTickets, inProgressTickets, resolvedTickets] =
    await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: ticketInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
      prisma.supportTicket.count(),
      prisma.supportTicket.count({ where: { status: "OPEN" } }),
      prisma.supportTicket.count({ where: { status: "IN_PROGRESS" } }),
      prisma.supportTicket.count({ where: { status: "RESOLVED" } }),
    ]);

  return NextResponse.json({
    tickets: tickets.map(serializeTicket),
    stats: {
      total: totalTickets,
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
