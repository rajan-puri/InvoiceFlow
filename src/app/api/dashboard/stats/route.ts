import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.userId;

    const [totalProducts, totalClients, totalInvoices, proformaCount, taxInvoiceCount, totalValueAgg, recentInvoices] =
      await Promise.all([
        prisma.product.count({ where: { userId } }),
        prisma.client.count({ where: { userId } }),
        prisma.invoice.count({ where: { userId } }),
        prisma.invoice.count({ where: { userId, documentType: "PROFORMA" } }),
        prisma.invoice.count({ where: { userId, documentType: "TAX_INVOICE" } }),
        prisma.invoice.aggregate({
          where: { userId },
          _sum: { grandTotal: true },
        }),
        prisma.invoice.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 6,
          include: {
            items: true,
          },
        }),
      ]);

    const totalInvoiceValue = totalValueAgg._sum.grandTotal || 0;

    // Status breakdown
    const statusCounts = await prisma.invoice.groupBy({
      by: ["status"],
      where: { userId },
      _count: { id: true },
    });

    return NextResponse.json({
      totalProducts,
      totalClients,
      totalInvoices,
      proformaCount,
      taxInvoiceCount,
      totalInvoiceValue,
      recentInvoices,
      statusCounts,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
