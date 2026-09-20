import React from "react";
import {
  Package,
  Users,
  FilePlus,
  Calculator,
  Eye,
  FileCheck,
  Send,
  History,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

export default function BusinessWorkflow() {
  const workflowNodes = [
    {
      stage: "01",
      name: "Product Catalog",
      desc: "Standardized list of SKUs, pricing, billable units, and pre-configured GST rates.",
      category: "Foundational Data",
    },
    {
      stage: "02",
      name: "Client Database",
      desc: "Verified company profiles, contact people, GSTIN numbers, and billing addresses.",
      category: "Foundational Data",
    },
    {
      stage: "03",
      name: "Create Proforma",
      desc: "Instant assembly of quote with sequential number (e.g. PI-2026-001) and validity window.",
      category: "Generation",
    },
    {
      stage: "04",
      name: "GST Calculation",
      desc: "Automated calculation of line tax, subtotal, discount deductions, and final payable sum.",
      category: "Computation",
    },
    {
      stage: "05",
      name: "Review & Preview",
      desc: "Interactive preview matching the exact final printed document and words conversion.",
      category: "Quality Assurance",
    },
    {
      stage: "06",
      name: "Generate PDF",
      desc: "Pixel-perfect A4 printable PDF with bank instructions and authorized signatory seal.",
      category: "Document Output",
    },
    {
      stage: "07",
      name: "Send to Client",
      desc: "Deliver high-fidelity proforma invoice for purchase order approval and advance payment.",
      category: "Client Communication",
    },
    {
      stage: "08",
      name: "Invoice History",
      desc: "Full audit record with lifecycle statuses (Draft, Sent, Accepted, Declined) and metrics.",
      category: "Lifecycle Tracking",
    },
  ];

  return (
    <section id="workflow" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold tracking-wider uppercase">
            <span>Operational Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            A Better Invoicing Workflow for Your Business
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Here is how InvoBazar connects directly into your team&apos;s daily commercial
            operations — transforming fragmented files into an orderly, repeatable pipeline.
          </p>
        </div>

        {/* Structured Pipeline Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {workflowNodes.map((node, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50/50 transition-all shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0">
                      {node.stage}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">
                          {node.name}
                        </h4>
                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {node.category}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {node.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtle connecting connector indicator between items */}
                {i < workflowNodes.length - 1 && (
                  <div className="flex justify-center my-1.5">
                    <div className="w-0.5 h-3 bg-slate-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
