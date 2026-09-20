import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await prisma.client.findFirst({
      where: { id: params.id, userId: session.userId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Fetch client error:", error);
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      companyName,
      contactPerson,
      email,
      phone,
      billingAddress,
      shippingAddress,
      gstin,
    } = body;

    const existing = await prisma.client.findFirst({
      where: { id: params.id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const updated = await prisma.client.update({
      where: { id: params.id },
      data: {
        companyName: companyName !== undefined ? companyName.trim() : existing.companyName,
        contactPerson: contactPerson !== undefined ? contactPerson?.trim() || null : existing.contactPerson,
        email: email !== undefined ? email?.trim() || null : existing.email,
        phone: phone !== undefined ? phone?.trim() || null : existing.phone,
        billingAddress: billingAddress !== undefined ? billingAddress?.trim() || null : existing.billingAddress,
        shippingAddress: shippingAddress !== undefined ? shippingAddress?.trim() || null : existing.shippingAddress,
        gstin: gstin !== undefined ? gstin?.trim() || null : existing.gstin,
      },
    });

    return NextResponse.json({ success: true, client: updated });
  } catch (error) {
    console.error("Update client error:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.client.findFirst({
      where: { id: params.id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    await prisma.client.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete client error:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
