import React from "react";
import { UserCheck, PackageCheck, Calculator, FileCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Add Your Client",
      desc: "Save client details once — including legal company name, GSTIN, contact person, and billing/shipping addresses.",
      detail: "1-Click auto-fill for future invoices",
    },
    {
      number: "02",
      title: "Select Products",
      desc: "Choose items or services directly from your pre-configured catalog with preset pricing, units, and GST tax slabs.",
      detail: "No manual price re-entry required",
    },
    {
      number: "03",
      title: "Review & Calculate",
      desc: "InvoBazar automatically calculates item tax, subtotal, percentage or flat discounts, and the final grand total.",
      detail: "Live interactive preview before saving",
    },
    {
      number: "04",
      title: "Generate & Share",
      desc: "Export an official, pixel-perfect A4 Proforma Invoice PDF to deliver directly to your client or procurement team.",
      detail: "Ready for printing or email attachment",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold tracking-wider uppercase">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            From Client Details to PDF in 4 Simple Steps
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Create error-free proforma invoices in less than two minutes without
            navigating tangled accounting menus.
          </p>
        </div>

        {/* Steps Grid with Continuous Connecting Line */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line behind numbers (desktop) */}
          <div className="hidden lg:block absolute top-10 left-12 right-12 h-0.5 bg-slate-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-mono font-bold text-base flex items-center justify-center shadow-sm">
                    {step.number}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-blue-600 block">
                    ✓ {step.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA button */}
        <div className="mt-16 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
          >
            <span>Try It Yourself — Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
