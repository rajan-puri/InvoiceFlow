"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  FileText,
  Eye,
  Save,
  Check,
  Calendar,
  Building,
  CreditCard,
  Percent,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { Product, Client, Invoice, InvoiceItem, UserProfile, InvoiceTemplate, DocumentType } from "@/lib/types";
import { formatCurrency, formatDateForInput, applyInvoicePrefix } from "@/lib/utils";
import InvoicePreview from "./InvoicePreview";

interface InvoiceFormProps {
  initialInvoice?: Invoice | null;
  mode: "create" | "edit";
}

export default function InvoiceForm({ initialInvoice, mode }: InvoiceFormProps) {
  const router = useRouter();

  const [documentType, setDocumentType] = useState<DocumentType>(
    initialInvoice?.documentType || "PROFORMA"
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialInvoice?.templateId || ""
  );

  // Form states
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber || ""
  );
  const [issueDate, setIssueDate] = useState(
    formatDateForInput(initialInvoice?.issueDate || new Date())
  );
  const [validUntil, setValidUntil] = useState(
    formatDateForInput(
      initialInvoice?.validUntil ||
        new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    )
  );
  const [status, setStatus] = useState<Invoice["status"]>(
    initialInvoice?.status || "DRAFT"
  );

  // Client info
  const [selectedClientId, setSelectedClientId] = useState(
    initialInvoice?.clientId || ""
  );
  const [clientCompanyName, setClientCompanyName] = useState(
    initialInvoice?.clientCompanyName || ""
  );
  const [clientContactPerson, setClientContactPerson] = useState(
    initialInvoice?.clientContactPerson || ""
  );
  const [clientEmail, setClientEmail] = useState(
    initialInvoice?.clientEmail || ""
  );
  const [clientPhone, setClientPhone] = useState(
    initialInvoice?.clientPhone || ""
  );
  const [clientBillingAddress, setClientBillingAddress] = useState(
    initialInvoice?.clientBillingAddress || ""
  );
  const [clientShippingAddress, setClientShippingAddress] = useState(
    initialInvoice?.clientShippingAddress || ""
  );
  const [clientGstin, setClientGstin] = useState(
    initialInvoice?.clientGstin || ""
  );

  // Discount & Notes
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">(
    initialInvoice?.discountType || "PERCENTAGE"
  );
  const [discountValue, setDiscountValue] = useState<number>(
    initialInvoice?.discountValue || 0
  );
  const [notes, setNotes] = useState(
    initialInvoice?.notes ||
      "Proforma Invoice is valid for 15 days. Payment terms: 50% advance."
  );
  const [terms, setTerms] = useState(
    initialInvoice?.terms ||
      "1. Prices are valid for 15 days from date of issue.\n2. Goods once sold will not be taken back."
  );

  // Line Items
  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items?.length
      ? initialInvoice.items
      : [
          {
            productId: null,
            productName: "",
            sku: "",
            description: "",
            quantity: 1,
            unit: "PCS",
            unitPrice: 0,
            gstRate: 18,
            gstAmount: 0,
            lineTotal: 0,
          },
        ]
  );

  const [viewMode, setViewMode] = useState<"form" | "preview">("form");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load user, products, clients, templates, and next invoice number
  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, prodsRes, clientsRes, tmplRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/products"),
          fetch("/api/clients"),
          fetch("/api/templates"),
        ]);

        if (meRes.ok) {
          const data = await meRes.json();
          setUserProfile(data.user);
        }

        if (prodsRes.ok) {
          const data = await prodsRes.json();
          setProducts(data.products || []);
        }

        if (clientsRes.ok) {
          const data = await clientsRes.json();
          setClients(data.clients || []);
        }

        if (tmplRes.ok) {
          const data = await tmplRes.json();
          const list: InvoiceTemplate[] = data.templates || [];
          setTemplates(list);
          if (!selectedTemplateId && list.length > 0) {
            const def = list.find((t) => t.isDefault) || list[0];
            setSelectedTemplateId(def.id);
          }
        }

        // Check URL query param in create mode
        let initialDocType = documentType;
        if (mode === "create" && typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const typeParam = urlParams.get("type");
          if (typeParam === "TAX_INVOICE") {
            initialDocType = "TAX_INVOICE";
            setDocumentType("TAX_INVOICE");
            setNotes("Official GST Tax Invoice. Payment due per agreed terms.");
            setTerms("1. Goods/Services once delivered are non-refundable.\n2. Applicable GST taxes are charged as per statutory guidelines.\n3. Late payment subject to interest as applicable.");
          }
        }

        if (mode === "create" && !initialInvoice?.invoiceNumber) {
          const numRes = await fetch(`/api/invoices/next-number?documentType=${initialDocType}`);
          if (numRes.ok) {
            const data = await numRes.json();
            setInvoiceNumber(data.nextNumber);
          }
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    }
    loadData();
  }, [mode, initialInvoice]);

  const handleDocumentTypeChange = async (newType: DocumentType) => {
    setDocumentType(newType);
    if (mode === "create") {
      try {
        const tmpl = templates.find((t) => t.id === selectedTemplateId);
        const prefixParam = tmpl?.invoicePrefix ? `&prefix=${encodeURIComponent(tmpl.invoicePrefix)}` : "";
        const numRes = await fetch(`/api/invoices/next-number?documentType=${newType}${prefixParam}`);
        if (numRes.ok) {
          const data = await numRes.json();
          setInvoiceNumber(data.nextNumber);
        }
      } catch (err) {
        console.error("Failed to fetch next number for document type", err);
      }

      if (newType === "TAX_INVOICE") {
        if (!notes || notes.includes("Proforma Invoice is valid")) {
          setNotes("Official GST Tax Invoice. Payment due per agreed terms.");
        }
        if (!terms || terms.includes("Prices are valid for 15 days")) {
          setTerms("1. Goods/services once delivered are non-refundable.\n2. Applicable GST taxes are charged as per statutory guidelines.\n3. All disputes subject to local jurisdiction.");
        }
      } else {
        if (!notes || notes.includes("Official GST Tax Invoice")) {
          setNotes("Proforma Invoice is valid for 15 days. Payment terms: 50% advance.");
        }
        if (!terms || terms.includes("statutory guidelines")) {
          setTerms("1. Prices are valid for 15 days from date of issue.\n2. Goods once sold will not be taken back.");
        }
      }
    }
  };

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    if (!clientId) return;

    const found = clients.find((c) => c.id === clientId);
    if (found) {
      setClientCompanyName(found.companyName);
      setClientContactPerson(found.contactPerson || "");
      setClientEmail(found.email || "");
      setClientPhone(found.phone || "");
      setClientBillingAddress(found.billingAddress || "");
      setClientShippingAddress(found.shippingAddress || found.billingAddress || "");
      setClientGstin(found.gstin || "");
    }
  };

  // Item helpers
  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    val: unknown
  ) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: val };

    const qty = Math.max(0, Number(current.quantity) || 0);
    const price = Math.max(0, Number(current.unitPrice) || 0);
    const gstRate = Math.max(0, Number(current.gstRate) || 0);

    const baseAmount = qty * price;
    const gstAmt = (baseAmount * gstRate) / 100;
    const total = baseAmount + gstAmt;

    current.gstAmount = gstAmt;
    current.lineTotal = total;

    updated[index] = current;
    setItems(updated);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (found) {
      const qty = items[index]?.quantity || 1;
      const baseAmount = qty * found.price;
      const gstAmt = (baseAmount * found.gstRate) / 100;

      const updated = [...items];
      updated[index] = {
        productId: found.id,
        productName: found.name,
        sku: found.sku || "",
        description: found.description || "",
        quantity: qty,
        unit: found.unit || "PCS",
        unitPrice: found.price,
        gstRate: found.gstRate,
        gstAmount: gstAmt,
        lineTotal: baseAmount + gstAmt,
      };
      setItems(updated);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: null,
        productName: "",
        sku: "",
        description: "",
        quantity: 1,
        unit: "PCS",
        unitPrice: 0,
        gstRate: 18,
        gstAmount: 0,
        lineTotal: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Computations
  const subtotal = items.reduce(
    (acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );
  const totalGst = items.reduce((acc, it) => acc + (it.gstAmount || 0), 0);

  const discountAmount =
    discountType === "PERCENTAGE"
      ? (subtotal * (Number(discountValue) || 0)) / 100
      : Math.min(Number(discountValue) || 0, subtotal);

  const grandTotal = Math.max(0, subtotal - discountAmount + totalGst);

  // Construct draft invoice for preview
  const currentInvoiceDraft: Invoice = {
    id: initialInvoice?.id || "temp-id",
    userId: userProfile?.id || "",
    invoiceNumber,
    issueDate,
    validUntil,
    status,
    documentType,
    clientId: selectedClientId || null,
    clientCompanyName: clientCompanyName || "Client Company Name",
    clientContactPerson,
    clientEmail,
    clientPhone,
    clientBillingAddress,
    clientShippingAddress,
    clientGstin,
    subtotal,
    discountType,
    discountValue: Number(discountValue) || 0,
    discountAmount,
    gstAmount: totalGst,
    grandTotal,
    notes,
    terms,
    items,
    createdAt: initialInvoice?.createdAt || new Date(),
    updatedAt: new Date(),
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!invoiceNumber.trim()) {
      setError("Please provide an invoice number");
      return;
    }
    if (!clientCompanyName.trim()) {
      setError("Please provide a client company name");
      return;
    }
    if (!items.length || !items.some((it) => it.productName.trim())) {
      setError("Please add at least one product item with a name");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url =
        mode === "edit" ? `/api/invoices/${initialInvoice?.id}` : "/api/invoices";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber,
          issueDate,
          validUntil,
          status,
          documentType,
          templateId: selectedTemplateId || null,
          clientId: selectedClientId || null,
          clientCompanyName,
          clientContactPerson,
          clientEmail,
          clientPhone,
          clientBillingAddress,
          clientShippingAddress,
          clientGstin,
          discountType,
          discountValue: Number(discountValue) || 0,
          notes,
          terms,
          items: items.filter((it) => it.productName.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save invoice");
      }

      router.push(`/invoices/${data.invoice.id}`);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while saving");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Mode Toggle & Save */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm no-print">
        {/* Form vs Preview Segmented Switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode("form")}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              viewMode === "form"
                ? "bg-white text-blue-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Edit Form</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              viewMode === "preview"
                ? "bg-white text-blue-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Preview</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {templates.length > 0 && (
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial min-w-[140px]">
              <Palette className="w-4 h-4 text-slate-400 shrink-0 hidden xs:inline" />
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  const newTmplId = e.target.value;
                  setSelectedTemplateId(newTmplId);
                  const tmpl = templates.find((t) => t.id === newTmplId);
                  if (tmpl?.invoicePrefix && invoiceNumber) {
                    setInvoiceNumber(applyInvoicePrefix(invoiceNumber, tmpl.invoicePrefix));
                  }
                }}
                className="text-xs font-semibold px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 w-full truncate"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    Template: {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Invoice["status"])}
            className="text-xs font-semibold px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-initial"
          >
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DECLINED">Declined</option>
            <option value="EXPIRED">Expired</option>
          </select>

          <button
            onClick={() => handleSubmit()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : mode === "edit" ? "Update Invoice" : "Save Invoice"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Live Preview Mode */}
      {viewMode === "preview" ? (
        <InvoicePreview
          invoice={currentInvoiceDraft}
          user={userProfile}
          template={templates.find((t) => t.id === selectedTemplateId) || null}
          showActions={false}
        />
      ) : (
        /* Form Editor Mode */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type Selector */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Select Document Type
                </h3>
                <p className="text-xs text-slate-500">
                  Choose whether you are generating a preliminary Proforma quotation or an official Tax Invoice
                </p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                  documentType === "TAX_INVOICE"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-purple-100 text-purple-800 border border-purple-200"
                }`}
              >
                Selected: {documentType === "TAX_INVOICE" ? "Tax Invoice (GST Official)" : "Proforma Invoice"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Proforma Option */}
              <button
                type="button"
                onClick={() => handleDocumentTypeChange("PROFORMA")}
                className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 sm:gap-4 cursor-pointer ${
                  documentType === "PROFORMA"
                    ? "border-purple-600 bg-purple-50/60 shadow-sm ring-1 ring-purple-600"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    documentType === "PROFORMA" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Proforma Invoice</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                      PI- Series
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Preliminary estimate or quotation sent before delivering goods or services. Used for advance payment and approval.
                  </p>
                </div>
              </button>

              {/* Tax Invoice Option */}
              <button
                type="button"
                onClick={() => handleDocumentTypeChange("TAX_INVOICE")}
                className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 sm:gap-4 cursor-pointer ${
                  documentType === "TAX_INVOICE"
                    ? "border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    documentType === "TAX_INVOICE" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Building className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Tax Invoice</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      INV- Series
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Official GST tax invoice issued upon supply or sale. Compliant with statutory GST rules and input tax credit (ITC).
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Card 1: Invoice Meta */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              {documentType === "TAX_INVOICE"
                ? "1. Tax Invoice Details"
                : "1. Proforma Invoice Details"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Invoice Number *
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder={documentType === "TAX_INVOICE" ? "e.g. INV-2026-001" : "e.g. PI-2026-001"}
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-medium border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  {documentType === "TAX_INVOICE" ? "Invoice Date *" : "Issue Date *"}
                </label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  {documentType === "TAX_INVOICE" ? "Payment Due Date" : "Valid Until"}
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Client Selection & Details */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                2. Client / Buyer Details
              </h3>
              {clients.length > 0 && (
                <div className="flex flex-col xs:flex-row xs:items-center gap-1.5 xs:gap-2">
                  <span className="text-xs text-slate-500 font-medium shrink-0">Auto-fill client:</span>
                  <select
                    value={selectedClientId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="text-xs font-medium px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:ring-2 focus:ring-blue-500 w-full xs:w-auto"
                  >
                    <option value="">Select saved client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Company / Buyer Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientCompanyName}
                  onChange={(e) => setClientCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation Pvt Ltd"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Client GSTIN
                </label>
                <input
                  type="text"
                  value={clientGstin}
                  onChange={(e) => setClientGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={clientContactPerson}
                  onChange={(e) => setClientContactPerson(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="accounts@acme.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Client Phone
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Billing Address
                </label>
                <textarea
                  rows={2}
                  value={clientBillingAddress}
                  onChange={(e) => setClientBillingAddress(e.target.value)}
                  placeholder="Street, City, State, PIN..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Shipping Address
                </label>
                <textarea
                  rows={2}
                  value={clientShippingAddress}
                  onChange={(e) => setClientShippingAddress(e.target.value)}
                  placeholder="Destination / Delivery address..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Line Items (Product Selection & Quantity) */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                3. Products & Line Items
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 sm:p-4 bg-slate-50/80 border border-slate-200 rounded-xl relative space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Line Item #{index + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="sm:hidden text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete line item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Saved Product Picker */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {products.length > 0 && (
                        <div className="flex items-center gap-1.5 w-full sm:w-auto">
                          <span className="text-[11px] text-slate-500 whitespace-nowrap shrink-0">Preset:</span>
                          <select
                            value={item.productId || ""}
                            onChange={(e) => handleProductSelect(index, e.target.value)}
                            className="text-xs font-medium px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 w-full sm:w-auto truncate"
                          >
                            <option value="">-- Choose from Catalog --</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({formatCurrency(p.price, userProfile?.currencySymbol || "₹")})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="hidden sm:block text-red-500 hover:text-red-700 p-1 rounded transition-colors shrink-0"
                          title="Delete line item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Desktop and Mobile Responsive Layout for Line Item */}
                  <div className="grid grid-cols-2 sm:grid-cols-12 gap-3">
                    {/* Product Name: full width on mobile (col-span-2), 5 cols on desktop */}
                    <div className="col-span-2 sm:col-span-5">
                      <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                        Product / Service Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={item.productName}
                        onChange={(e) =>
                          handleItemChange(index, "productName", e.target.value)
                        }
                        placeholder="Item name..."
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    {/* SKU: 1 col on mobile, 2 cols on desktop */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={item.sku || ""}
                        onChange={(e) =>
                          handleItemChange(index, "sku", e.target.value)
                        }
                        placeholder="Code"
                        className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    {/* Unit: 1 col on mobile, 2 cols on desktop */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={item.unit || "PCS"}
                        onChange={(e) =>
                          handleItemChange(index, "unit", e.target.value)
                        }
                        placeholder="PCS"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    {/* Unit Price: 1 col on mobile, 3 cols on desktop */}
                    <div className="col-span-1 sm:col-span-3">
                      <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                        Unit Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "unitPrice", e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-right"
                      />
                    </div>

                    {/* Quantity: 1 col on mobile, 2 cols on desktop */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-right"
                      />
                    </div>

                    {/* GST Slab: 1 col on mobile, 2 cols on desktop */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                        GST %
                      </label>
                      <select
                        value={item.gstRate}
                        onChange={(e) =>
                          handleItemChange(index, "gstRate", e.target.value)
                        }
                        className="w-full px-2.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>

                    {/* Line Total display card: 1 col on mobile, 2 cols on desktop */}
                    <div className="col-span-1 sm:col-span-2 bg-blue-50/80 border border-blue-200/80 rounded-lg p-2 flex flex-col justify-center text-right">
                      <span className="text-[10px] font-bold uppercase text-blue-700">
                        Line Total
                      </span>
                      <span className="text-sm font-extrabold text-blue-900 truncate">
                        {formatCurrency(item.lineTotal || 0, userProfile?.currencySymbol || "₹")}
                      </span>
                    </div>

                    {/* Description: full width on mobile (col-span-2), 6 cols on desktop */}
                    <div className="col-span-2 sm:col-span-6">
                      <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                        Description / Specifications
                      </label>
                      <input
                        type="text"
                        value={item.description || ""}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        placeholder="Additional details, scope, or terms..."
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 py-1"
            >
              <Plus className="w-4 h-4" />
              Add another product
            </button>
          </div>

          {/* Card 4: Summary & Calculations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Notes & Terms */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                4. Notes & Terms
              </h3>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Notes / Payment Remarks
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Bank account details, wire instructions, etc."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Delivery terms, warranty terms, validity clause..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Financial Summary Box */}
            <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 w-full">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Calculation Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-xs sm:text-sm">Subtotal (Before Tax)</span>
                  <span className="font-semibold text-slate-800 text-sm sm:text-base">
                    {formatCurrency(subtotal, userProfile?.currencySymbol || "₹")}
                  </span>
                </div>

                {/* Discount input */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                    <label className="text-xs font-medium text-slate-600">Discount</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={discountType}
                        onChange={(e) =>
                          setDiscountType(e.target.value as "PERCENTAGE" | "FIXED")
                        }
                        className="text-xs border border-slate-300 rounded-lg p-1.5 bg-slate-50 text-slate-700"
                      >
                        <option value="PERCENTAGE">% Percentage</option>
                        <option value="FIXED">Flat (₹)</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        className="w-20 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg text-right"
                      />
                    </div>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-medium">
                      <span>Discount Deduction</span>
                      <span>-{formatCurrency(discountAmount, userProfile?.currencySymbol || "₹")}</span>
                    </div>
                  )}
                </div>

                {/* Total GST */}
                <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-100">
                  <span className="text-xs sm:text-sm">Total GST</span>
                  <span className="font-semibold text-slate-800 text-sm sm:text-base">
                    {formatCurrency(totalGst, userProfile?.currencySymbol || "₹")}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-baseline bg-slate-50 -mx-4 -mb-2 px-4 py-3 rounded-b-xl">
                  <div>
                    <span className="text-sm sm:text-base font-bold text-slate-900 block">
                      Grand Total
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500">
                      Including taxes & discounts
                    </span>
                  </div>
                  <span className="text-lg sm:text-2xl font-extrabold text-blue-600">
                    {formatCurrency(grandTotal, userProfile?.currencySymbol || "₹")}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm transition-colors disabled:opacity-50 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : mode === "edit" ? "Update Invoice" : "Create Proforma Invoice"}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
