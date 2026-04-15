import { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { LogoCompact } from "./components/Logo";
import InvoicePage from "./pages/Invoice";
import QuotePage from "./pages/Quote";
import SettingsPage from "./pages/Settings";
import { defaultCompanyInfo, defaultFormData } from "./utils/types";
import type { FormData, CompanyInfo } from "./utils/types";

export default function App() {
  const [toast, setToast] = useState<string | null>(null);

  const [companyInfo, setCompanyInfo] =
    useState<CompanyInfo>(defaultCompanyInfo);

  const [invoiceData, setInvoiceData] = useState<FormData>({
    ...defaultFormData,
  });

  const [quoteData, setQuoteData] = useState<FormData>({
    ...defaultFormData,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ── Helpers for invoice ──
  const updateInvoiceField = (field: keyof FormData, value: string | number) =>
    setInvoiceData((prev) => ({ ...prev, [field]: value }));

  const updateInvoiceItem = (index: number, field: string, value: string) =>
    setInvoiceData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });

  const addInvoiceItem = () =>
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", details: "", price: "", qty: "1" },
      ],
    }));

  const removeInvoiceItem = (index: number) => {
    if (invoiceData.items.length > 1)
      setInvoiceData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
  };

  // ── Helpers for quote ──
  const updateQuoteField = (field: keyof FormData, value: string | number) =>
    setQuoteData((prev) => ({ ...prev, [field]: value }));

  const updateQuoteItem = (index: number, field: string, value: string) =>
    setQuoteData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });

  const addQuoteItem = () =>
    setQuoteData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", details: "", price: "", qty: "1" },
      ],
    }));

  const removeQuoteItem = (index: number) => {
    if (quoteData.items.length > 1)
      setQuoteData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex-1 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all text-center ${
      isActive ? "bg-[#3a7a5a] text-white" : "text-white/40 hover:text-white/60"
    }`;

  return (
    <div className="max-w-lg lg:max-w-2xl mx-auto min-h-dvh pb-24 bg-[#f8f6f1]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#3a7a5a] text-white px-6 py-3 rounded-xl font-semibold text-sm z-[999] shadow-xl animate-pulse">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a2e1a] to-[#2a4a2a] px-4 pt-5 pb-4 text-white sticky top-0 z-[100] lg:rounded-b-2xl">
        <div className="flex items-center gap-3 mb-4">
          <LogoCompact className="w-9 h-8 shrink-0" />
          <h1 className="text-[15px] font-bold tracking-[1.5px] uppercase text-[#d4a44a] leading-tight">
            Crawlspace Improvement
            <span className="block text-[10px] font-medium tracking-[2.5px] text-white/50 mt-0.5">
              Environment Systems
            </span>
          </h1>
        </div>
        <nav className="flex gap-1 bg-black/30 rounded-[10px] p-[3px]">
          <NavLink to="/invoice" className={navLinkClass}>
            Invoice
          </NavLink>
          <NavLink to="/quote" className={navLinkClass}>
            Quote
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            Company
          </NavLink>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/invoice" replace />} />
        <Route
          path="/invoice"
          element={
            <InvoicePage
              formData={invoiceData}
              companyInfo={companyInfo}
              updateField={updateInvoiceField}
              updateItem={updateInvoiceItem}
              addItem={addInvoiceItem}
              removeItem={removeInvoiceItem}
              onToast={showToast}
            />
          }
        />
        <Route
          path="/quote"
          element={
            <QuotePage
              formData={quoteData}
              companyInfo={companyInfo}
              updateField={updateQuoteField}
              updateItem={updateQuoteItem}
              addItem={addQuoteItem}
              removeItem={removeQuoteItem}
              onToast={showToast}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <SettingsPage
              companyInfo={companyInfo}
              setCompanyInfo={setCompanyInfo}
            />
          }
        />
      </Routes>
    </div>
  );
}