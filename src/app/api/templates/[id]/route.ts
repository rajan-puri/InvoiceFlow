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
    const template = await prisma.invoiceTemplate.findFirst({
      where: {
        id: params.id,
        userId: session.userId,
      },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Get template error:", error);
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
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
    const existing = await prisma.invoiceTemplate.findFirst({
      where: {
        id: params.id,
        userId: session.userId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const body = await req.json();

    if (body.isDefault) {
      await prisma.invoiceTemplate.updateMany({
        where: {
          userId: session.userId,
          id: { not: params.id },
        },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.invoiceTemplate.update({
      where: { id: params.id },
      data: {
        name: body.name ? body.name.trim() : existing.name,
        isDefault: body.isDefault !== undefined ? Boolean(body.isDefault) : existing.isDefault,
        layoutStyle: body.layoutStyle || existing.layoutStyle,
        primaryColor: body.primaryColor || existing.primaryColor,
        accentColor: body.accentColor || existing.accentColor,
        fontFamily: body.fontFamily || existing.fontFamily,
        fontSize: body.fontSize || existing.fontSize,
        logoUrl: body.logoUrl !== undefined ? body.logoUrl : existing.logoUrl,
        logoWidth: body.logoWidth !== undefined ? Number(body.logoWidth) : existing.logoWidth,
        showLogo: body.showLogo !== undefined ? Boolean(body.showLogo) : existing.showLogo,
        headerTitle: body.headerTitle || existing.headerTitle,
        headerSubtitle: body.headerSubtitle !== undefined ? body.headerSubtitle : existing.headerSubtitle,
        showCompanyDetails: body.showCompanyDetails !== undefined ? Boolean(body.showCompanyDetails) : existing.showCompanyDetails,
        showIndex: body.showIndex !== undefined ? Boolean(body.showIndex) : existing.showIndex,
        showSku: body.showSku !== undefined ? Boolean(body.showSku) : existing.showSku,
        showHsnSac: body.showHsnSac !== undefined ? Boolean(body.showHsnSac) : existing.showHsnSac,
        showUnit: body.showUnit !== undefined ? Boolean(body.showUnit) : existing.showUnit,
        showGstRate: body.showGstRate !== undefined ? Boolean(body.showGstRate) : existing.showGstRate,
        showGstAmount: body.showGstAmount !== undefined ? Boolean(body.showGstAmount) : existing.showGstAmount,
        showDiscount: body.showDiscount !== undefined ? Boolean(body.showDiscount) : existing.showDiscount,
        showBankDetails: body.showBankDetails !== undefined ? Boolean(body.showBankDetails) : existing.showBankDetails,
        bankName: body.bankName !== undefined ? body.bankName : existing.bankName,
        accountNumber: body.accountNumber !== undefined ? body.accountNumber : existing.accountNumber,
        ifscCode: body.ifscCode !== undefined ? body.ifscCode : existing.ifscCode,
        branchName: body.branchName !== undefined ? body.branchName : existing.branchName,
        upiId: body.upiId !== undefined ? body.upiId : existing.upiId,
        showNotes: body.showNotes !== undefined ? Boolean(body.showNotes) : existing.showNotes,
        notes: body.notes !== undefined ? body.notes : existing.notes,
        showTerms: body.showTerms !== undefined ? Boolean(body.showTerms) : existing.showTerms,
        terms: body.terms !== undefined ? body.terms : existing.terms,
        showSignature: body.showSignature !== undefined ? Boolean(body.showSignature) : existing.showSignature,
        signatureTitle: body.signatureTitle !== undefined ? body.signatureTitle : existing.signatureTitle,
        signatureUrl: body.signatureUrl !== undefined ? body.signatureUrl : existing.signatureUrl,
        footerText: body.footerText !== undefined ? body.footerText : existing.footerText,
        invoicePrefix: body.invoicePrefix !== undefined ? body.invoicePrefix : existing.invoicePrefix,
      },
    });

    return NextResponse.json({ success: true, template: updated });
  } catch (error) {
    console.error("Update template error:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
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
    const existing = await prisma.invoiceTemplate.findFirst({
      where: {
        id: params.id,
        userId: session.userId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    await prisma.invoiceTemplate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Template deleted successfully" });
  } catch (error) {
    console.error("Delete template error:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
