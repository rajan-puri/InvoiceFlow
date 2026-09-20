"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Settings,
  PlusCircle,
  LogOut,
  X,
  FileSpreadsheet,
  ShieldCheck,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { name: string; email: string; companyName?: string | null; role?: string };
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Templates", href: "/templates", icon: Palette },
  { name: "Products", href: "/products", icon: Package },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 no-print",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950/40 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">InvoBazar</span>
              <span className="block text-[10px] uppercase font-semibold text-blue-400 tracking-wider">Smart Invoicing</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action */}
        <div className="p-4">
          <Link
            href="/invoices/new"
            onClick={() => onClose()}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm shadow-blue-600/30 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Invoice</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {user?.role === "admin" && (
            <div className="pt-3 mt-3 border-t border-slate-800/80">
              <div className="px-3 pb-1.5 text-[10px] uppercase font-bold tracking-wider text-amber-400/80">
                Master Administration
              </div>
              <Link
                href="/admin"
                onClick={() => onClose()}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold"
                    : "text-amber-400 hover:text-amber-200 hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Admin Console</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                  Master
                </span>
              </Link>
            </div>
          )}
        </nav>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate pr-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "User"}
                </p>
                {user?.role === "admin" && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">
                {user?.companyName || user?.email || "Account"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
