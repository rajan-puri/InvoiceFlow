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
  const role = searchParams.get("role");
  const verified = searchParams.get("verified");

  try {
    const whereClause: Record<string, unknown> = {};

    if (q) {
      whereClause.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { companyName: { contains: q } },
        { gstin: { contains: q } },
      ];
    }

    if (role && (role === "admin" || role === "user")) {
      whereClause.role = role;
    }

    if (verified === "true") {
      whereClause.isEmailVerified = true;
    } else if (verified === "false") {
      whereClause.isEmailVerified = false;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        companyName: true,
        gstin: true,
        phone: true,
        address: true,
        currencySymbol: true,
        createdAt: true,
        lastActiveAt: true,
        _count: {
          select: {
            products: true,
            clients: true,
            invoices: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user directory" },
      { status: 500 }
    );
  }
}
