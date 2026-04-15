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

  // Invoice helpers
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

  // Quote helpers
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
    `flex-1 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all text-center ${isActive
      ? "bg-[#3a7a5a] text-white shadow-lg shadow-[#3a7a5a]/30"
      : "text-white/40 hover:text-white/60"
    }`;

  return (
    <div className="max-w-2xl lg:max-w-4xl mx-auto min-h-dvh pb-24 bg-[#f8f6f1]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999] animate-[slideDown_0.3s_ease]">
          <div className="bg-[#1a2e1a] text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-2xl flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            {toast}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-br from-[#1a2e1a] to-[#2a4a2a] px-4 sm:px-6 pt-5 pb-4 text-white sticky top-0 z-[100]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <LogoCompact size={36} className="shrink-0" />
            <div>
              <h1 className="text-[14px] sm:text-[15px] font-bold tracking-[1.5px] uppercase text-[#d4a44a] leading-tight">
                Crawlspace Improvement
              </h1>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-[2.5px] uppercase text-white/45">
                Environment Systems
              </span>
            </div>
          </div>
        </div>

        <nav className="flex gap-1 bg-black/25 rounded-xl p-1">
          <NavLink to="/invoice" className={navLinkClass}>
            <span className="flex items-center justify-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="hidden sm:block"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Invoice
            </span>
          </NavLink>
          <NavLink to="/quote" className={navLinkClass}>
            <span className="flex items-center justify-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="hidden sm:block"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Quote
            </span>
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            <span className="flex items-center justify-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="hidden sm:block"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              Company
            </span>
          </NavLink>
        </nav>
      </header>

      {/* Content */}
      <main>
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
      </main>
    </div>
  );
}