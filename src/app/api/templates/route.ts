import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getDefaultTemplateConfig } from "@/lib/templates";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let templates = await prisma.invoiceTemplate.findMany({
      where: { userId: session.userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    // If user has no templates yet, automatically create an initial default template from their profile
    if (templates.length === 0) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      });

      const defaultConfig = getDefaultTemplateConfig(session.userId);
      const created = await prisma.invoiceTemplate.create({
        data: {
          userId: session.userId,
          name: "Standard Modern Template",
          isDefault: true,
          layoutStyle: defaultConfig.layoutStyle,
          primaryColor: defaultConfig.primaryColor,
          accentColor: defaultConfig.accentColor,
          fontFamily: defaultConfig.fontFamily,
          fontSize: defaultConfig.fontSize,
          logoUrl: null,
          logoWidth: defaultConfig.logoWidth,
          showLogo: defaultConfig.showLogo,
          headerTitle: defaultConfig.headerTitle,
          headerSubtitle: defaultConfig.headerSubtitle,
          showCompanyDetails: defaultConfig.showCompanyDetails,
          showIndex: defaultConfig.showIndex,
          showSku: defaultConfig.showSku,
          showHsnSac: defaultConfig.showHsnSac,
          showUnit: defaultConfig.showUnit,
          showGstRate: defaultConfig.showGstRate,
          showGstAmount: defaultConfig.showGstAmount,
          showDiscount: defaultConfig.showDiscount,
          showBankDetails: defaultConfig.showBankDetails,
          bankName: defaultConfig.bankName,
          accountNumber: defaultConfig.accountNumber,
          ifscCode: defaultConfig.ifscCode,
          branchName: defaultConfig.branchName,
          upiId: defaultConfig.upiId,
          showNotes: defaultConfig.showNotes,
          notes: defaultConfig.notes,
          showTerms: defaultConfig.showTerms,
          terms: defaultConfig.terms,
          showSignature: defaultConfig.showSignature,
          signatureTitle: defaultConfig.signatureTitle,
          signatureUrl: null,
          footerText: defaultConfig.footerText,
          invoicePrefix: defaultConfig.invoicePrefix,
        },
      });

      templates = [created];
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Fetch templates error:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
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
      name,
      isDefault = false,
      layoutStyle = "MODERN",
      primaryColor = "#2563eb",
      accentColor = "#0f172a",
      fontFamily = "Inter",
      fontSize = "normal",
      logoUrl = null,
      logoWidth = 130,
      showLogo = true,
      headerTitle = "PROFORMA INVOICE",
      headerSubtitle = "Official Proforma Quotation",
      showCompanyDetails = true,
      showIndex = true,
      showSku = true,
      showHsnSac = true,
      showUnit = true,
      showGstRate = true,
      showGstAmount = true,
      showDiscount = true,
      showBankDetails = true,
      bankName = "HDFC Bank Ltd",
      accountNumber = "50200098765432",
      ifscCode = "HDFC0001234",
      branchName = "Cyber City Branch",
      upiId = "invobazar@hdfcbank",
      showNotes = true,
      notes = "Proforma invoice valid for 15 days.",
      showTerms = true,
      terms = "Standard commercial terms apply.",
      showSignature = true,
      signatureTitle = "Authorized Signatory",
      signatureUrl = null,
      footerText = "Thank you for your business!",
      invoicePrefix = "PI-",
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 });
    }

    // If new template is marked as default, remove default flag from others
    if (isDefault) {
      await prisma.invoiceTemplate.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const template = await prisma.invoiceTemplate.create({
      data: {
        userId: session.userId,
        name: name.trim(),
        isDefault: Boolean(isDefault),
        layoutStyle,
        primaryColor,
        accentColor,
        fontFamily,
        fontSize,
        logoUrl,
        logoWidth: Number(logoWidth) || 130,
        showLogo: Boolean(showLogo),
        headerTitle,
        headerSubtitle,
        showCompanyDetails: Boolean(showCompanyDetails),
        showIndex: Boolean(showIndex),
        showSku: Boolean(showSku),
        showHsnSac: Boolean(showHsnSac),
        showUnit: Boolean(showUnit),
        showGstRate: Boolean(showGstRate),
        showGstAmount: Boolean(showGstAmount),
        showDiscount: Boolean(showDiscount),
        showBankDetails: Boolean(showBankDetails),
        bankName,
        accountNumber,
        ifscCode,
        branchName,
        upiId,
        showNotes: Boolean(showNotes),
        notes,
        showTerms: Boolean(showTerms),
        terms,
        showSignature: Boolean(showSignature),
        signatureTitle,
        signatureUrl,
        footerText,
        invoicePrefix,
      },
    });

    return NextResponse.json({ success: true, template }, { status: 201 });
  } catch (error) {
    console.error("Create template error:", error);
    return NextResponse.json({ error: "Failed to create custom template" }, { status: 500 });
  }
}
