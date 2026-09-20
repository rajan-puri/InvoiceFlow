"use client";

import React, { useRef, useState, useEffect } from "react";
import { Invoice, InvoiceTemplate, UserProfile } from "@/lib/types";
import { Printer, ArrowLeft, Palette, Sliders, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getDefaultTemplateConfig } from "@/lib/templates";
import TemplateInvoiceSheet from "./TemplateInvoiceSheet";

interface InvoicePreviewProps {
  invoice: Invoice;
  user?: UserProfile | null;
  template?: InvoiceTemplate | null;
  onBack?: () => void;
  showActions?: boolean;
}

export default function InvoicePreview({
  invoice,
  user,
  template: initialTemplate,
  onBack,
  showActions = true,
}: InvoicePreviewProps) {
  const [activeTemplate, setActiveTemplate] = useState<InvoiceTemplate>(
    initialTemplate || getDefaultTemplateConfig()
  );
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/templates");
        if (res.ok) {
          const data = await res.json();
          if (data.templates && data.templates.length > 0) {
            setTemplates(data.templates);
            if (!initialTemplate) {
              const defaultTmpl =
                data.templates.find((t: InvoiceTemplate) => t.isDefault) ||
                data.templates[0];
              setActiveTemplate(defaultTmpl);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load templates:", err);
      }
    }
    fetchTemplates();
  }, [initialTemplate]);

  const handlePrint = () => {
    window.print();
  };

  const statusColors = {
    DRAFT: "bg-slate-100 text-slate-700 border-slate-300",
    SENT: "bg-blue-50 text-blue-700 border-blue-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DECLINED: "bg-red-50 text-red-700 border-red-200",
    EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action & Template Selection Bar */}
      {showActions && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between no-print bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <Link
                href="/invoices"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Invoices
              </Link>
            )}
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                statusColors[invoice.status] || statusColors.DRAFT
              }`}
            >
              {invoice.status}
            </span>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                invoice.documentType === "TAX_INVOICE"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              {invoice.documentType === "TAX_INVOICE" ? "Tax Invoice" : "Proforma Invoice"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Template Selector Dropdown */}
            {templates.length > 0 && (
              <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 w-full sm:w-auto">
                <Palette className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={activeTemplate.id}
                  onChange={(e) => {
                    const chosen = templates.find((t) => t.id === e.target.value);
                    if (chosen) setActiveTemplate(chosen);
                  }}
                  className="w-full sm:w-auto px-2.5 py-2 sm:py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      Template: {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-center"
              title="Open Template Customizer Editor"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Customize</span>
            </Link>

            <Link
              href={`/invoices/${invoice.id}/edit`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center"
            >
              Edit
            </Link>

            <button
              onClick={handlePrint}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm w-full sm:w-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Render Selected Customized Template Sheet */}
      <TemplateInvoiceSheet
        invoice={invoice}
        template={activeTemplate}
        user={user}
      />
    </div>
  );
}
