import React from "react";
import {
  FileText,
  Package,
  Users,
  LayoutDashboard,
  Printer,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function EcosystemPreview() {
  return (
    <section className="py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <span>Unified Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            One Connected Workspace.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Every screen in InvoBazar is linked directly to your core database. Update a
            product price or client GSTIN once, and it reflects across every invoice and PDF.
          </p>
        </div>

        {/* Unified Ecosystem Desktop Mockup */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-8 shadow-2xl space-y-6">
          
          {/* Top System Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-white font-semibold">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                Live Cloud Sync
              </span>
              <span className="hidden sm:inline">User: Rajan Puri (InvoBazar Tech)</span>
              <span className="hidden md:inline font-mono text-slate-500">GSTIN: 07AAAAA1234A1Z5</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-0.5 rounded">
              All Modules Active
            </span>
          </div>

          {/* Connected Grid of Modules */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* 1. Dashboard Metrics Pill */}
            <div className="md:col-span-4 rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Dashboard Metrics</span>
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">₹1,53,400.00</p>
                <p className="text-xs text-slate-400 mt-0.5">Cumulative Proforma Sum</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Invoices</span>
                  <span className="font-bold text-white">12</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Clients</span>
                  <span className="font-bold text-white">18</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Products</span>
                  <span className="font-bold text-white">35</span>
                </div>
              </div>
            </div>

            {/* 2. Products Master */}
            <div className="md:col-span-4 rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Product Master</span>
                <Package className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-200 truncate pr-2">Cloud ERP Suite</span>
                  <span className="font-mono text-indigo-400">₹85k</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-200 truncate pr-2">API Dev Sprint</span>
                  <span className="font-mono text-indigo-400">₹45k</span>
                </div>
              </div>
            </div>

            {/* 3. Clients Master */}
            <div className="md:col-span-4 rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Client Master</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-200 truncate pr-2">Horizon Media Ltd</span>
                  <span className="font-mono text-emerald-400 text-[10px]">27AAACH</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-200 truncate pr-2">Apex Logistics Ltd</span>
                  <span className="font-mono text-emerald-400 text-[10px]">06AAACA</span>
                </div>
              </div>
            </div>

            {/* 4. Invoice Builder + Live Print Output */}
            <div className="md:col-span-12 rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white text-sm">
                    Active Proforma Canvas — PI-2026-001
                  </span>
                </div>
                <span className="text-emerald-400 font-semibold text-xs">
                  ✓ Ready for 1-Click A4 PDF Export
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Selected Buyer</span>
                  <span className="font-bold text-white block mt-0.5">Horizon Media Dynamics</span>
                  <span className="font-mono text-slate-500 text-[10px]">GSTIN: 27AAACH1234P1Z2</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Calculated GST</span>
                  <span className="font-bold text-white block mt-0.5">₹23,400.00 (18% Slab)</span>
                  <span className="text-slate-500 text-[10px]">Itemized automatically</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Net Grand Total</span>
                  <span className="font-bold text-blue-400 text-base block mt-0.5">₹1,53,400.00</span>
                  <span className="text-slate-500 text-[10px]">Words verified</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
