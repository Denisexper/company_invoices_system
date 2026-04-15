import { useState } from "react";
import InvoiceForm from "../components/InvoiceForm";
import PreviewModal from "../components/PreviewModal";
import { sharePDF } from "../utils/shareUtils";
import type { FormData, CompanyInfo } from "../utils/types";

interface Props {
  formData: FormData;
  companyInfo: CompanyInfo;
  updateField: (field: keyof FormData, value: string | number) => void;
  updateItem: (index: number, field: string, value: string) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  onToast: (msg: string) => void;
}

export default function InvoicePage({
  formData,
  companyInfo,
  updateField,
  updateItem,
  addItem,
  removeItem,
  onToast,
}: Props) {
  const [showPreview, setShowPreview] = useState(false);

  const handleNativeShare = async () => {
    const result = await sharePDF(formData, companyInfo, false, "native");
    if (result === "shared") onToast("Shared!");
    else if (result !== "cancelled") onToast("PDF downloaded!");
  };

  return (
    <>
      <InvoiceForm
        formData={formData}
        updateField={updateField}
        updateItem={updateItem}
        addItem={addItem}
        removeItem={removeItem}
        isQuote={false}
      />

      <div
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 flex gap-2.5 px-4 sm:px-6 py-3 z-[100] max-w-2xl lg:max-w-4xl mx-auto"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={() => setShowPreview(true)}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-br from-[#3a7a5a] to-[#1a2e1a] hover:from-[#4a8a6a] hover:to-[#2a4a2a] text-white font-bold text-sm tracking-wide active:scale-[0.97] transition-all shadow-lg shadow-[#3a7a5a]/20"
        >
          Preview Invoice
        </button>
        <button
          onClick={handleNativeShare}
          className="py-3.5 px-5 rounded-xl border-2 border-[#3a7a5a] text-[#3a7a5a] font-bold text-sm active:scale-[0.97] transition-all hover:bg-[#3a7a5a] hover:text-white"
        >
          Share
        </button>
      </div>

      {showPreview && (
        <PreviewModal
          formData={formData}
          companyInfo={companyInfo}
          isQuote={false}
          onClose={() => setShowPreview(false)}
          onToast={onToast}
        />
      )}
    </>
  );
}