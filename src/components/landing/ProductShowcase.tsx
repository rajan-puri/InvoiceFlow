import React from "react";
import {
  Plus,
  Search,
  Printer,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  Building,
  Edit2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function ProductShowcase() {
  return (
    <section id="product" className="py-24 bg-white space-y-28">
      
      {/* ------------------------------------------------------------- */}
      {/* SHOWCASE 1: Manage Your Product Catalog */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Module 01: Product Catalog
            </span>
            <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
              Manage Your Product Catalog
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">
              Standardize your products and billable services once. Set predetermined SKU
              codes, standard units, descriptions, and tax rates to eliminate pricing
              confusion across your team.
            </p>
            <div className="pt-2 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Pre-configured GST slabs (0%, 5%, 12%, 18%, 28%)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Standard billing units (PCS, NOS, BOX, KG, HRS, SET)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Instant auto-completion inside the invoice generator</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              {/* Mockup App Header */}
              <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-xs font-semibold text-slate-700 ml-2">
                    InvoBazar / Products & Services
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  Add Product
                </button>
              </div>

              {/* Mockup Table */}
              <div className="p-4 sm:p-5 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-2 text-center">SKU</th>
                      <th className="py-2.5 px-2 text-center">Category</th>
                      <th className="py-2.5 px-2 text-center">Unit</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-2 text-right">GST %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    <tr>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">
                          Enterprise Cloud ERP Platform
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Annual subscription for multi-entity ERP
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-500">
                        ERP-ENT-01
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                          Software
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-medium">YR</td>
                      <td className="py-3 px-3 text-right font-bold">₹85,000.00</td>
                      <td className="py-3 px-2 text-right font-semibold">18%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">
                          Custom API Integration Service
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Developer sprint for webhooks & payment gateways
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-500">
                        SRV-INT-02
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200">
                          Services
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-medium">NOS</td>
                      <td className="py-3 px-3 text-right font-bold">₹45,000.00</td>
                      <td className="py-3 px-2 text-right font-semibold">18%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">
                          Dedicated Rackmount Server
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Intel Xeon 32-core, 128GB ECC RAM
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-500">
                        HW-SRV-03
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                          Hardware
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-medium">SET</td>
                      <td className="py-3 px-3 text-right font-bold">₹1,85,000.00</td>
                      <td className="py-3 px-2 text-right font-semibold">18%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SHOWCASE 2: Keep Client Details Ready */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              {/* Mockup Header */}
              <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-xs font-semibold text-slate-700 ml-2">
                    InvoBazar / Client Directory
                  </span>
                </div>
                <div className="relative w-44">
                  <input
                    type="text"
                    disabled
                    placeholder="Search GSTIN, name..."
                    className="w-full text-[11px] px-2.5 py-1 rounded border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Mockup Client Cards / Table */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-900 text-sm">
                        Horizon Media Dynamics Ltd
                      </span>
                    </div>
                    <p className="text-slate-500">
                      Attn: Aditi Rao • accounts@horizonmedia.in • +91 98200 44556
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      402, Lotus Grandeur, Veera Desai Road, Andheri West, Mumbai, MH - 400053
                    </p>
                  </div>
                  <div className="text-left sm:text-right space-y-1 shrink-0">
                    <span className="font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-[11px] inline-block">
                      27AAACH1234P1Z2
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-medium">
                      Verified GSTIN • Maharashtra
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-900 text-sm">
                        Apex Logistics India Pvt Ltd
                      </span>
                    </div>
                    <p className="text-slate-500">
                      Attn: Kunal Verma • kunal@apexlogistics.com • +91 99887 66554
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Plot 45, Udyog Vihar Phase 4, Gurugram, HR - 122015
                    </p>
                  </div>
                  <div className="text-left sm:text-right space-y-1 shrink-0">
                    <span className="font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-[11px] inline-block">
                      06AAACA9876Q1Z9
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-medium">
                      Verified GSTIN • Haryana
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Module 02: Client Master
            </span>
            <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
              Keep Client Details Ready
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">
              Eliminate repetitive data entry. Store your customers&apos; legal company
              name, contact people, billing addresses, delivery sites, and GSTIN numbers
              so they can be populated in one click.
            </p>
            <div className="pt-2 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>1-Click auto-fill into newly generated invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Separate billing & shipping address sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Clean GSTIN registration validation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SHOWCASE 3: Create Accurate GST Invoices */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Module 03: Calculation Engine
            </span>
            <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
              Create Accurate GST Invoices
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">
              Never worry about tax calculation mistakes again. InvoBazar computes item
              tax, subtotal, flexible discounts, and final totals dynamically on both client
              and server layers for ironclad accounting consistency.
            </p>
            <div className="pt-2 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Line-item base amount: (Quantity × Unit Price)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>GST Tax computation: (Base Amount × GST %)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Discounts: Percentage or fixed rupee deductions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Automatic Indian numbering words converter</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-mono font-bold text-blue-600">
                    PI-2026-003
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    Live Calculation Engine
                  </h4>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Calculated Automatically
                </span>
              </div>

              {/* Items summary */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-700">
                  <span>Item 1: Enterprise Cloud ERP (1 YR @ ₹85,000 + 18% GST)</span>
                  <span className="font-semibold text-slate-900 shrink-0">₹1,00,300.00</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-700">
                  <span>Item 2: Custom API Integration (1 NOS @ ₹45,000 + 18% GST)</span>
                  <span className="font-semibold text-slate-900 shrink-0">₹53,100.00</span>
                </div>
              </div>

              {/* Calculation Breakdown Panel */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal (Pre-tax Base Amount)</span>
                  <span className="font-semibold text-slate-800">₹1,30,000.00</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Special Project Discount (Flat)</span>
                  <span>-₹5,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxable Amount</span>
                  <span className="font-semibold text-slate-800">₹1,25,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Aggregate GST (18%)</span>
                  <span className="font-semibold text-slate-800">₹22,500.00</span>
                </div>
                <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Grand Total</span>
                  <span className="text-lg font-extrabold text-blue-600">₹1,47,500.00</span>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                  One Lakh Forty Seven Thousand Five Hundred Rupees Only
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SHOWCASE 4: Generate Professional PDFs */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Sheet Mockup */}
            <div className="rounded-2xl border border-slate-300 bg-white shadow-xl p-6 sm:p-8 text-slate-800 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase rounded">
                    PROFORMA INVOICE
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-2">
                    InvoBazar Technologies Pvt Ltd
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    GSTIN: 07AAAAA1234A1Z5
                  </p>
                  <p className="text-[11px] text-slate-400">
                    DLF Cyber City, Tower 10, Sector 24, Gurugram, Haryana - 122002
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Invoice Number</p>
                  <p className="font-mono font-bold text-blue-600 text-sm">PI-2026-001</p>
                  <p className="text-[11px] text-slate-500 mt-1">Date: 20 Sep 2026</p>
                  <p className="text-[11px] text-slate-500">Valid Until: 05 Oct 2026</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 block mb-1">
                    Bill To / Buyer
                  </span>
                  <p className="font-bold text-slate-900">Horizon Media Dynamics Ltd</p>
                  <p className="text-slate-500 font-mono text-[11px]">GSTIN: 27AAACH1234P1Z2</p>
                  <p className="text-slate-400 text-[11px]">Andheri West, Mumbai, MH - 400053</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 block mb-1">
                    Payment Terms
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    50% advance on PO confirmation. Remainder payable prior to delivery.
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[420px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                      <th className="py-2">Item</th>
                      <th className="py-2 text-right">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">GST</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td className="py-2 font-medium">Enterprise Cloud ERP Platform</td>
                      <td className="py-2 text-right">1</td>
                      <td className="py-2 text-right">₹85,000</td>
                      <td className="py-2 text-right">18%</td>
                      <td className="py-2 text-right font-bold">₹1,00,300</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Custom API Integration Service</td>
                      <td className="py-2 text-right">1</td>
                      <td className="py-2 text-right">₹45,000</td>
                      <td className="py-2 text-right">18%</td>
                      <td className="py-2 text-right font-bold">₹53,100</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer signature line */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                <span className="text-[10px] text-slate-400 italic">
                  Thank you for your business. System generated proforma.
                </span>
                <div className="text-right">
                  <div className="w-32 border-b border-slate-300 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700 block">
                    Authorized Signatory
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Module 04: Legal PDF Output
            </span>
            <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
              Generate Professional PDFs
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">
              Every proforma invoice adheres strictly to corporate invoicing norms.
              Download crisp, high-resolution PDFs ready to attach to quotation emails
              or print on company letterhead.
            </p>
            <div className="pt-2 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Optimized standard A4 portrait print margins</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Displays both Seller and Buyer GSTIN numbers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Custom terms, payment notes & authorized signatory block</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
