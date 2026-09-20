import React from "react";

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          User Experience
        </span>

        <blockquote className="text-xl sm:text-2xl font-medium text-slate-900 leading-relaxed max-w-3xl mx-auto">
          &ldquo;InvoBazar simplified the entire process for our team. We can create
          GST-ready Proforma Invoices in minutes instead of manually preparing every document.&rdquo;
        </blockquote>

        <div className="pt-2">
          <p className="text-base font-bold text-slate-900">Aditi Rao</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Founder, Horizon Media Dynamics Ltd.
          </p>
        </div>
      </div>
    </section>
  );
}
