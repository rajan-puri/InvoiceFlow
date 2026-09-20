import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface ItemInput {
  productId?: string | null;
  productName: string;
  sku?: string | null;
  description?: string | null;
  quantity: number;
  unit?: string;
  unitPrice: number;
  gstRate: number;
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");
  const documentType = searchParams.get("documentType");

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.userId,
        ...(status ? { status } : {}),
        ...(documentType ? { documentType } : {}),
        ...(search
          ? {
              OR: [
                { invoiceNumber: { contains: search } },
                { clientCompanyName: { contains: search } },
                { clientContactPerson: { contains: search } },
                { clientEmail: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        items: true,
        client: true,
        template: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Fetch invoices error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
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
      invoiceNumber,
      issueDate,
      validUntil,
      status = "DRAFT",
      documentType = "PROFORMA",
      templateId,
      clientId,
      clientCompanyName,
      clientContactPerson,
      clientEmail,
      clientPhone,
      clientBillingAddress,
      clientShippingAddress,
      clientGstin,
      discountType = "PERCENTAGE",
      discountValue = 0,
      notes,
      terms,
      items = [],
    } = body;

    if (!invoiceNumber || !clientCompanyName || !items.length) {
      return NextResponse.json(
        { error: "Invoice number, client company name, and at least one item are required" },
        { status: 400 }
      );
    }

    // Calculate line items and totals safely on server
    let subtotal = 0;
    let totalGst = 0;

    const processedItems = (items as ItemInput[]).map((item) => {
      const qty = Math.max(0, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.unitPrice) || 0);
      const gstRate = Math.max(0, Number(item.gstRate) || 0);

      const baseAmount = qty * price;
      const gstAmt = (baseAmount * gstRate) / 100;
      const lineTotal = baseAmount + gstAmt;

      subtotal += baseAmount;
      totalGst += gstAmt;

      return {
        productId: item.productId || null,
        productName: item.productName || "Product",
        sku: item.sku || null,
        description: item.description || null,
        quantity: qty,
        unit: item.unit || "PCS",
        unitPrice: price,
        gstRate: gstRate,
        gstAmount: gstAmt,
        lineTotal: lineTotal,
      };
    });

    const parsedDiscountValue = Math.max(0, Number(discountValue) || 0);
    let discountAmount = 0;
    if (discountType === "PERCENTAGE") {
      discountAmount = (subtotal * parsedDiscountValue) / 100;
    } else {
      discountAmount = Math.min(parsedDiscountValue, subtotal);
    }

    const grandTotal = Math.max(0, subtotal - discountAmount + totalGst);

    const invoice = await prisma.invoice.create({
      data: {
        userId: session.userId,
        templateId: templateId || null,
        invoiceNumber: invoiceNumber.trim(),
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        validUntil: validUntil ? new Date(validUntil) : null,
        status: status || "DRAFT",
        documentType: documentType === "TAX_INVOICE" ? "TAX_INVOICE" : "PROFORMA",
        clientId: clientId || null,
        clientCompanyName: clientCompanyName.trim(),
        clientContactPerson: clientContactPerson?.trim() || null,
        clientEmail: clientEmail?.trim() || null,
        clientPhone: clientPhone?.trim() || null,
        clientBillingAddress: clientBillingAddress?.trim() || null,
        clientShippingAddress: clientShippingAddress?.trim() || null,
        clientGstin: clientGstin?.trim() || null,
        subtotal,
        discountType,
        discountValue: parsedDiscountValue,
        discountAmount,
        gstAmount: totalGst,
        grandTotal,
        notes: notes?.trim() || null,
        terms: terms?.trim() || null,
        items: {
          create: processedItems,
        },
      },
      include: {
        items: true,
        client: true,
        template: true,
      },
    });

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice. Please check the fields." },
      { status: 500 }
    );
  }
}
