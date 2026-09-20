import React from "react";
import Link from "next/link";
import { FileSpreadsheet, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">InvoBazar</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Smart Invoicing for Indian Businesses. Automated GST calculations, proforma and tax invoices, and instant professional PDF generation.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Link href="https://github.com/rajan-puri/InvoiceFlow" target="_blank" className="hover:text-slate-600 transition-colors">
                <Github className="w-4 h-4" />
              </Link>
              <span className="text-xs text-slate-400 font-mono">v0.1.0-prod</span>
            </div>
          </div>

          {/* Links Column 1: Product */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="#features" className="hover:text-slate-900 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#product" className="hover:text-slate-900 transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#workflow" className="hover:text-slate-900 transition-colors">
                  Workflow
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
                  Live Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Company */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <span className="text-slate-400 cursor-default">About InvoBazar</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Contact Support</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Resources */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="#faq" className="hover:text-slate-900 transition-colors">
                  FAQ & Answers
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">GST Compliance Guide</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Invoice Numbering Standards</span>
              </li>
              <li>
                <Link href="/login" className="hover:text-slate-900 transition-colors">
                  Demo Account Access
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-12 mt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} InvoBazar. All rights reserved.</p>
          <p>Designed and built for precision commercial operations.</p>
        </div>
      </div>
    </footer>
  );
}
