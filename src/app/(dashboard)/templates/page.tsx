"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Palette,
  Layout,
  Type,
  Image,
  CreditCard,
  FileText,
  Sliders,
  Save,
  Check,
  Printer,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Plus,
  Building2,
  Eye,
  Columns,
  PenTool,
  Hash,
  ZoomIn,
  ZoomOut,
  ChevronDown,
} from "lucide-react";
import { Invoice, InvoiceTemplate, UserProfile, DocumentType } from "@/lib/types";
import { applyInvoicePrefix } from "@/lib/utils";
import {
  TEMPLATE_PRESETS,
  COLOR_PALETTES,
  FONT_FAMILIES,
  getDefaultTemplateConfig,
} from "@/lib/templates";
import TemplateInvoiceSheet from "@/components/invoices/TemplateInvoiceSheet";

// Sample invoice data with realistic long item names & descriptions
const SAMPLE_INVOICE: Invoice = {
  id: "preview-inv-001",
  userId: "preview-user",
  invoiceNumber: "PI-2026-088",
  issueDate: new Date(),
  validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  status: "SENT",
  documentType: "PROFORMA",
  clientCompanyName: "Acme Global Dynamics Pvt Ltd",
  clientContactPerson: "Vikram Malhotra",
  clientEmail: "accounts@acmeglobal.com",
  clientPhone: "+91 98200 12345",
  clientBillingAddress: "Tower B, 7th Floor, Cyber Greens, DLF Phase 3, Gurugram, HR - 122002",
  clientShippingAddress: "Warehouse 4, Khasra 82, Bilaspur Industrial Area, Gurugram - 122413",
  clientGstin: "06AAACA1122B1Z8",
  subtotal: 125000,
  discountType: "FIXED",
  discountValue: 5000,
  discountAmount: 5000,
  gstAmount: 21600,
  grandTotal: 141600,
  notes: "1. Proforma valid for 15 days from issue date.\n2. Please mention the invoice number in your wire transfer narration.",
  terms: "1. 50% advance for immediate onboarding.\n2. Applicable GST taxes as per statutory rules.\n3. Goods or services once delivered are non-refundable.",
  items: [
    {
      id: "item-1",
      productName: "Enterprise Multi-Cloud Infrastructure & Architecture Modernization Suite (Annual SLA)",
      sku: "INF-CLD-882",
      description: "Includes continuous zero-downtime deployment pipelines, distributed Redis caching cluster, Kubernetes orchestration, end-to-end TLS encryption, and 24/7 priority enterprise incident response team with guaranteed 15-minute response SLA.",
      quantity: 1,
      unit: "YR",
      unitPrice: 85000,
      gstRate: 18,
      taxAmount: 15300,
      amount: 85000,
      lineTotal: 100300,
    } as any,
    {
      id: "item-2",
      productName: "Custom Payment Gateway & Real-Time Webhook Dispatcher Integration",
      sku: "DEV-INT-09",
      description: "Dedicated developer sprint for automated payment reconciliation, webhook retry mechanisms, idempotency headers, and CRM sync.",
      quantity: 1,
      unit: "NOS",
      unitPrice: 40000,
      gstRate: 18,
      gstAmount: 6300,
      lineTotal: 41300,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function TemplatesPage() {
  const router = useRouter();

  // User and Saved Templates
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<InvoiceTemplate[]>([]);
  const [realInvoices, setRealInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("sample");
  const [previewDocType, setPreviewDocType] = useState<DocumentType>("PROFORMA");

  // Current active template being edited
  const [template, setTemplate] = useState<InvoiceTemplate>(getDefaultTemplateConfig());
  const [activeTab, setActiveTab] = useState<"layout" | "brand" | "table" | "payment" | "terms">("layout");

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Load initial templates, user profile, and user invoices
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [meRes, tmplRes, invRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/templates"),
          fetch("/api/invoices"),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
        }

        if (tmplRes.ok) {
          const tmplData = await tmplRes.json();
          const list: InvoiceTemplate[] = tmplData.templates || [];
          setSavedTemplates(list);

          const defaultTmpl = list.find((t) => t.isDefault) || list[0];
          if (defaultTmpl) {
            setTemplate(defaultTmpl);
          }
        }

        if (invRes.ok) {
          const invData = await invRes.json();
          setRealInvoices(invData.invoices || []);
        }
      } catch (err) {
        console.error("Failed to load template data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Compute the invoice to render in preview (either sample or user's selected real invoice)
  const activeInvoice = useMemo(() => {
    const base =
      selectedInvoiceId === "sample"
        ? SAMPLE_INVOICE
        : realInvoices.find((inv) => inv.id === selectedInvoiceId) || SAMPLE_INVOICE;

    const docType = selectedInvoiceId === "sample" ? previewDocType : (base.documentType || previewDocType);

    return {
      ...base,
      documentType: docType,
      invoiceNumber: applyInvoicePrefix(base.invoiceNumber, template.invoicePrefix),
    };
  }, [selectedInvoiceId, realInvoices, template.invoicePrefix, previewDocType]);

  // Apply a pre-built preset layout
  const handleApplyPreset = (presetId: string) => {
    const preset = TEMPLATE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setTemplate((prev) => ({
      ...prev,
      layoutStyle: preset.layoutStyle,
      primaryColor: preset.primaryColor,
      accentColor: preset.accentColor,
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      headerTitle: preset.headerTitle,
      headerSubtitle: preset.headerSubtitle,
    }));
  };

  // Save changes to current template or create new
  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      const isExisting = savedTemplates.some((t) => t.id === template.id);

      const url = isExisting ? `/api/templates/${template.id}` : "/api/templates";
      const method = isExisting ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
      });

      if (!res.ok) {
        throw new Error("Failed to save template");
      }

      const data = await res.json();
      const saved: InvoiceTemplate = data.template;

      setSavedTemplates((prev) => {
        const index = prev.findIndex((t) => t.id === saved.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = saved;
          return updated;
        }
        return [saved, ...prev];
      });

      setTemplate(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Save template error:", err);
      alert("Failed to save custom template. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Create new template from current state
  const handleCreateNew = () => {
    const newTmpl: InvoiceTemplate = {
      ...template,
      id: `new-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
    };
    setTemplate(newTmpl);
  };

  // Delete a saved template
  const handleDeleteTemplate = async (id: string) => {
    if (savedTemplates.length <= 1) {
      alert("You must keep at least one template.");
      return;
    }
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      if (res.ok) {
        const remaining = savedTemplates.filter((t) => t.id !== id);
        setSavedTemplates(remaining);
        if (template.id === id && remaining.length > 0) {
          setTemplate(remaining[0]);
        }
      }
    } catch (err) {
      console.error("Delete template error:", err);
    }
  };

  // Print / Save PDF
  const handlePrintPdf = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 text-sm">
        Loading invoice template visualizer...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions Bar */}
      <div className="no-print bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Visual Editor</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Invoice Template Customizer
          </h1>
          <p className="text-xs text-slate-500">
            Customize typography, branding, GST columns, payment details, and live-preview changes instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>

          <button
            onClick={handleSaveTemplate}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Template"}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: SETTINGS & CONTROLS (5 cols on lg) */}
        {/* ========================================================================= */}
        <div className="no-print lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Active Template Selector */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Active Custom Template
            </label>
            <div className="flex items-center gap-2">
              <select
                value={template.id}
                onChange={(e) => {
                  const found = savedTemplates.find((t) => t.id === e.target.value);
                  if (found) setTemplate(found);
                }}
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {savedTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.isDefault ? "(Default)" : ""}
                  </option>
                ))}
              </select>

              {savedTemplates.length > 1 && (
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  title="Delete this template"
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <input
                type="text"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                placeholder="Template name..."
                className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-900 w-2/3"
              />
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={template.isDefault}
                  onChange={(e) => setTemplate({ ...template, isDefault: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Set as Default</span>
              </label>
            </div>
          </div>

          {/* Settings Tabs */}
          <div className="flex border-b border-slate-200 bg-white overflow-x-auto">
            <button
              onClick={() => setActiveTab("layout")}
              className={`flex-1 min-w-[70px] py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === "layout"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Presets
            </button>
            <button
              onClick={() => setActiveTab("brand")}
              className={`flex-1 min-w-[70px] py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === "brand"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Brand
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`flex-1 min-w-[70px] py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === "table"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Columns
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`flex-1 min-w-[70px] py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === "payment"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Bank & UPI
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex-1 min-w-[70px] py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === "terms"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Terms
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="p-5 max-h-[calc(100vh-280px)] overflow-y-auto space-y-6 text-xs text-slate-700">
            {/* TAB 1: PRESETS & LAYOUT */}
            {activeTab === "layout" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Select Base Layout Architecture
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {TEMPLATE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                          template.layoutStyle === preset.layoutStyle
                            ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{preset.name}</span>
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: preset.primaryColor }}
                            >
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] leading-relaxed">
                            {preset.description}
                          </p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            backgroundColor:
                              template.layoutStyle === preset.layoutStyle ? preset.primaryColor : "#fff",
                          }}
                        >
                          {template.layoutStyle === preset.layoutStyle && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Header & Document Titles
                  </h3>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Document Title (Header)
                    </label>
                    <input
                      type="text"
                      value={template.headerTitle}
                      onChange={(e) => setTemplate({ ...template, headerTitle: e.target.value })}
                      placeholder="e.g. PROFORMA INVOICE"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Subtitle / Validity Caption
                    </label>
                    <input
                      type="text"
                      value={template.headerSubtitle || ""}
                      onChange={(e) => setTemplate({ ...template, headerSubtitle: e.target.value })}
                      placeholder="e.g. Valid for 15 business days"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Invoice Number Prefix
                      </label>
                      <span className="text-[10px] font-mono text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        Live: {activeInvoice.invoiceNumber}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={template.invoicePrefix || ""}
                      onChange={(e) => setTemplate({ ...template, invoicePrefix: e.target.value })}
                      placeholder="e.g. PI-, INV-, TEST-"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-400">Quick chips:</span>
                      {["PI-", "INV-", "TEST-", "EST-"].map((pfx) => (
                        <button
                          key={pfx}
                          type="button"
                          onClick={() => setTemplate({ ...template, invoicePrefix: pfx })}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                            template.invoicePrefix === pfx
                              ? "bg-blue-600 text-white border-blue-600 font-bold"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {pfx}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BRANDING & COLORS */}
            {activeTab === "brand" && (
              <div className="space-y-5">
                {/* Logo Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Company Logo
                    </h3>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={template.showLogo}
                        onChange={(e) => setTemplate({ ...template, showLogo: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span className="text-xs font-medium">Show Logo</span>
                    </label>
                  </div>

                  {template.showLogo && (
                    <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Logo Image URL
                        </label>
                        <input
                          type="url"
                          value={template.logoUrl || ""}
                          onChange={(e) => setTemplate({ ...template, logoUrl: e.target.value })}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                          <span>Logo Width: {template.logoWidth}px</span>
                        </div>
                        <input
                          type="range"
                          min="80"
                          max="220"
                          value={template.logoWidth}
                          onChange={(e) =>
                            setTemplate({ ...template, logoWidth: Number(e.target.value) })
                          }
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Company Details Toggle */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Show Seller Company Profile</span>
                      <p className="text-[11px] text-slate-500">
                        Includes Company Name, GSTIN, Address, Phone & Email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={template.showCompanyDetails}
                      onChange={(e) =>
                        setTemplate({ ...template, showCompanyDetails: e.target.checked })
                      }
                      className="rounded text-blue-600"
                    />
                  </label>
                </div>

                {/* Color Palette */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Primary Brand Color
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={template.primaryColor}
                      onChange={(e) => setTemplate({ ...template, primaryColor: e.target.value })}
                      className="w-10 h-10 p-0.5 rounded-lg border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={template.primaryColor}
                      onChange={(e) => setTemplate({ ...template, primaryColor: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono w-28 uppercase"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">Recommended Palettes:</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {COLOR_PALETTES.map((pal) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() =>
                          setTemplate({
                            ...template,
                            primaryColor: pal.primary,
                            accentColor: pal.accent,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 text-[11px] hover:bg-slate-100"
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: pal.primary }}
                        />
                        <span>{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Typography & Font Scale
                  </h3>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Font Family
                    </label>
                    <select
                      value={template.fontFamily}
                      onChange={(e) =>
                        setTemplate({ ...template, fontFamily: e.target.value as any })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      {FONT_FAMILIES.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Font Size Scaling
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["compact", "normal", "spacious"] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setTemplate({ ...template, fontSize: sz })}
                          className={`py-1.5 text-xs font-semibold rounded-lg border capitalize ${
                            template.fontSize === sz
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TABLE COLUMNS */}
            {activeTab === "table" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Toggle Item Table Columns
                </h3>
                <p className="text-[11px] text-slate-500">
                  Configure which data columns appear on the generated invoice and PDF.
                </p>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Index Column (#)</span>
                      <p className="text-[11px] text-slate-500">Row numbering (1, 2, 3...)</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={template.showIndex}
                      onChange={(e) => setTemplate({ ...template, showIndex: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">SKU / Product Code Column</span>
                      <p className="text-[11px] text-slate-500">Display item SKU identifier</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={template.showSku}
                      onChange={(e) => setTemplate({ ...template, showSku: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Unit of Measurement (UOM)</span>
                      <p className="text-[11px] text-slate-500">e.g. PCS, NOS, YR, HRS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={template.showUnit}
                      onChange={(e) => setTemplate({ ...template, showUnit: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">GST Percentage Rate</span>
                      <p className="text-[11px] text-slate-500">Display 0%, 5%, 12%, 18%, 28%</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={template.showGstRate}
                      onChange={(e) => setTemplate({ ...template, showGstRate: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">GST Tax Amount Column</span>
                      <p className="text-[11px] text-slate-500">Calculated monetary tax value per line item</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={template.showGstAmount}
                      onChange={(e) =>
                        setTemplate({ ...template, showGstAmount: e.target.checked })
                      }
                      className="rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-800">Discount Breakdown</span>
                      <p className="text-[11px] text-slate-500">Show line deduction in summary totals</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={template.showDiscount}
                      onChange={(e) =>
                        setTemplate({ ...template, showDiscount: e.target.checked })
                      }
                      className="rounded text-blue-600"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB 4: BANK & REMITTANCE */}
            {activeTab === "payment" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bank Remittance & UPI
                  </h3>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.showBankDetails}
                      onChange={(e) =>
                        setTemplate({ ...template, showBankDetails: e.target.checked })
                      }
                      className="rounded text-blue-600"
                    />
                    <span className="text-xs font-medium">Show on Invoice</span>
                  </label>
                </div>

                {template.showBankDetails && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={template.bankName || ""}
                        onChange={(e) => setTemplate({ ...template, bankName: e.target.value })}
                        placeholder="e.g. HDFC Bank Ltd"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        value={template.accountNumber || ""}
                        onChange={(e) =>
                          setTemplate({ ...template, accountNumber: e.target.value })
                        }
                        placeholder="e.g. 50200012345678"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={template.ifscCode || ""}
                        onChange={(e) =>
                          setTemplate({ ...template, ifscCode: e.target.value.toUpperCase() })
                        }
                        placeholder="e.g. HDFC0001234"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Branch Name
                      </label>
                      <input
                        type="text"
                        value={template.branchName || ""}
                        onChange={(e) => setTemplate({ ...template, branchName: e.target.value })}
                        placeholder="e.g. Cyber City Branch, Gurugram"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        UPI ID (Instant wire transfer)
                      </label>
                      <input
                        type="text"
                        value={template.upiId || ""}
                        onChange={(e) => setTemplate({ ...template, upiId: e.target.value })}
                        placeholder="e.g. company@hdfcbank"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: TERMS, NOTES & SIGNATURE */}
            {activeTab === "terms" && (
              <div className="space-y-4">
                {/* Notes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Standard Notes & Remarks
                    </label>
                    <input
                      type="checkbox"
                      checked={template.showNotes}
                      onChange={(e) => setTemplate({ ...template, showNotes: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                  </div>
                  {template.showNotes && (
                    <textarea
                      rows={3}
                      value={template.notes || ""}
                      onChange={(e) => setTemplate({ ...template, notes: e.target.value })}
                      placeholder="Enter default notes..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed"
                    />
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Terms & Conditions
                    </label>
                    <input
                      type="checkbox"
                      checked={template.showTerms}
                      onChange={(e) => setTemplate({ ...template, showTerms: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                  </div>
                  {template.showTerms && (
                    <textarea
                      rows={3}
                      value={template.terms || ""}
                      onChange={(e) => setTemplate({ ...template, terms: e.target.value })}
                      placeholder="Enter legal terms..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed"
                    />
                  )}
                </div>

                {/* Signature Settings */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Authorized Signatory
                    </label>
                    <input
                      type="checkbox"
                      checked={template.showSignature}
                      onChange={(e) =>
                        setTemplate({ ...template, showSignature: e.target.checked })
                      }
                      className="rounded text-blue-600"
                    />
                  </div>
                  {template.showSignature && (
                    <div className="space-y-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Signatory Title
                        </label>
                        <input
                          type="text"
                          value={template.signatureTitle || ""}
                          onChange={(e) =>
                            setTemplate({ ...template, signatureTitle: e.target.value })
                          }
                          placeholder="e.g. Authorized Signatory"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Signature Image URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={template.signatureUrl || ""}
                          onChange={(e) =>
                            setTemplate({ ...template, signatureUrl: e.target.value })
                          }
                          placeholder="https://example.com/signature.png"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer disclaimer */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <label className="block text-[11px] font-semibold text-slate-600">
                    Footer Caption / Disclaimer
                  </label>
                  <input
                    type="text"
                    value={template.footerText || ""}
                    onChange={(e) => setTemplate({ ...template, footerText: e.target.value })}
                    placeholder="e.g. Thank you for your business!"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE LIVE PREVIEW (7 cols on lg) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live Preview Control Toolbar */}
          <div className="no-print bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                Preview Data:
              </span>
              <select
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="sample">Sample Proforma Invoice (Demo)</option>
                {realInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {inv.clientCompanyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Type Preview Mode Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] hidden sm:inline">
                Mode:
              </span>
              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-100/70">
                <button
                  type="button"
                  onClick={() => setPreviewDocType("PROFORMA")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                    previewDocType === "PROFORMA"
                      ? "bg-white text-purple-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Proforma
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDocType("TAX_INVOICE")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                    previewDocType === "TAX_INVOICE"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Tax Invoice
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Zoom:</span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-600 text-[11px] w-10 text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Realistic A4 Paper Live Viewport */}
          <div className="bg-slate-200/70 p-4 sm:p-6 rounded-2xl border border-slate-300/80 shadow-inner flex justify-center overflow-x-auto">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out",
                width: "100%",
                maxWidth: "850px",
              }}
            >
              <TemplateInvoiceSheet
                invoice={activeInvoice}
                template={template}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
