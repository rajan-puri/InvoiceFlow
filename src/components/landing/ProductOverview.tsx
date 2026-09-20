import React from "react";
import {
  Package,
  Users,
  Calculator,
  Printer,
  History,
  Check,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ProductOverview() {
  const capabilities = [
    {
      title: "Product Catalog Management",
      subtitle: "Reusable item master with fixed tax slabs",
      desc: "Stop retyping item names, rates, and codes every single time. Maintain a central catalog with SKU codes, unit types, descriptions, categories, and preset GST rates (0%, 5%, 12%, 18%, 28%).",
      features: [
        "Standardized SKU codes & descriptions",
        "Configurable units (PCS, NOS, BOX, KG, HRS, SET)",
        "Pre-assigned GST tax slabs",
        "Instant item picker in invoice builder",
      ],
      tag: "Catalog Hub",
    },
    {
      title: "Client & Taxpayer Directory",
      subtitle: "Comprehensive buyer profiles & addresses",
      desc: "Store detailed customer records including company name, contact person, email, telephone, billing address, shipping destination, and 15-digit GSTIN tax IDs.",
      features: [
        "Verified GSTIN storage per client",
        "Separate billing & delivery addresses",
        "Instant one-click client auto-fill",
        "Contact person & email tracking",
      ],
      tag: "Client Hub",
    },
    {
      title: "GST-Ready Computation Engine",
      subtitle: "Zero-error multi-tier tax & discount calculation",
      desc: "InvoBazar automatically calculates item base values, individual tax amounts, subtotal, flexible percentage or flat discount deductions, aggregate GST, and the final grand total in real-time.",
      features: [
        "Automated line-item tax calculation",
        "Percentage or flat discount deductions",
        "Dynamic grand total updates",
        "Automatic legal number-to-words generation",
      ],
      tag: "Tax Engine",
    },
    {
      title: "Pixel-Perfect PDF Generation",
      subtitle: "Bank-ready professional proforma documents",
      desc: "Export sleek, high-resolution A4 portrait Proforma Invoices configured with your seller brand details, GSTIN, payment bank details, custom terms & conditions, and authorized signatory seals.",
      features: [
        "Standardized Indian & international A4 layout",
        "Crisp print and Save-as-PDF fidelity",
        "Custom terms, conditions & payment remarks",
        "Official authorized signatory stamp block",
      ],
      tag: "PDF Export",
    },
    {
      title: "Lifecycle History & Status Tracking",
      subtitle: "Complete visibility over all issued proformas",
      desc: "Never lose track of a quotation. Review previous invoices, track lifecycle statuses (Draft, Sent, Accepted, Declined, Expired), and edit or duplicate invoices as negotiations evolve.",
      features: [
        "Status pipeline (Draft, Sent, Accepted)",
        "Searchable invoice archive",
        "Edit and recalculate anytime",
        "Aggregated revenue & volume metrics",
      ],
      tag: "Audit Trail",
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold tracking-wider uppercase">
            <span>Complete Invoicing Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Everything You Need to Manage Your Invoicing Workflow
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            InvoBazar is not just a quick generator. It is a unified management suite
            designed to eliminate administrative drag from your sales and billing pipeline.
          </p>
        </div>

        {/* Structured Capabilities List */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 hover:border-slate-300 transition-colors shadow-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Left: Title, Description & Badge */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {cap.tag}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Phase 0{i + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {cap.title}
                  </h3>

                  <p className="text-xs font-medium text-blue-600">
                    {cap.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>

                {/* Right: Key Spec Bullets */}
                <div className="md:col-span-5 bg-slate-50/70 rounded-xl p-4 border border-slate-100 space-y-2.5 text-xs text-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Key Functionality
                  </span>
                  {cap.features.map((feat, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
          >
            <span>Explore all features inside the application</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
