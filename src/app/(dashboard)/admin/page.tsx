"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  FileText,
  Package,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  UserX,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  X,
} from "lucide-react";
import { AdminPlatformOverview, AdminUserListItem, Invoice, Product, Client } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"users" | "invoices" | "products" | "clients">("users");
  const [overview, setOverview] = useState<AdminPlatformOverview | null>(null);
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "unverified" | "admin">("all");

  // Selected user for deep inspection modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [inspectionLoading, setInspectionLoading] = useState(false);

  // Load overview and initial tab data
  const loadPlatformData = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch platform overview metrics
      const ovRes = await fetch("/api/admin/overview");
      if (!ovRes.ok) {
        if (ovRes.status === 403) {
          throw new Error("Access Denied: You do not have master admin privileges.");
        }
        throw new Error("Failed to load platform overview");
      }
      const ovData = await ovRes.json();
      setOverview(ovData.overview);

      // Fetch users list
      const uRes = await fetch("/api/admin/users");
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(uData.users || []);
      }

      // Fetch invoices
      const invRes = await fetch("/api/admin/invoices");
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData.invoices || []);
      }

      // Fetch products
      const prodRes = await fetch("/api/admin/products");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }

      // Fetch clients
      const cliRes = await fetch("/api/admin/clients");
      if (cliRes.ok) {
        const cliData = await cliRes.json();
        setClients(cliData.clients || []);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch administrative data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  // Inspect user modal
  const handleInspectUser = async (userId: string) => {
    setInspectionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedUser(data.user);
      }
    } catch (err) {
      console.error("Inspect user failed:", err);
    } finally {
      setInspectionLoading(false);
    }
  };

  // Toggle user verification or role
  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEmailVerified: !currentStatus }),
      });

      if (res.ok) {
        // Refresh local lists
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isEmailVerified: !currentStatus } : u))
        );
        if (selectedUser?.id === userId) {
          setSelectedUser((prev: any) => ({ ...prev, isEmailVerified: !currentStatus }));
        }
        // Refresh overview counters
        loadPlatformData();
      }
    } catch (err) {
      console.error("Toggle verification failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        if (selectedUser?.id === userId) {
          setSelectedUser((prev: any) => ({ ...prev, role: newRole }));
        }
        loadPlatformData();
      }
    } catch (err) {
      console.error("Toggle role failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        searchQuery === "" ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.gstin && u.gstin.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === "verified") return u.isEmailVerified;
      if (statusFilter === "unverified") return !u.isEmailVerified;
      if (statusFilter === "admin") return u.role === "admin";
      return true;
    });
  }, [users, searchQuery, statusFilter]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.clientCompanyName.toLowerCase().includes(q) ||
        (inv.user?.name && inv.user.name.toLowerCase().includes(q)) ||
        (inv.user?.email && inv.user.email.toLowerCase().includes(q))
      );
    });
  }, [invoices, searchQuery]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        prod.name.toLowerCase().includes(q) ||
        (prod.sku && prod.sku.toLowerCase().includes(q)) ||
        (prod.category && prod.category.toLowerCase().includes(q)) ||
        (prod.user?.name && prod.user.name.toLowerCase().includes(q))
      );
    });
  }, [products, searchQuery]);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return clients.filter((cli) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        cli.companyName.toLowerCase().includes(q) ||
        (cli.contactPerson && cli.contactPerson.toLowerCase().includes(q)) ||
        (cli.email && cli.email.toLowerCase().includes(q)) ||
        (cli.gstin && cli.gstin.toLowerCase().includes(q)) ||
        (cli.user?.name && cli.user.name.toLowerCase().includes(q))
      );
    });
  }, [clients, searchQuery]);

  const formatDate = (dateVal: string | Date | undefined) => {
    if (!dateVal) return "Never";
    const d = new Date(dateVal);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateVal: string | Date | undefined) => {
    if (!dateVal) return "Never";
    const d = new Date(dateVal);
    return (
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (loading && !overview) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white border border-red-200 rounded-2xl text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-sm text-slate-600">{error}</p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Return to User Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Master Admin Control Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Master Admin Control Center</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">InvoBazar Platform Management</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Real-time platform oversight, account verification status, user directory, catalog inspection, and invoice records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadPlatformData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Metrics</span>
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <span>My Invoicing Space</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Registered Users</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{overview?.totalUsers || 0}</span>
              <span className="text-xs text-emerald-600 font-medium">
                {overview?.verifiedUsers || 0} verified
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>{overview?.verifiedUsers || 0} Active</span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ml-1" />
              <span>{overview?.unverifiedUsers || 0} Pending</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Platform Invoices */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Invoices Generated</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{overview?.totalInvoices || 0}</span>
              <span className="text-xs text-slate-500">records</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Platform Gross Volume: <strong className="text-slate-800">₹{(overview?.totalInvoiceValue || 0).toLocaleString("en-IN")}</strong>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Total Catalog Products */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Platform Catalog Items</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{overview?.totalProducts || 0}</span>
              <span className="text-xs text-slate-500">products & services</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Across all user accounts
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Client Accounts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Client Profiles</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{overview?.totalClients || 0}</span>
              <span className="text-xs text-slate-500">companies</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              B2B client directories
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 border-b border-slate-200 overflow-x-auto">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === "users"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Users ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("invoices")}
              className={`py-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === "invoices"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>All Invoices ({invoices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === "products"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catalog Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              className={`py-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === "clients"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Client Directory ({clients.length})</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search and Filter */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {activeTab === "users" && (
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs text-slate-500 font-medium">Filter:</span>
              {(["all", "verified", "unverified", "admin"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors uppercase tracking-wider ${
                    statusFilter === filter
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1: USERS DIRECTORY */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">User / Account</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Email Verification</th>
                  <th className="py-3.5 px-4 text-center">Data Records</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No users match the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span>{u.name}</span>
                          {u.role === "admin" && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                              Master Admin
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{u.email}</div>
                        {u.companyName && (
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>{u.companyName}</span>
                            {u.gstin && <span className="font-mono">({u.gstin})</span>}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          disabled={actionLoading === u.id}
                          title="Click to toggle role between User and Admin"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors border ${
                            u.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span className="capitalize">{u.role}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleVerification(u.id, u.isEmailVerified)}
                          disabled={actionLoading === u.id}
                          title="Click to toggle verification status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors border ${
                            u.isEmailVerified
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {u.isEmailVerified ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Unverified</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200">
                          <span title="Invoices count">
                            <strong>{u._count.invoices}</strong> inv
                          </span>
                          <span className="text-slate-300">•</span>
                          <span title="Products count">
                            <strong>{u._count.products}</strong> prod
                          </span>
                          <span className="text-slate-300">•</span>
                          <span title="Clients count">
                            <strong>{u._count.clients}</strong> cli
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(u.createdAt)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDateTime(u.lastActiveAt)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleInspectUser(u.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: INVOICES DIRECTORY */}
        {activeTab === "invoices" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Invoice Number</th>
                  <th className="py-3.5 px-4">Created By</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Grand Total</th>
                  <th className="py-3.5 px-4">GST Included</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No invoices found across the platform.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-blue-600">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{inv.user?.name || "Unknown"}</div>
                        <div className="text-xs text-slate-500 font-mono">{inv.user?.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{inv.clientCompanyName}</div>
                        {inv.clientContactPerson && (
                          <div className="text-xs text-slate-500">{inv.clientContactPerson}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(inv.issueDate)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        ₹{(inv.grandTotal || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                        ₹{(inv.gstAmount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: PRODUCTS DIRECTORY */}
        {activeTab === "products" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Product / Service</th>
                  <th className="py-3.5 px-4">SKU / Code</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Owner (User)</th>
                  <th className="py-3.5 px-4">Base Price</th>
                  <th className="py-3.5 px-4">GST Rate</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No catalog products registered yet.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-semibold text-slate-900">{prod.name}</div>
                        {prod.description && (
                          <div className="text-xs text-slate-500 max-w-sm truncate">{prod.description}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                        {prod.sku || "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                          {prod.category || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{prod.user?.name || "Unknown"}</div>
                        <div className="text-xs text-slate-500 font-mono">{prod.user?.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        ₹{(prod.price || 0).toLocaleString("en-IN")} / {prod.unit}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                        {prod.gstRate}%
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right text-xs text-slate-500">
                        {formatDate(prod.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: CLIENTS DIRECTORY */}
        {activeTab === "clients" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Company Name</th>
                  <th className="py-3.5 px-4">Contact Person</th>
                  <th className="py-3.5 px-4">Owner (User)</th>
                  <th className="py-3.5 px-4">Email & Phone</th>
                  <th className="py-3.5 px-4">Client GSTIN</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No client accounts registered yet.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((cli) => (
                    <tr key={cli.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                        {cli.companyName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {cli.contactPerson || "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{cli.user?.name || "Unknown"}</div>
                        <div className="text-xs text-slate-500 font-mono">{cli.user?.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-slate-700">{cli.email || "—"}</div>
                        {cli.phone && <div className="text-xs text-slate-400">{cli.phone}</div>}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                        {cli.gstin || "—"}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right text-xs text-slate-500">
                        {formatDate(cli.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{selectedUser.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        selectedUser.role === "admin"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {selectedUser.role}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Account Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Status</span>
                  <p className="text-xs font-bold mt-1 text-slate-800">
                    {selectedUser.isEmailVerified ? "Verified Account" : "Unverified"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Company</span>
                  <p className="text-xs font-bold mt-1 text-slate-800 truncate">
                    {selectedUser.companyName || "Not set"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">GSTIN</span>
                  <p className="text-xs font-mono font-bold mt-1 text-slate-800 truncate">
                    {selectedUser.gstin || "Unregistered"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Registered</span>
                  <p className="text-xs font-bold mt-1 text-slate-800">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              </div>

              {/* Invoices by this user */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Invoices Generated ({selectedUser.invoices?.length || 0})
                </h4>
                {selectedUser.invoices?.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl text-center">
                    This user has not generated any invoices yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedUser.invoices?.map((inv: any) => (
                      <div
                        key={inv.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-blue-600">{inv.invoiceNumber}</span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="font-medium text-slate-800">{inv.clientCompanyName}</span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="text-slate-500">{formatDate(inv.issueDate)}</span>
                        </div>
                        <div className="font-bold text-slate-900">
                          ₹{(inv.grandTotal || 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Products by this user */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Catalog Products ({selectedUser.products?.length || 0})
                </h4>
                {selectedUser.products?.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl text-center">
                    No products in catalog.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedUser.products?.map((prod: any) => (
                      <div
                        key={prod.id}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-slate-800">{prod.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{prod.sku || "No SKU"}</p>
                        </div>
                        <p className="font-bold text-slate-900">₹{prod.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVerification(selectedUser.id, selectedUser.isEmailVerified)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    selectedUser.isEmailVerified
                      ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  {selectedUser.isEmailVerified ? "Mark as Unverified" : "Manually Verify Email"}
                </button>

                <button
                  onClick={() => handleToggleRole(selectedUser.id, selectedUser.role)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                >
                  {selectedUser.role === "admin" ? "Demote to Standard User" : "Promote to Admin"}
                </button>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
