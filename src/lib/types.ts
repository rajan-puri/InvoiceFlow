export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  companyName?: string | null;
  phone?: string | null;
  address?: string | null;
  gstin?: string | null;
  currencySymbol: string;
  createdAt?: string | Date;
  lastActiveAt?: string | Date;
}

export interface AdminUserListItem {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  companyName?: string | null;
  phone?: string | null;
  address?: string | null;
  gstin?: string | null;
  createdAt: string | Date;
  lastActiveAt: string | Date;
  _count: {
    products: number;
    clients: number;
    invoices: number;
  };
}

export interface AdminPlatformOverview {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  adminUsers: number;
  totalProducts: number;
  totalClients: number;
  totalInvoices: number;
  totalInvoiceValue: number;
  recentUsers: AdminUserListItem[];
  recentInvoices: (Invoice & { user?: { name: string; email: string; companyName?: string | null } })[];
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  sku?: string | null;
  description?: string | null;
  price: number;
  gstRate: number;
  unit: string;
  category?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Client {
  id: string;
  userId: string;
  companyName: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  billingAddress?: string | null;
  shippingAddress?: string | null;
  gstin?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface InvoiceItem {
  id?: string;
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
}

export type DocumentType = "PROFORMA" | "TAX_INVOICE";

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  issueDate: string | Date;
  validUntil?: string | Date | null;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  documentType: DocumentType;
  
  clientId?: string | null;
  clientCompanyName: string;
  clientContactPerson?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientBillingAddress?: string | null;
  clientShippingAddress?: string | null;
  clientGstin?: string | null;

  subtotal: number;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
  gstAmount: number;
  grandTotal: number;

  notes?: string | null;
  terms?: string | null;

  templateId?: string | null;
  template?: InvoiceTemplate | null;

  items: InvoiceItem[];
  user?: UserProfile;
  client?: Client | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface InvoiceTemplate {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  layoutStyle: "MODERN" | "CLASSIC" | "MINIMAL" | "EXECUTIVE" | "EMERALD";
  primaryColor: string;
  accentColor: string;
  fontFamily: "Inter" | "Roboto" | "Playfair" | "Courier" | "Geist";
  fontSize: "compact" | "normal" | "spacious";
  logoUrl?: string | null;
  logoWidth: number;
  showLogo: boolean;
  headerTitle: string;
  headerSubtitle?: string | null;
  showCompanyDetails: boolean;
  showIndex: boolean;
  showSku: boolean;
  showHsnSac: boolean;
  showUnit: boolean;
  showGstRate: boolean;
  showGstAmount: boolean;
  showDiscount: boolean;
  showBankDetails: boolean;
  bankName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
  branchName?: string | null;
  upiId?: string | null;
  showNotes: boolean;
  notes?: string | null;
  showTerms: boolean;
  terms?: string | null;
  showSignature: boolean;
  signatureTitle?: string | null;
  signatureUrl?: string | null;
  footerText?: string | null;
  invoicePrefix?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DashboardStats {
  totalProducts: number;
  totalClients: number;
  totalInvoices: number;
  totalInvoiceValue: number;
  proformaCount?: number;
  taxInvoiceCount?: number;
  recentInvoices: Invoice[];
  monthlyTrend: { month: string; value: number }[];
}
