"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileSpreadsheet, Mail, CheckCircle2, ArrowRight, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get("email") || "";
  const queryToken = searchParams.get("token") || "";
  const queryCode = searchParams.get("code") || "";

  const [email, setEmail] = useState(queryEmail);
  const [code, setCode] = useState(queryCode);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);

  // Auto-verify if token is present in the URL
  useEffect(() => {
    if (queryToken) {
      handleAutoVerifyToken(queryToken);
    }
  }, [queryToken]);

  useEffect(() => {
    if (queryEmail) {
      setEmail(queryEmail);
    }
    if (queryCode) {
      setCode(queryCode);
    }
  }, [queryEmail, queryCode]);

  const handleAutoVerifyToken = async (token: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid or expired verification token.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address");
      return;
    }
    if (!code.trim() || code.trim().length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Verification failed. Please check the code and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Please enter your email to resend the code");
      return;
    }

    setResending(true);
    setError("");
    setInfoMessage("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      setInfoMessage(data.message || "New verification code has been dispatched.");
      if (data.verificationCode) {
        setDevCode(data.verificationCode);
        setCode(data.verificationCode);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend verification code");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-6 bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">InvoBazar</span>
          </Link>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mb-3 border border-blue-500/20">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Verify Your Email Address</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            To safeguard your business financial records and enable proforma generation, verify your account.
          </p>
        </div>

        {/* Development Helper Banner */}
        {devCode && (
          <div className="p-3.5 bg-blue-950/50 border border-blue-800/80 rounded-xl text-blue-200 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-blue-300">Development Mode Notice</p>
              <p className="text-blue-200/90 mt-0.5">
                Verification code for this account: <strong className="font-mono text-white text-sm tracking-wider px-1.5 py-0.5 bg-blue-900/60 rounded border border-blue-700">{devCode}</strong>
              </p>
            </div>
          </div>
        )}

        {infoMessage && (
          <div className="p-3 text-xs text-blue-300 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Email Verified Successfully!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your InvoBazar account is fully activated. You can now sign in and create professional proforma invoices.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 font-medium shadow-md shadow-emerald-600/30 transition-all"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 text-center text-xl tracking-[0.3em] font-mono bg-slate-800/80 border border-slate-700 text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
              <p className="text-[11px] text-slate-500 mt-1 text-center">
                Enter the 6 digits issued during registration
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-500 font-medium shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 mt-2"
            >
              <span>{loading ? "Verifying..." : "Verify & Activate Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                <span>{resending ? "Generating new code..." : "Resend verification code"}</span>
              </button>

              <Link href="/login" className="text-xs text-slate-400 hover:text-slate-300">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
          Loading verification portal...
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
