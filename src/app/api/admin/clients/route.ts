import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json(
      { error: "Forbidden: Master admin access required" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  try {
    const whereClause: Record<string, unknown> = {};

    if (q) {
      whereClause.OR = [
        { companyName: { contains: q } },
        { contactPerson: { contains: q } },
        { email: { contains: q } },
        { gstin: { contains: q } },
        { user: { name: { contains: q } } },
        { user: { email: { contains: q } } },
      ];
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
          },
        },
      },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Admin clients list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform clients" },
      { status: 500 }
    );
  }
}
