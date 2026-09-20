import { InvoiceTemplate } from "./types";

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  layoutStyle: "MODERN" | "CLASSIC" | "MINIMAL" | "EXECUTIVE" | "EMERALD";
  primaryColor: string;
  accentColor: string;
  fontFamily: "Inter" | "Roboto" | "Playfair" | "Courier" | "Geist";
  fontSize: "compact" | "normal" | "spacious";
  headerTitle: string;
  headerSubtitle: string;
  badge: string;
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "modern-blue",
    name: "Modern SaaS",
    description: "Crisp corporate layout with clean blue accents, status tags, and sharp typography.",
    layoutStyle: "MODERN",
    primaryColor: "#2563eb",
    accentColor: "#0f172a",
    fontFamily: "Inter",
    fontSize: "normal",
    headerTitle: "PROFORMA INVOICE",
    headerSubtitle: "Official Proforma Estimation & Quotation",
    badge: "Popular",
  },
  {
    id: "classic-corporate",
    name: "Classic Corporate",
    description: "Traditional financial grid, deep navy tones, structured borders, and formal legal layout.",
    layoutStyle: "CLASSIC",
    primaryColor: "#1e3a8a",
    accentColor: "#172554",
    fontFamily: "Roboto",
    fontSize: "compact",
    headerTitle: "COMMERCIAL PROFORMA INVOICE",
    headerSubtitle: "B2B Financial Tax Quotation",
    badge: "Enterprise",
  },
  {
    id: "minimal-studio",
    name: "Minimalist Studio",
    description: "Borderless design, maximum whitespace, elegant monochrome palette, and refined typography.",
    layoutStyle: "MINIMAL",
    primaryColor: "#18181b",
    accentColor: "#27272a",
    fontFamily: "Geist",
    fontSize: "normal",
    headerTitle: "Proforma Invoice",
    headerSubtitle: "Project scope and deliverables quotation",
    badge: "Clean",
  },
  {
    id: "executive-crimson",
    name: "Executive Crimson",
    description: "Bold colored header ribbon, rich burgundy accents, distinct totals card, and strong visual weight.",
    layoutStyle: "EXECUTIVE",
    primaryColor: "#991b1b",
    accentColor: "#450a0a",
    fontFamily: "Playfair",
    fontSize: "spacious",
    headerTitle: "PROFORMA TAX INVOICE",
    headerSubtitle: "Pre-order quotation & delivery commitment",
    badge: "Bold",
  },
  {
    id: "emerald-commerce",
    name: "Emerald Commerce",
    description: "Teal and emerald green highlights, distinct GST tax boxes, and highlighted bank transfer details.",
    layoutStyle: "EMERALD",
    primaryColor: "#059669",
    accentColor: "#064e3b",
    fontFamily: "Inter",
    fontSize: "normal",
    headerTitle: "PROFORMA INVOICE & GST ESTIMATE",
    headerSubtitle: "Standard commercial trade proforma",
    badge: "Retail/Trade",
  },
];

export const COLOR_PALETTES = [
  { name: "SaaS Blue", primary: "#2563eb", accent: "#0f172a" },
  { name: "Corporate Navy", primary: "#1e3a8a", accent: "#172554" },
  { name: "Deep Indigo", primary: "#4f46e5", accent: "#1e1b4b" },
  { name: "Emerald Forest", primary: "#059669", accent: "#064e3b" },
  { name: "Executive Crimson", primary: "#991b1b", accent: "#450a0a" },
  { name: "Royal Purple", primary: "#7c3aed", accent: "#2e1065" },
  { name: "Amber Ochre", primary: "#d97706", accent: "#451a03" },
  { name: "Slate Charcoal", primary: "#334155", accent: "#0f172a" },
  { name: "Pure Onyx", primary: "#18181b", accent: "#09090b" },
];

export const FONT_FAMILIES = [
  { id: "Inter", name: "Inter (Modern Sans)", class: "font-sans" },
  { id: "Roboto", name: "Roboto (Clean Corporate)", class: "font-sans" },
  { id: "Geist", name: "Geist (Tech & Minimal)", class: "font-sans" },
  { id: "Playfair", name: "Playfair (Formal Serif)", class: "font-serif" },
  { id: "Courier", name: "Courier (Technical Mono)", class: "font-mono" },
];

export function getDefaultTemplateConfig(userId: string = "default"): InvoiceTemplate {
  return {
    id: "default-template",
    userId,
    name: "Standard Modern Blue",
    isDefault: true,
    layoutStyle: "MODERN",
    primaryColor: "#2563eb",
    accentColor: "#0f172a",
    fontFamily: "Inter",
    fontSize: "normal",
    logoUrl: null,
    logoWidth: 130,
    showLogo: true,
    headerTitle: "PROFORMA INVOICE",
    headerSubtitle: "Valid for 15 business days from date of issue",
    showCompanyDetails: true,
    showIndex: true,
    showSku: true,
    showHsnSac: true,
    showUnit: true,
    showGstRate: true,
    showGstAmount: true,
    showDiscount: true,
    showBankDetails: true,
    bankName: "HDFC Bank Ltd",
    accountNumber: "50200098765432",
    ifscCode: "HDFC0001234",
    branchName: "Cyber City Branch, Gurugram",
    upiId: "invobazar@hdfcbank",
    showNotes: true,
    notes: "1. Proforma invoice is valid for 15 days from date of issue.\n2. Please mention the invoice number in your wire transfer narration.\n3. Goods or service activation begins upon confirmation of 50% advance.",
    showTerms: true,
    terms: "1. All disputes are subject to local jurisdiction.\n2. Applicable GST taxes are calculated as per prevailing Government rates.\n3. Digital proforma issued without physical stamp is legally binding upon email acceptance.",
    showSignature: true,
    signatureTitle: "Authorized Signatory",
    signatureUrl: null,
    footerText: "Thank you for your valued business! This is a system-generated Proforma Invoice.",
    invoicePrefix: "PI-",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
