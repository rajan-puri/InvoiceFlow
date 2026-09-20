"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Users,
  FileText,
  IndianRupee,
  Plus,
  ArrowRight,
  TrendingUp,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { DashboardStats, Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statusBadges: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700 border-slate-300",
    SENT: "bg-blue-50 text-blue-700 border-blue-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    DECLINED: "bg-red-50 text-red-700 border-red-200",
    EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-8 text-white shadow-lg shadow-blue-600/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
            Welcome to InvoBazar
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            Smart Invoicing for Indian Businesses. Create, preview, and download professional
            GST Proforma and Tax Invoices with accurate tax compliance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/invoices/new?type=PROFORMA"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Proforma
          </Link>
          <Link
            href="/invoices/new?type=TAX_INVOICE"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-900 text-white font-semibold text-xs sm:text-sm border border-blue-400/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Tax Invoice
          </Link>
        </div>
      </div>

      {/* 4 KPI Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Invoices */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Invoices
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? "..." : stats?.totalInvoices || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {stats?.proformaCount || 0} Proforma • {stats?.taxInvoiceCount || 0} Tax
          </p>
        </div>

        {/* Total Value */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Value
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 truncate">
            {loading ? "..." : formatCurrency(stats?.totalInvoiceValue || 0)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Cumulative proforma sum</p>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Products
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? "..." : stats?.totalProducts || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">In active inventory</p>
        </div>

        {/* Total Clients */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Clients
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? "..." : stats?.totalClients || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">Saved customer records</p>
        </div>
      </div>

      {/* Quick Launch Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/invoices/new"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
              New Proforma Invoice
            </h4>
            <p className="text-xs text-slate-500">Calculate GST & print PDF</p>
          </div>
        </Link>

        <Link
          href="/products"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
              Manage Products
            </h4>
            <p className="text-xs text-slate-500">Set prices, SKUs and GST %</p>
          </div>
        </Link>

        <Link
          href="/clients"
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
              Manage Clients
            </h4>
            <p className="text-xs text-slate-500">Store billing addresses & GSTINs</p>
          </div>
        </Link>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Recent Invoices</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest generated proforma records and payment statuses
            </p>
          </div>
          <Link
            href="/invoices"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            View All Invoices
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Loading recent invoices...
          </div>
        ) : stats?.recentInvoices && stats.recentInvoices.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {stats.recentInvoices.map((inv) => (
                <div key={inv.id} className="p-4 space-y-2.5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="font-mono font-bold text-sm text-blue-600 hover:underline block truncate"
                      >
                        {inv.invoiceNumber}
                      </Link>
                      <h4 className="font-semibold text-slate-900 text-sm mt-0.5 truncate">
                        {inv.clientCompanyName}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                          inv.documentType === "TAX_INVOICE"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {inv.documentType === "TAX_INVOICE" ? "Tax Invoice" : "Proforma"}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                          statusBadges[inv.status] || statusBadges.DRAFT
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <div>
                      <span>Date: {formatDate(inv.issueDate)}</span>
                    </div>
                    <div className="text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(inv.grandTotal)}
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-6">Invoice #</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-6">Client</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-4 text-right">Grand Total</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-medium text-blue-600">
                        <Link href={`/invoices/${inv.id}`} className="hover:underline">
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            inv.documentType === "TAX_INVOICE"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          {inv.documentType === "TAX_INVOICE" ? "Tax Invoice" : "Proforma"}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="font-semibold text-slate-800">
                          {inv.clientCompanyName}
                        </div>
                        {inv.clientContactPerson && (
                          <div className="text-xs text-slate-500">
                            {inv.clientContactPerson}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 text-xs">
                        {formatDate(inv.issueDate)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatCurrency(inv.grandTotal)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
                            statusBadges[inv.status] || statusBadges.DRAFT
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">No invoices generated yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by creating your first proforma invoice or load demo data to explore.
            </p>
            <div className="pt-2">
              <Link
                href="/invoices/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Create First Invoice
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
