"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { UserProfile } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user ? { name: user.name, email: user.email, companyName: user.companyName, role: user.role } : undefined}
      />

      {/* Main Body */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 w-full max-w-full lg:max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:p-8 mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
