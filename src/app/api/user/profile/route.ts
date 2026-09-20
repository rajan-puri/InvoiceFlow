import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, companyName, phone, address, gstin, currencySymbol } = body;

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: name !== undefined ? name : undefined,
        companyName: companyName !== undefined ? companyName : undefined,
        phone: phone !== undefined ? phone : undefined,
        address: address !== undefined ? address : undefined,
        gstin: gstin !== undefined ? gstin : undefined,
        currencySymbol: currencySymbol !== undefined ? currencySymbol : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        companyName: true,
        phone: true,
        address: true,
        gstin: true,
        currencySymbol: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
