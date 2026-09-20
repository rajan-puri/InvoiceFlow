import React from "react";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AudienceSection() {
  const audiences = [
    {
      role: "Small & Growing Businesses",
      tagline: "Professional invoicing without the bloated ERP overhead",
      desc: "Traditional accounting suites are built for chartered accountants, not business operators. InvoBazar gives small enterprise teams the exact tools they need to prepare commercial quotes, apply GST rates, and collect advance payments without complexity.",
      highlights: [
        "Issue compliant quotes in under 2 minutes",
        "Maintain standardized SKU catalog & rates",
        "Clear payment terms & bank transfer instructions",
        "Multi-tax GST slab support (0%, 5%, 12%, 18%, 28%)",
      ],
      badge: "Commercial Operators",
    },
    {
      role: "Agencies & Design Consultancies",
      tagline: "Deliver high-value quotations that match your design standards",
      desc: "When pitching enterprise clients, your documentation reflects your brand caliber. InvoBazar lets agencies organize custom retainer packages, software sprints, and consulting deliverables with spotless typography and verified client GSTIN numbers.",
      highlights: [
        "Multiple client entities & delivery addresses",
        "Flexible line items for sprints and retainers",
        "Clear discount and milestone terms",
        "Instant branded A4 PDF export",
      ],
      badge: "Creative & Tech Studios",
    },
    {
      role: "Freelancers & Independent Contractors",
      tagline: "Look like an established company from day one",
      desc: "Freelancers often struggle with messy Word templates and manual GST calculations. InvoBazar empowers independent professionals to look thoroughly established, calculate tax accurately, and keep full track of pending and accepted quotations.",
      highlights: [
        "Pre-saved hourly or project fee rates",
        "Legal amount in words generated automatically",
        "Centralized audit trail of issued proformas",
        "Zero accounting learning curve",
      ],
      badge: "Independent Pros",
    },
  ];

  return (
    <section id="for-businesses" className="py-12 sm:py-20 lg:py-24 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold tracking-wider uppercase">
            <span>Tailored For Your Scale</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Built for the Way Modern Businesses Work
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Whether you are an independent consultant or an expanding service firm,
            InvoBazar matches the rhythm of modern commercial operations.
          </p>
        </div>

        {/* 3 Audience Breakdown Rows */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {audiences.map((aud, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 hover:border-slate-300 transition-colors shadow-xs"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {aud.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {aud.role}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600">
                    {aud.tagline}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {aud.desc}
                  </p>
                </div>

                <div className="lg:col-span-5 bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-2 text-xs text-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Key Practical Advantages
                  </span>
                  {aud.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
