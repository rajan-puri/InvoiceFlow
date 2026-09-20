"use client";

import React, { useState } from "react";
import { Menu, Sparkles, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onOpenSidebar: () => void;
  title?: string;
}

export default function Header({ onOpenSidebar, title = "Dashboard" }: HeaderProps) {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeedDemoData = async () => {
    try {
      setSeeding(true);
      const res = await fetch("/api/seed", { method: "POST" });
      if (res.ok) {
        setSeedSuccess(true);
        setTimeout(() => setSeedSuccess(false), 3000);
        router.refresh();
        window.location.reload();
      }
    } catch (err) {
      console.error("Seed failed:", err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-6 bg-white border-b border-slate-200 no-print w-full">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Seed Sample Data */}
        <button
          onClick={handleSeedDemoData}
          disabled={seeding}
          title="Quickly populate sample products, clients, and an invoice"
          className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-50"
        >
          {seedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Seeded!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">{seeding ? "Populating..." : "Load Demo Data"}</span>
              <span className="sm:hidden">{seeding ? "..." : "Demo"}</span>
            </>
          )}
        </button>

        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Create Invoice</span>
          <span className="xs:hidden">Invoice</span>
        </Link>
      </div>
    </header>
  );
}
