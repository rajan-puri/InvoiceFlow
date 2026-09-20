"use client";

import React from "react";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewInvoicePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/invoices"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Document
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Select document type (Proforma or Tax Invoice), choose client, add items, and generate live preview or PDF
          </p>
        </div>
      </div>

      <InvoiceForm mode="create" />
    </div>
  );
}
