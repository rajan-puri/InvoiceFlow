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
        { name: { contains: q } },
        { sku: { contains: q } },
        { category: { contains: q } },
        { user: { name: { contains: q } } },
        { user: { email: { contains: q } } },
      ];
    }

    const products = await prisma.product.findMany({
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

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Admin products list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform products" },
      { status: 500 }
    );
  }
}
