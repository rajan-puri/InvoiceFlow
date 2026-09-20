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

  try {
    const [
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      adminUsers,
      totalProducts,
      totalClients,
      totalInvoices,
      invoiceAgg,
      recentUsers,
      recentInvoices,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isEmailVerified: true } }),
      prisma.user.count({ where: { isEmailVerified: false } }),
      prisma.user.count({ where: { role: "admin" } }),
      prisma.product.count(),
      prisma.client.count(),
      prisma.invoice.count(),
      prisma.invoice.aggregate({
        _sum: { grandTotal: true, gstAmount: true },
      }),
      prisma.user.findMany({
        take: 6,
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
      }),
      prisma.invoice.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              companyName: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      overview: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        adminUsers,
        totalProducts,
        totalClients,
        totalInvoices,
        totalInvoiceValue: invoiceAgg._sum.grandTotal || 0,
        totalGstValue: invoiceAgg._sum.gstAmount || 0,
        recentUsers,
        recentInvoices,
      },
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform metrics" },
      { status: 500 }
    );
  }
}
