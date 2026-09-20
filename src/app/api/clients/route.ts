import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const clients = await prisma.client.findMany({
      where: {
        userId: session.userId,
        ...(search
          ? {
              OR: [
                { companyName: { contains: search } },
                { contactPerson: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } },
                { gstin: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Fetch clients error:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        userId: session.userId,
        companyName: companyName.trim(),
        contactPerson: contactPerson?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        billingAddress: billingAddress?.trim() || null,
        shippingAddress: shippingAddress?.trim() || null,
        gstin: gstin?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error) {
    console.error("Create client error:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
