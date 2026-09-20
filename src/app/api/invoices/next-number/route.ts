import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const paramPrefix = searchParams.get("prefix");
  const templateId = searchParams.get("templateId");
  const documentType = searchParams.get("documentType") || "PROFORMA";
  const isTaxInvoice = documentType === "TAX_INVOICE";

  try {
    let prefix = paramPrefix;

    if (!prefix && templateId) {
      const template = await prisma.invoiceTemplate.findFirst({
        where: { id: templateId, userId: session.userId },
      });
      if (template?.invoicePrefix) {
        if (isTaxInvoice && template.invoicePrefix === "PI-") {
          prefix = "INV-";
        } else {
          prefix = template.invoicePrefix;
        }
      }
    }

    if (!prefix) {
      const defaultTemplate = await prisma.invoiceTemplate.findFirst({
        where: { userId: session.userId, isDefault: true },
      });
      if (defaultTemplate?.invoicePrefix) {
        if (isTaxInvoice && defaultTemplate.invoicePrefix === "PI-") {
          prefix = "INV-";
        } else {
          prefix = defaultTemplate.invoicePrefix;
        }
      }
    }

    if (!prefix) {
      prefix = isTaxInvoice ? "INV-" : "PI-";
    }

    const resolvedPrefix = prefix.endsWith("-") ? prefix : `${prefix}-`;

    const count = await prisma.invoice.count({
      where: {
        userId: session.userId,
        documentType: isTaxInvoice ? "TAX_INVOICE" : "PROFORMA",
      },
    });

    const currentYear = new Date().getFullYear();
    const nextNumber = `${resolvedPrefix}${currentYear}-${String(count + 1).padStart(3, "0")}`;

    return NextResponse.json({
      nextNumber,
      prefix: resolvedPrefix,
      documentType: isTaxInvoice ? "TAX_INVOICE" : "PROFORMA",
    });
  } catch (error) {
    console.error("Next invoice number error:", error);
    const fallbackPrefix = paramPrefix || (isTaxInvoice ? "INV-" : "PI-");
    const cleanFallback = fallbackPrefix.endsWith("-") ? fallbackPrefix : `${fallbackPrefix}-`;
    return NextResponse.json({
      nextNumber: `${cleanFallback}${new Date().getFullYear()}-001`,
      documentType: isTaxInvoice ? "TAX_INVOICE" : "PROFORMA",
    });
  }
}
