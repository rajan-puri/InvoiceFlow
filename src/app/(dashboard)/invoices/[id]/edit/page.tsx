"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Invoice } from "@/lib/types";

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInvoice() {
      try {
        setLoading(true);
        const res = await fetch(`/api/invoices/${id}`);
        if (!res.ok) {
          throw new Error("Invoice not found");
        }
        const data = await res.json();
        setInvoice(data.invoice);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load invoice");
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadInvoice();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm">
        Loading invoice for editing...
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-red-600 font-medium">{error || "Invoice not found"}</p>
        <button
          onClick={() => router.push("/invoices")}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg"
        >
          Return to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/invoices/${id}`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Edit {invoice.documentType === "TAX_INVOICE" ? "Tax Invoice" : "Proforma Invoice"} {invoice.invoiceNumber}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Modify invoice items, prices, discounts, and recalculate totals
          </p>
        </div>
      </div>

      <InvoiceForm mode="edit" initialInvoice={invoice} />
    </div>
  );
}
