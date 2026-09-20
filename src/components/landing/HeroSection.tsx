import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Printer,
  FileSpreadsheet,
  Building,
  User,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wider uppercase">
              <span>SMART INVOICING FOR INDIAN BUSINESSES</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black text-slate-950 tracking-tight leading-[1.15] sm:leading-[1.12]">
              Create Professional <br />
              <span className="text-blue-600">Proforma & Tax Invoices</span> <br />
              in Minutes.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              InvoBazar helps businesses, agencies and freelancers create accurate
              GST-ready Proforma and Tax Invoices, manage products and clients, and generate
              professional PDFs — all from one unified place.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
              >
                <span>Start Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200 transition-colors"
              >
                Watch How It Works
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-600" />
                <span>GST ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-blue-600" />
                <span>Generate PDF instantly</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Product UI Mockup */}
          <div className="lg:col-span-6 relative">
            {/* Subtle Annotation Label */}
            <div className="absolute -top-3.5 right-6 z-20 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full shadow-md">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>From products to PDF — in minutes.</span>
            </div>

            {/* Window Container */}
            <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
              {/* Window Header / Window Chrome */}
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-[11px] font-mono font-medium text-slate-500 ml-2">
                    invobazar.in/invoices/new
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Live Calculator
                </span>
              </div>

              {/* Inner UI Layout: Sidebar Snippet + Builder Canvas */}
              <div className="flex bg-slate-50/50">
                {/* Micro Sidebar */}
                <div className="w-14 bg-slate-900 py-4 flex flex-col items-center gap-4 text-slate-400 border-r border-slate-800 shrink-0 hidden sm:flex">
                  <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="w-6 h-6 rounded bg-slate-800 text-blue-400 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-6 h-6 rounded flex items-center justify-center text-slate-500">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-6 h-6 rounded flex items-center justify-center text-slate-500">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Main Proforma Canvas */}
                <div className="p-4 sm:p-5 flex-1 bg-white space-y-4 text-slate-800">
                  {/* Top Bar of Builder */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        Proforma Invoice
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 font-mono">
                        PI-2026-001
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Status: Draft
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 rounded-md shadow-xs"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Client & Date Info Block */}
                  <div className="grid grid-cols-2 gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Client / Bill To
                      </span>
                      <span className="font-bold text-slate-800 block truncate">
                        Acme Global Tech Ltd.
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        GSTIN: 29AAAAA0000A1Z5
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Dates
                      </span>
                      <span className="text-slate-700 block">
                        Issued: <strong className="text-slate-800">20 Sep 2026</strong>
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Valid Until: 05 Oct 2026
                      </span>
                    </div>
                  </div>

                  {/* Product Rows Table */}
                  <div className="border border-slate-100 rounded-lg overflow-x-auto">
                    <table className="w-full text-left text-[11px] min-w-[360px]">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-100">
                        <tr>
                          <th className="py-2 px-2.5">Item</th>
                          <th className="py-2 px-2 text-center">SKU</th>
                          <th className="py-2 px-2 text-right">Qty</th>
                          <th className="py-2 px-2 text-right">Price</th>
                          <th className="py-2 px-2 text-right">GST</th>
                          <th className="py-2 px-2.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        <tr>
                          <td className="py-2 px-2.5 font-medium text-slate-800">
                            Enterprise Cloud ERP
                          </td>
                          <td className="py-2 px-2 text-center font-mono text-slate-400">
                            ERP-01
                          </td>
                          <td className="py-2 px-2 text-right font-semibold">1</td>
                          <td className="py-2 px-2 text-right">₹85,000</td>
                          <td className="py-2 px-2 text-right text-slate-600">18%</td>
                          <td className="py-2 px-2.5 text-right font-bold text-slate-900">
                            ₹1,00,300
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2.5 font-medium text-slate-800">
                            API Integration Sprint
                          </td>
                          <td className="py-2 px-2 text-center font-mono text-slate-400">
                            SRV-02
                          </td>
                          <td className="py-2 px-2 text-right font-semibold">1</td>
                          <td className="py-2 px-2 text-right">₹45,000</td>
                          <td className="py-2 px-2 text-right text-slate-600">18%</td>
                          <td className="py-2 px-2.5 text-right font-bold text-slate-900">
                            ₹53,100
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Calculations Breakdown */}
                  <div className="flex justify-end pt-1">
                    <div className="w-full sm:w-56 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-800">₹1,30,000.00</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST (18%)</span>
                        <span className="font-semibold text-slate-800">₹23,400.00</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-bold text-slate-900">
                        <span>Grand Total</span>
                        <span className="text-blue-600">₹1,53,400.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
