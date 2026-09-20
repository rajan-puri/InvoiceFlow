import React from "react";
import { XCircle, CheckCircle, ArrowRight, AlertTriangle, Zap } from "lucide-react";

export default function ProblemSection() {
  const manualSteps = [
    { title: "Open Spreadsheets", desc: "Digging through past files for old prices" },
    { title: "Calculate GST Manually", desc: "Risk of tax slab errors and formula mistakes" },
    { title: "Find Client Details", desc: "Searching emails and WhatsApp for GSTINs" },
    { title: "Format Word / Docs", desc: "Fragile tables breaking alignment on export" },
    { title: "Convert to PDF", desc: "Inconsistent layouts and unprofessional fonts" },
    { title: "Manual Sending", desc: "No centralized history or status tracking" },
  ];

  const invoBazarSteps = [
    { title: "1-Click Client Select", desc: "Saved GSTIN, billing & delivery addresses" },
    { title: "Reusable Catalog", desc: "Pre-configured SKUs, units & GST tax slabs" },
    { title: "Instant Auto-Compute", desc: "Subtotal, tax amounts, and discounts calculated" },
    { title: "Live Real-Time Preview", desc: "Verify totals and legal text before finalizing" },
    { title: "1-Click A4 PDF Export", desc: "Pixel-perfect, GST-compliant print document" },
    { title: "Lifecycle History", desc: "Searchable records with status updates" },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold tracking-wider uppercase">
            <span>The Traditional Bottleneck</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Stop Building Invoices Manually.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Managing product details, client information, GST calculations and invoice
            documents manually creates unnecessary work and increases the chance of mistakes.
          </p>
        </div>

        {/* Visual Workflow Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: The Fragmented Manual Method */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-slate-900">
                  The Frustrating Manual Method
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
                Slow & Error-Prone
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Juggling spreadsheets, text documents, tax tables, and email threads consumes hours
              every week and risks costly billing discrepancies.
            </p>

            <div className="space-y-3">
              {manualSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800 block">
                      {step.title}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The Streamlined InvoBazar Method */}
          <div className="rounded-2xl border-2 border-blue-600/30 bg-blue-50/20 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-blue-200 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  The Unified InvoBazar System
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/60 border border-blue-200 px-2.5 py-0.5 rounded">
                Fast & Automated
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              A single cohesive interface brings your client database, product catalog, GST rules,
              and PDF rendering into an unbroken two-minute flow.
            </p>

            <div className="space-y-3">
              {invoBazarSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white border border-blue-100 shadow-xs text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 block">
                      {step.title}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
