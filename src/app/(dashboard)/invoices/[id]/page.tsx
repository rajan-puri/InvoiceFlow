"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { Invoice, UserProfile } from "@/lib/types";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInvoice() {
      try {
        setLoading(true);
        const [invRes, meRes] = await Promise.all([
          fetch(`/api/invoices/${id}`),
          fetch("/api/auth/me"),
        ]);

        if (!invRes.ok) {
          throw new Error("Invoice not found");
        }

        const invData = await invRes.json();
        setInvoice(invData.invoice);

        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
        }
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
        Loading invoice details...
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
      <InvoicePreview invoice={invoice} user={user} template={invoice.template || null} />
    </div>
  );
}
