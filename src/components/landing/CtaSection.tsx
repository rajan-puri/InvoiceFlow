import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-12 lg:p-14 text-center space-y-6 sm:space-y-8 shadow-sm">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Ready to Simplify Your Invoicing?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Create professional GST-ready Proforma Invoices, manage your clients and
              products, and keep your invoicing workflow organized.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200 transition-colors"
            >
              Explore the Product
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Free trial with instant setup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Full GST compliance built-in
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              No credit card required
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
