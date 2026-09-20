import React from "react";
import { Clock, ShieldCheck, Award, FolderKanban, Check } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Save Time",
      desc: "Reuse products and client information instead of entering everything repeatedly from scratch.",
      stat: "85% faster",
      statLabel: "proforma turnaround compared to manual spreadsheet drafting",
    },
    {
      title: "Reduce Manual Errors",
      desc: "Automated GST, discounts, and total calculations completely eliminate spreadsheet math blunders.",
      stat: "100% accurate",
      statLabel: "tax slabs and amount-in-words legal compliance",
    },
    {
      title: "Look Professional",
      desc: "Generate clean, consistent, and branded PDF invoices that inspire client trust and speed up PO sign-off.",
      stat: "A4 standard",
      statLabel: "optimized for Indian corporate & international trade protocols",
    },
    {
      title: "Stay Organized",
      desc: "Keep your clients, products, and full invoice lifecycle history neatly filed in one searchable system.",
      stat: "1 centralized",
      statLabel: "auditable repository of all commercial proposals",
    },
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold tracking-wider uppercase">
            <span>Direct Business Impact</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Spend Less Time Preparing Invoices. <br className="hidden sm:inline" />
            More Time Running Your Business.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every minute your team spends formatting cells or hunting for customer GSTINs
            is time taken away from client service and revenue-generating work.
          </p>
        </div>

        {/* 4 Benefits Layout (Clean 2x2 with clear typographic hierarchy) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="p-5 sm:p-8 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50/80 transition-colors flex flex-col justify-between space-y-5 sm:space-y-6"
            >
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest block">
                  Benefit 0{i + 1}
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {b.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <span className="text-lg font-bold text-slate-900 block">
                  {b.stat}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  {b.statLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
