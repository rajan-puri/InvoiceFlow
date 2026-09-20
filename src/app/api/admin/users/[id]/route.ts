import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json(
      { error: "Forbidden: Master admin access required" },
      { status: 403 }
    );
  }

  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
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
        products: {
          orderBy: { createdAt: "desc" },
        },
        clients: {
          orderBy: { createdAt: "desc" },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
          },
        },
        _count: {
          select: {
            products: true,
            clients: true,
            invoices: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin user detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json(
      { error: "Forbidden: Master admin access required" },
      { status: 403 }
    );
  }

  const { id } = params;

  try {
    const body = await req.json();
    const { role, isEmailVerified } = body;

    const updateData: Record<string, unknown> = {};

    if (role !== undefined && (role === "admin" || role === "user")) {
      updateData.role = role;
    }

    if (isEmailVerified !== undefined) {
      updateData.isEmailVerified = Boolean(isEmailVerified);
      if (isEmailVerified) {
        updateData.verificationCode = null;
        updateData.verificationToken = null;
        updateData.verificationExpires = null;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User account updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { error: "Failed to update user account" },
      { status: 500 }
    );
  }
}
