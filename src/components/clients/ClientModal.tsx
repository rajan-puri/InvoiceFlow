"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Client } from "@/lib/types";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  clientToEdit?: Client | null;
}

export default function ClientModal({
  isOpen,
  onClose,
  onSave,
  clientToEdit,
}: ClientModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (clientToEdit) {
      setCompanyName(clientToEdit.companyName || "");
      setContactPerson(clientToEdit.contactPerson || "");
      setEmail(clientToEdit.email || "");
      setPhone(clientToEdit.phone || "");
      setBillingAddress(clientToEdit.billingAddress || "");
      setShippingAddress(clientToEdit.shippingAddress || "");
      setGstin(clientToEdit.gstin || "");
      setSameAsBilling(
        !!clientToEdit.billingAddress &&
          clientToEdit.billingAddress === clientToEdit.shippingAddress
      );
    } else {
      setCompanyName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setBillingAddress("");
      setShippingAddress("");
      setGstin("");
      setSameAsBilling(false);
    }
    setError("");
  }, [clientToEdit, isOpen]);

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      setShippingAddress(billingAddress);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = clientToEdit ? `/api/clients/${clientToEdit.id}` : "/api/clients";
      const method = clientToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          contactPerson: contactPerson.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          billingAddress: billingAddress.trim() || null,
          shippingAddress: (sameAsBilling ? billingAddress : shippingAddress).trim() || null,
          gstin: gstin.trim().toUpperCase() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save client");
      }

      onSave();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? "Edit Client Details" : "Add New Client"}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Corporation Pvt Ltd"
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              GSTIN
            </label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="e.g. 29ABCDE1234F1Z5"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@company.com"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Billing Address
          </label>
          <textarea
            rows={2}
            value={billingAddress}
            onChange={(e) => {
              setBillingAddress(e.target.value);
              if (sameAsBilling) setShippingAddress(e.target.value);
            }}
            placeholder="Street address, City, State, PIN code..."
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Shipping Address
            </label>
            <label className="flex items-center gap-1.5 text-xs text-blue-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Same as billing address</span>
            </label>
          </div>
          <textarea
            rows={2}
            value={shippingAddress}
            disabled={sameAsBilling}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Shipping destination address..."
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : clientToEdit ? "Update Client" : "Save Client"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
