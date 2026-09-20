"use client";

import React, { useMemo } from "react";
import { Invoice, InvoiceTemplate, UserProfile } from "@/lib/types";
import { formatCurrency, formatDate, numberToWords, applyInvoicePrefix } from "@/lib/utils";
import { Building2, CreditCard, ShieldCheck } from "lucide-react";

interface TemplateInvoiceSheetProps {
  invoice: Invoice;
  template: InvoiceTemplate;
  user?: UserProfile | null;
  className?: string;
}

export default function TemplateInvoiceSheet({
  invoice,
  template,
  user,
  className = "",
}: TemplateInvoiceSheetProps) {
  const currencySymbol = user?.currencySymbol || "₹";
  const sellerName = user?.companyName || user?.name || "Your Business Name";

  const documentType = invoice.documentType || "PROFORMA";
  const isTaxInvoice = documentType === "TAX_INVOICE";

  // Dynamic document title based on type and custom template settings
  const displayHeaderTitle = useMemo(() => {
    if (template.headerTitle) {
      if (isTaxInvoice && template.headerTitle === "PROFORMA INVOICE") {
        return "TAX INVOICE";
      }
      if (!isTaxInvoice && template.headerTitle === "TAX INVOICE") {
        return "PROFORMA INVOICE";
      }
      return template.headerTitle;
    }
    return isTaxInvoice ? "TAX INVOICE" : "PROFORMA INVOICE";
  }, [template.headerTitle, isTaxInvoice]);

  // Subtitle
  const displayHeaderSubtitle = useMemo(() => {
    if (template.headerSubtitle) {
      const lower = template.headerSubtitle.toLowerCase();
      if (isTaxInvoice && (lower.includes("proforma") || lower.includes("valid for") || lower.includes("business days"))) {
        return "Original for Recipient";
      }
      return template.headerSubtitle;
    }
    return isTaxInvoice ? "Original for Recipient" : "Valid for 15 business days";
  }, [template.headerSubtitle, isTaxInvoice]);

  // Dynamic invoice number respecting the customized template prefix or documentType default
  const displayInvoiceNumber = useMemo(() => {
    let effectivePrefix = template.invoicePrefix;
    if (!effectivePrefix || (isTaxInvoice && effectivePrefix === "PI-")) {
      effectivePrefix = isTaxInvoice ? "INV-" : "PI-";
    }
    return applyInvoicePrefix(invoice.invoiceNumber, effectivePrefix);
  }, [invoice.invoiceNumber, template.invoicePrefix, isTaxInvoice]);

  // Dynamic footer note
  const displayFooterText = useMemo(() => {
    if (template.footerText) {
      if (isTaxInvoice && template.footerText.toLowerCase().includes("proforma")) {
        return "Thank you for your business! This is an official tax invoice issued under GST.";
      }
      return template.footerText;
    }
    return isTaxInvoice
      ? "Thank you for your business! This is an official tax invoice issued under GST."
      : "Thank you for your valued business! This is a system-generated Proforma Invoice.";
  }, [template.footerText, isTaxInvoice]);

  // Font family mapping
  const fontClass = {
    Inter: "font-sans",
    Roboto: "font-sans",
    Geist: "font-sans",
    Playfair: "font-serif",
    Courier: "font-mono",
  }[template.fontFamily] || "font-sans";

  // Font size scale
  const sizeClass = {
    compact: "text-[11px] leading-tight",
    normal: "text-xs leading-normal",
    spacious: "text-sm leading-relaxed",
  }[template.fontSize] || "text-xs leading-normal";

  const primary = template.primaryColor || "#2563eb";
  const accent = template.accentColor || "#0f172a";
  const layout = template.layoutStyle || "MODERN";

  return (
    <div
      className={`invoice-paper bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-8 lg:p-12 text-slate-800 ${fontClass} ${sizeClass} ${className}`}
      style={{
        ["--primary-color" as any]: primary,
        ["--accent-color" as any]: accent,
      }}
    >
      {/* ========================================================================= */}
      {/* 1. MODERN LAYOUT */}
      {/* ========================================================================= */}
      {layout === "MODERN" && (
        <div className="space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-slate-200 gap-6">
            <div className="space-y-3 max-w-sm">
              {template.showLogo && (
                <div>
                  {template.logoUrl ? (
                    <img
                      src={template.logoUrl}
                      alt="Company Logo"
                      style={{ width: `${template.logoWidth}px` }}
                      className="object-contain max-h-16"
                    />
                  ) : (
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white font-bold text-sm tracking-tight shadow-sm"
                      style={{ backgroundColor: primary }}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>{sellerName}</span>
                    </div>
                  )}
                </div>
              )}

              {template.showCompanyDetails && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">{sellerName}</h2>
                  {user?.gstin && (
                    <p className="text-xs text-slate-600 font-mono mt-0.5">
                      GSTIN: <span className="font-semibold text-slate-800">{user.gstin}</span>
                    </p>
                  )}
                  {user?.address && (
                    <p className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed">
                      {user.address}
                    </p>
                  )}
                  {(user?.phone || user?.email) && (
                    <p className="text-xs text-slate-500 mt-1">
                      {[user?.phone, user?.email].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="text-left sm:text-right space-y-2">
              <div
                className="inline-block px-3 py-1 text-white font-bold text-xs uppercase tracking-wider rounded"
                style={{ backgroundColor: primary }}
              >
                {displayHeaderTitle}
              </div>
              {displayHeaderSubtitle && (
                <p className="text-[11px] text-slate-500">{displayHeaderSubtitle}</p>
              )}

              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {isTaxInvoice ? "Tax Invoice Number" : "Invoice Number"}
                </p>
                <p className="text-xl font-extrabold font-mono tracking-tight" style={{ color: primary }}>
                  {displayInvoiceNumber}
                </p>
              </div>

              <div className="text-xs space-y-0.5 text-slate-600">
                <p>
                  <span className="text-slate-400">{isTaxInvoice ? "Invoice Date:" : "Date:"}</span>{" "}
                  <span className="font-semibold">{formatDate(invoice.issueDate)}</span>
                </p>
                {invoice.validUntil && (
                  <p>
                    <span className="text-slate-400">{isTaxInvoice ? "Due Date:" : "Valid Until:"}</span>{" "}
                    <span className="font-semibold">{formatDate(invoice.validUntil)}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Client Buyer & Ship Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: primary }}>
                Billed To (Client / Consignee)
              </p>
              <h3 className="text-sm font-bold text-slate-900">{invoice.clientCompanyName}</h3>
              {invoice.clientContactPerson && (
                <p className="text-xs text-slate-600 mt-0.5">Attn: {invoice.clientContactPerson}</p>
              )}
              {invoice.clientGstin && (
                <p className="text-xs text-slate-700 font-mono mt-0.5">
                  GSTIN: <span className="font-semibold">{invoice.clientGstin}</span>
                </p>
              )}
              {invoice.clientBillingAddress && (
                <p className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed">
                  {invoice.clientBillingAddress}
                </p>
              )}
              {(invoice.clientPhone || invoice.clientEmail) && (
                <p className="text-xs text-slate-500 mt-1">
                  {[invoice.clientPhone, invoice.clientEmail].filter(Boolean).join(" • ")}
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: primary }}>
                Shipped To (Delivery Destination)
              </p>
              {invoice.clientShippingAddress ? (
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                  {invoice.clientShippingAddress}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">Same as billing address</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CLASSIC CORPORATE LAYOUT */}
      {/* ========================================================================= */}
      {layout === "CLASSIC" && (
        <div className="space-y-5">
          <div
            className="p-4 text-white text-center rounded-t-lg shadow-sm"
            style={{ backgroundColor: primary }}
          >
            <h1 className="text-xl font-bold tracking-wider uppercase">{displayHeaderTitle}</h1>
            {displayHeaderSubtitle && (
              <p className="text-xs text-white/80 mt-0.5">{displayHeaderSubtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 border border-slate-300 divide-y sm:divide-y-0 sm:divide-x divide-slate-300">
            <div className="p-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Seller Details
              </span>
              <h2 className="text-base font-bold text-slate-900">{sellerName}</h2>
              {user?.gstin && <p className="font-mono text-xs font-semibold">GSTIN: {user.gstin}</p>}
              {user?.address && <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{user.address}</p>}
              {(user?.phone || user?.email) && (
                <p className="text-xs text-slate-500">{[user?.phone, user?.email].filter(Boolean).join(" | ")}</p>
              )}
            </div>

            <div className="p-4 space-y-1.5 bg-slate-50/50">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {isTaxInvoice ? "Invoice No:" : "Proforma No:"}
                </span>
                <span className="font-mono font-bold text-base" style={{ color: primary }}>
                  {displayInvoiceNumber}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{isTaxInvoice ? "Invoice Date:" : "Date:"}</span>
                <span className="font-semibold">{formatDate(invoice.issueDate)}</span>
              </div>
              {invoice.validUntil && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{isTaxInvoice ? "Due Date:" : "Valid Until:"}</span>
                  <span className="font-semibold">{formatDate(invoice.validUntil)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Buyer (Bill To):
                </span>
                <p className="font-bold text-slate-900 mt-0.5">{invoice.clientCompanyName}</p>
                {invoice.clientGstin && (
                  <p className="font-mono text-xs text-slate-700">GSTIN: {invoice.clientGstin}</p>
                )}
                {invoice.clientBillingAddress && (
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{invoice.clientBillingAddress}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MINIMALIST STUDIO LAYOUT */}
      {/* ========================================================================= */}
      {layout === "MINIMAL" && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b border-slate-200 pb-4 gap-2">
            <div>
              <h1 className="text-2xl font-light tracking-tight text-slate-900">{displayHeaderTitle}</h1>
              {displayHeaderSubtitle && (
                <p className="text-xs text-slate-400 mt-0.5">{displayHeaderSubtitle}</p>
              )}
            </div>
            <div className="text-left sm:text-right">
              <span className="text-base font-mono text-slate-900 font-bold">{displayInvoiceNumber}</span>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(invoice.issueDate)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-medium mb-1">From</p>
              <h3 className="font-semibold text-slate-900">{sellerName}</h3>
              {user?.gstin && <p className="font-mono text-xs text-slate-500 mt-0.5">GSTIN: {user.gstin}</p>}
              {user?.address && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{user.address}</p>}
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-medium mb-1">For</p>
              <h3 className="font-semibold text-slate-900">{invoice.clientCompanyName}</h3>
              {invoice.clientContactPerson && <p className="text-xs text-slate-600">{invoice.clientContactPerson}</p>}
              {invoice.clientGstin && <p className="font-mono text-xs text-slate-500">GSTIN: {invoice.clientGstin}</p>}
              {invoice.clientBillingAddress && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{invoice.clientBillingAddress}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. EXECUTIVE CRIMSON LAYOUT */}
      {/* ========================================================================= */}
      {layout === "EXECUTIVE" && (
        <div className="space-y-5">
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-white shadow-sm gap-3"
            style={{ backgroundColor: primary }}
          >
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider">{displayHeaderTitle}</h1>
              {displayHeaderSubtitle && (
                <p className="text-xs text-white/80">{displayHeaderSubtitle}</p>
              )}
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs uppercase text-white/70 font-semibold">
                {isTaxInvoice ? "Tax Invoice No" : "Invoice No"}
              </p>
              <p className="text-lg font-mono font-black">{displayInvoiceNumber}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 py-3 border-b-2" style={{ borderColor: primary }}>
            <div>
              <h2 className="text-lg font-black text-slate-900">{sellerName}</h2>
              {user?.gstin && <p className="font-mono text-xs font-bold text-slate-700">GSTIN: {user.gstin}</p>}
              {user?.address && <p className="text-xs text-slate-600 max-w-sm mt-0.5 leading-relaxed">{user.address}</p>}
            </div>

            <div className="text-left sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-200 w-full sm:w-auto">
              <p className="text-[10px] font-bold uppercase text-slate-500">
                {isTaxInvoice ? "Invoice Date" : "Issue Date"}
              </p>
              <p className="text-xs font-bold text-slate-800">{formatDate(invoice.issueDate)}</p>
              {invoice.validUntil && (
                <>
                  <p className="text-[10px] font-bold uppercase text-slate-500 mt-1.5">
                    {isTaxInvoice ? "Due Date" : "Valid Until"}
                  </p>
                  <p className="text-xs font-bold text-slate-800">{formatDate(invoice.validUntil)}</p>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Client / Recipient</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{invoice.clientCompanyName}</p>
            {invoice.clientGstin && <p className="font-mono text-xs text-slate-700">GSTIN: {invoice.clientGstin}</p>}
            {invoice.clientBillingAddress && <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{invoice.clientBillingAddress}</p>}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EMERALD COMMERCE LAYOUT */}
      {/* ========================================================================= */}
      {layout === "EMERALD" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-emerald-500">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isTaxInvoice ? "Official GST Tax Invoice" : "GST Registered Tax Estimate"}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">{sellerName}</h1>
              {user?.gstin && <p className="font-mono text-xs font-bold text-emerald-700 mt-0.5">GSTIN: {user.gstin}</p>}
              {user?.address && <p className="text-xs text-slate-600 max-w-sm mt-0.5 leading-relaxed">{user.address}</p>}
            </div>

            <div className="text-left sm:text-right space-y-1">
              <h2 className="text-xl font-black" style={{ color: primary }}>{displayHeaderTitle}</h2>
              <p className="text-base font-mono font-bold text-slate-800">{displayInvoiceNumber}</p>
              <p className="text-xs text-slate-500">
                {isTaxInvoice ? "Invoice Date:" : "Date:"} {formatDate(invoice.issueDate)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Bill To</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{invoice.clientCompanyName}</p>
              {invoice.clientGstin && <p className="font-mono text-xs text-slate-700">GSTIN: {invoice.clientGstin}</p>}
              {invoice.clientBillingAddress && <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{invoice.clientBillingAddress}</p>}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Ship To</span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{invoice.clientShippingAddress || "Same as billing address"}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REWORKED A4 INVOICE ITEMS TABLE WITH CONTROLLED WIDTHS & HORIZONTAL SCROLL ON MOBILE */}
      {/* ========================================================================= */}
      <div className="py-4 sm:py-5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[540px] sm:min-w-0 sm:table-fixed">
          {/* Strict Column Width Controls: Item Description gets over 40-50% width */}
          <colgroup>
            {template.showIndex && <col style={{ width: "5%" }} />}
            <col style={{ width: "auto" }} />
            {template.showSku && <col style={{ width: "10%" }} />}
            <col style={{ width: "7%" }} />
            {template.showUnit && <col style={{ width: "6%" }} />}
            <col style={{ width: "11%" }} />
            {template.showGstRate && <col style={{ width: "7%" }} />}
            {template.showGstAmount && <col style={{ width: "10%" }} />}
            <col style={{ width: "13%" }} />
          </colgroup>

          <thead className="table-header-group">
            <tr
              className="text-[11px] font-bold uppercase tracking-wider border-b-2"
              style={{
                borderColor: layout === "CLASSIC" ? "#cbd5e1" : primary,
                backgroundColor: layout === "MODERN" || layout === "CLASSIC" ? "#f8fafc" : "transparent",
              }}
            >
              {template.showIndex && <th className="py-2.5 px-2 text-center">#</th>}
              <th className="py-2.5 px-3">Item Description</th>
              {template.showSku && <th className="py-2.5 px-2 text-center">SKU</th>}
              <th className="py-2.5 px-2 text-right">Qty</th>
              {template.showUnit && <th className="py-2.5 px-2 text-center">Unit</th>}
              <th className="py-2.5 px-2 text-right">Rate</th>
              {template.showGstRate && <th className="py-2.5 px-2 text-right">GST %</th>}
              {template.showGstAmount && <th className="py-2.5 px-2 text-right">Tax</th>}
              <th className="py-2.5 px-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody className="table-row-group divide-y divide-slate-100 text-xs">
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => (
                <tr
                  key={idx}
                  className={`break-inside-avoid align-top ${
                    layout === "CLASSIC" ? "divide-x divide-slate-200 hover:bg-slate-50/50" : "hover:bg-slate-50/50"
                  }`}
                >
                  {template.showIndex && (
                    <td className="py-3 px-2 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                  )}

                  <td className="py-3 px-3 break-words pr-4">
                    <div className="font-semibold text-slate-900 leading-snug break-words">
                      {item.productName}
                    </div>
                    {item.description && (
                      <div className="text-[11px] text-slate-500 mt-1 leading-relaxed whitespace-pre-line break-words">
                        {item.description}
                      </div>
                    )}
                  </td>

                  {template.showSku && (
                    <td className="py-3 px-2 text-center font-mono text-slate-500 truncate text-[11px]">
                      {item.sku || "—"}
                    </td>
                  )}

                  <td className="py-3 px-2 text-right font-medium text-slate-800 whitespace-nowrap tabular-nums">
                    {item.quantity}
                  </td>

                  {template.showUnit && (
                    <td className="py-3 px-2 text-center text-slate-500 whitespace-nowrap text-[11px]">
                      {item.unit || "PCS"}
                    </td>
                  )}

                  <td className="py-3 px-2 text-right text-slate-700 whitespace-nowrap tabular-nums">
                    {formatCurrency(item.unitPrice, currencySymbol)}
                  </td>

                  {template.showGstRate && (
                    <td className="py-3 px-2 text-right text-slate-600 font-mono whitespace-nowrap tabular-nums text-[11px]">
                      {item.gstRate}%
                    </td>
                  )}

                  {template.showGstAmount && (
                    <td className="py-3 px-2 text-right text-slate-600 font-mono whitespace-nowrap tabular-nums">
                      {formatCurrency(item.gstAmount, currencySymbol)}
                    </td>
                  )}

                  <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap tabular-nums">
                    {formatCurrency(item.lineTotal, currencySymbol)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No line items in this invoice.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* FINANCIAL SUMMARY, TOTALS & SETTLEMENT (AVOID BREAK FOR MULTI-PAGE PRINTING) */}
      {/* ========================================================================= */}
      <div className="avoid-break pt-4 border-t border-slate-200">
        {/* Total in Words (Full-Width Ribbon) */}
        <div className="p-3 bg-slate-50/90 rounded-lg border border-slate-200/80 mb-5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Total In Words:
            </span>
            <span className="text-xs font-semibold text-slate-800 italic">
              {numberToWords(invoice.grandTotal)}
            </span>
          </div>
        </div>

        {/* Balanced Bottom Grid: Bank Details (Left 7 cols) & Calculation Totals (Right 5 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Bank & Remittance Details Section */}
          {template.showBankDetails ? (
            <div className="md:col-span-7 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
              <div
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                style={{ color: primary }}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Bank & Remittance Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-700">
                {template.bankName && (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 shrink-0 font-medium">Bank:</span>
                    <span className="font-semibold text-slate-900 truncate">{template.bankName}</span>
                  </div>
                )}
                {template.accountNumber && (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 shrink-0 font-medium">A/C No:</span>
                    <span className="font-mono font-bold text-slate-900 tracking-wide">
                      {template.accountNumber}
                    </span>
                  </div>
                )}
                {template.ifscCode && (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 shrink-0 font-medium">IFSC:</span>
                    <span className="font-mono font-bold text-slate-900">{template.ifscCode}</span>
                  </div>
                )}
                {template.branchName && (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 shrink-0 font-medium">Branch:</span>
                    <span className="text-slate-800">{template.branchName}</span>
                  </div>
                )}
                {template.upiId && (
                  <div className="col-span-full pt-2 border-t border-slate-200/70 flex flex-wrap items-baseline justify-between gap-1">
                    <span className="text-slate-400 font-medium">UPI ID for instant wire:</span>
                    <span className="font-mono font-bold text-slate-900">{template.upiId}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:block md:col-span-7" />
          )}

          {/* Right Column: Calculation Breakdown Card */}
          <div
            className={`w-full bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3 ${
              template.showBankDetails ? "md:col-span-5" : "md:col-span-5 md:col-start-8"
            }`}
          >
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                {formatCurrency(invoice.subtotal, currencySymbol)}
              </span>
            </div>

            {template.showDiscount && invoice.discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600">
                <span>
                  Discount {invoice.discountType === "PERCENTAGE" ? `(${invoice.discountValue}%)` : ""}
                </span>
                <span className="font-semibold tabular-nums">
                  -{formatCurrency(invoice.discountAmount, currencySymbol)}
                </span>
              </div>
            )}

            {template.showGstAmount && (
              <div className="flex justify-between text-xs text-slate-600">
                <span>Applicable GST Tax</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(invoice.gstAmount, currencySymbol)}
                </span>
              </div>
            )}

            <div
              className="pt-3 border-t-2 flex justify-between items-baseline"
              style={{ borderColor: primary }}
            >
              <span className="text-sm font-bold text-slate-900">Grand Total</span>
              <span
                className="text-lg font-extrabold tracking-tight tabular-nums"
                style={{ color: primary }}
              >
                {formatCurrency(invoice.grandTotal, currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Full-Width Notes & Terms Section (Spans Full Available Invoice Width) */}
        {((template.showNotes && invoice.notes) ||
          (template.showTerms && (invoice.terms || template.terms))) && (
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div
              className={`grid gap-6 ${
                template.showNotes && invoice.notes && template.showTerms && (invoice.terms || template.terms)
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {template.showNotes && invoice.notes && (
                <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/70">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Notes & Remarks:
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 whitespace-pre-line leading-relaxed">
                    {invoice.notes}
                  </p>
                </div>
              )}

              {template.showTerms && (invoice.terms || template.terms) && (
                <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/70">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Terms & Conditions:
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 whitespace-pre-line leading-relaxed">
                    {invoice.terms || template.terms}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FOOTER & AUTHORIZED SIGNATORY (AVOID BREAK) */}
      {/* ========================================================================= */}
      <div className="avoid-break mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6">
        <div>
          {displayFooterText && (
            <p className="text-xs text-slate-500 italic max-w-md">{displayFooterText}</p>
          )}
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            {isTaxInvoice
              ? "Generated via InvoBazar Tax Invoice Suite"
              : "Generated via InvoBazar Proforma Suite"}
          </p>
        </div>

        {template.showSignature && (
          <div className="text-center sm:text-right">
            {template.signatureUrl ? (
              <img
                src={template.signatureUrl}
                alt="Signature"
                className="h-12 object-contain mx-auto sm:ml-auto mb-1"
              />
            ) : (
              <div className="h-12 border-b border-dashed border-slate-300 w-44 mb-2 mx-auto sm:ml-auto" />
            )}
            <p className="font-bold text-xs text-slate-800">For {sellerName}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              {template.signatureTitle || "Authorized Signatory"}
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* INVOBAZAR SUBTLE BRAND WATERMARK (CENTERED IN FOOTER) */}
      {/* ========================================================================= */}
      <div className="avoid-break mt-6 pt-3 border-t border-slate-100 flex items-center justify-center text-center select-none">
        <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-medium tracking-wider uppercase opacity-85">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600/70 inline-block" />
          <span>Powered by</span>
          <span className="font-bold text-slate-700 tracking-tight normal-case text-xs">InvoBazar</span>
          <span className="text-[9px] text-slate-400 normal-case hidden sm:inline">• Smart Invoicing for Indian Businesses</span>
        </div>
      </div>
    </div>
  );
}
