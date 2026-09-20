"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Printer,
  Calendar,
  Filter,
} from "lucide-react";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("");

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedStatus) params.set("status", selectedStatus);
      if (selectedDocType) params.set("documentType", selectedDocType);

      const res = await fetch(`/api/invoices?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
      }
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus, selectedDocType]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDelete = async (id: string, invoiceNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchInvoices();
      } else {
        alert("Failed to delete invoice");
      }
    } catch (err) {
      console.error("Delete invoice error:", err);
    }
  };

  const statusBadges: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700 border-slate-300",
    SENT: "bg-blue-50 text-blue-700 border-blue-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DECLINED: "bg-red-50 text-red-700 border-red-200",
    EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Documents & Invoices</h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse, manage, print and track Proforma Invoices and official GST Tax Invoices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/invoices/new?type=PROFORMA"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-semibold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Proforma
          </Link>
          <Link
            href="/invoices/new?type=TAX_INVOICE"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Tax Invoice
          </Link>
        </div>
      </div>

      {/* Document Type Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setSelectedDocType("")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedDocType === ""
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All Documents
        </button>
        <button
          type="button"
          onClick={() => setSelectedDocType("PROFORMA")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedDocType === "PROFORMA"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Proforma Invoices
        </button>
        <button
          type="button"
          onClick={() => setSelectedDocType("TAX_INVOICE")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedDocType === "TAX_INVOICE"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Tax Invoices
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice #, client name, email..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="text-xs font-medium px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 w-full sm:w-auto"
          >
            <option value="">All Document Types</option>
            <option value="PROFORMA">Proforma Invoice</option>
            <option value="TAX_INVOICE">Tax Invoice</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-medium px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DECLINED">Declined</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading invoices...
          </div>
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Invoice #</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-6">Client / Company</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Due / Validity</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">
                      <Link href={`/invoices/${inv.id}`} className="hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                          inv.documentType === "TAX_INVOICE"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {inv.documentType === "TAX_INVOICE" ? "Tax Invoice" : "Proforma"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">
                        {inv.clientCompanyName}
                      </div>
                      {inv.clientContactPerson && (
                        <div className="text-xs text-slate-500">
                          {inv.clientContactPerson}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600">
                      {formatDate(inv.issueDate)}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600">
                      {formatDate(inv.validUntil)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(inv.grandTotal)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
                          statusBadges[inv.status] || statusBadges.DRAFT
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="View / Print Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/invoices/${inv.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">
              {search || selectedStatus
                ? "No invoices match the filter criteria"
                : "No proforma invoices generated yet"}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create a new proforma invoice to select items, calculate GST and print or export.
            </p>
            <div className="pt-2">
              <Link
                href="/invoices/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Generate Proforma Invoice
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
