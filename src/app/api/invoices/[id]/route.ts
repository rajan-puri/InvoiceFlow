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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, userId: session.userId },
      include: {
        items: true,
        client: true,
        template: true,
        user: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            phone: true,
            address: true,
            gstin: true,
            currencySymbol: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("Fetch invoice error:", error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
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
    const existing = await prisma.invoice.findFirst({
      where: { id: params.id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      invoiceNumber,
      issueDate,
      validUntil,
      status,
      documentType,
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
      items,
    } = body;

    let subtotal = 0;
    let totalGst = 0;
    let processedItems: Array<{
      productId?: string | null;
      productName: string;
      sku?: string | null;
      description?: string | null;
      quantity: number;
      unit: string;
      unitPrice: number;
      gstRate: number;
      gstAmount: number;
      lineTotal: number;
    }> = [];

    if (items && Array.isArray(items)) {
      processedItems = (items as ItemInput[]).map((item) => {
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
    } else {
      subtotal = existing.subtotal;
      totalGst = existing.gstAmount;
    }

    const parsedDiscountValue = Math.max(0, Number(discountValue) || 0);
    let discountAmount = 0;
    if (discountType === "PERCENTAGE") {
      discountAmount = (subtotal * parsedDiscountValue) / 100;
    } else {
      discountAmount = Math.min(parsedDiscountValue, subtotal);
    }

    const grandTotal = Math.max(0, subtotal - discountAmount + totalGst);

    // If items are provided, delete old items and recreate
    if (items && Array.isArray(items)) {
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: params.id },
      });
    }

    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        invoiceNumber: invoiceNumber !== undefined ? invoiceNumber.trim() : existing.invoiceNumber,
        issueDate: issueDate ? new Date(issueDate) : existing.issueDate,
        validUntil: validUntil ? new Date(validUntil) : null,
        status: status !== undefined ? status : existing.status,
        documentType: documentType !== undefined
          ? (documentType === "TAX_INVOICE" ? "TAX_INVOICE" : "PROFORMA")
          : existing.documentType,
        clientId: clientId !== undefined ? clientId || null : existing.clientId,
        clientCompanyName: clientCompanyName !== undefined ? clientCompanyName.trim() : existing.clientCompanyName,
        clientContactPerson: clientContactPerson !== undefined ? clientContactPerson?.trim() || null : existing.clientContactPerson,
        clientEmail: clientEmail !== undefined ? clientEmail?.trim() || null : existing.clientEmail,
        clientPhone: clientPhone !== undefined ? clientPhone?.trim() || null : existing.clientPhone,
        clientBillingAddress: clientBillingAddress !== undefined ? clientBillingAddress?.trim() || null : existing.clientBillingAddress,
        clientShippingAddress: clientShippingAddress !== undefined ? clientShippingAddress?.trim() || null : existing.clientShippingAddress,
        clientGstin: clientGstin !== undefined ? clientGstin?.trim() || null : existing.clientGstin,
        subtotal,
        discountType: discountType || existing.discountType,
        discountValue: parsedDiscountValue,
        discountAmount,
        gstAmount: totalGst,
        grandTotal,
        templateId: body.templateId !== undefined ? body.templateId : existing.templateId,
        notes: notes !== undefined ? notes?.trim() || null : existing.notes,
        terms: terms !== undefined ? terms?.trim() || null : existing.terms,
        ...(items && Array.isArray(items)
          ? {
              items: {
                create: processedItems,
              },
            }
          : {}),
      },
      include: {
        items: true,
        client: true,
        template: true,
      },
    });

    return NextResponse.json({ success: true, invoice: updated });
  } catch (error) {
    console.error("Update invoice error:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
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
    const existing = await prisma.invoice.findFirst({
      where: { id: params.id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await prisma.invoice.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete invoice error:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
