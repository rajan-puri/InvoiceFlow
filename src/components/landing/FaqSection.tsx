"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is a Proforma Invoice?",
      a: "A Proforma Invoice is a preliminary commercial quotation delivered to buyers before goods are shipped or services are rendered. It specifies the item descriptions, quantities, unit rates, delivery terms, and estimated GST taxes so the client can generate a Purchase Order (PO) or release advance milestone payments.",
    },
    {
      q: "Does InvoBazar support Indian GST regulations?",
      a: "Yes. InvoBazar is engineered specifically to handle Indian GST compliance. You can assign individual GST rates (0%, 5%, 12%, 18%, 28%) to catalog products, record 15-digit GSTIN tax IDs for both seller and buyer, calculate aggregate tax automatically, and convert grand totals into legal Indian rupee words format.",
    },
    {
      q: "Can I save my products and services for reuse?",
      a: "Absolutely. The Product Catalog lets you store product names, SKU codes, units (PCS, NOS, BOX, KG, HRS, SET), standard pricing, and descriptions. When drafting a new proforma, selecting a product instantly auto-populates all details into the line item.",
    },
    {
      q: "Can I save client information and addresses?",
      a: "Yes. The Client Directory stores legal company names, contact people, billing addresses, shipping destinations, and GSTIN numbers. When drafting an invoice, choosing the client fills the buyer section with 100% accuracy in one click.",
    },
    {
      q: "Can I generate and download official PDF invoices?",
      a: "Yes. Every invoice includes a dedicated preview and one-click 'Print / Save as PDF' output. It uses custom A4 portrait styles that print cleanly with your company branding, client details, item table, payment instructions, and authorized signature block.",
    },
    {
      q: "Can I edit or duplicate previous invoices?",
      a: "Yes. Invoices can be edited at any time. When you modify quantities, rates, or discounts, InvoBazar recalculates line items, taxes, and grand totals automatically. You can also track invoice statuses through Draft, Sent, Accepted, Declined, and Expired.",
    },
    {
      q: "Can I use InvoBazar for my agency or consultancy?",
      a: "Yes. InvoBazar is ideal for design studios, marketing agencies, and software consultancies that bill milestone sprints, retainers, and specialized project deliverables under formal commercial terms.",
    },
    {
      q: "Is InvoBazar suitable for freelancers and solopreneurs?",
      a: "Yes. Freelancers can establish immediate credibility with clients by presenting structured, corporate-grade proforma invoices without having to purchase or learn complicated enterprise accounting software.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold tracking-wider uppercase">
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Everything You Need to Know About InvoBazar
          </h2>
          <p className="text-base text-slate-600">
            Answers to common questions regarding proforma invoicing, GST compliance, and document management.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
