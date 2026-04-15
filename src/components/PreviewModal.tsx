import { useEffect, useState } from "react";
import { generatePDF } from "../utils/pdfGenerator";
import { sharePDF } from "../utils/shareUtils";
import type { FormData, CompanyInfo } from "../utils/types";

interface Props {
  formData: FormData;
  companyInfo: CompanyInfo;
  isQuote: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export default function PreviewModal({
  formData,
  companyInfo,
  isQuote,
  onClose,
  onToast,
}: Props) {
  const type = isQuote ? "Quote" : "Invoice";
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const doc = generatePDF(formData, companyInfo, isQuote);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formData, companyInfo, isQuote]);

  const handleShare = async (
    method: "native" | "whatsapp" | "imessage" | "download"
  ) => {
    const result = await sharePDF(formData, companyInfo, isQuote, method);
    if (result === "whatsapp") onToast("PDF downloaded! Attach in WhatsApp");
    else if (result === "imessage")
      onToast("PDF downloaded! Attach in iMessage");
    else if (result === "downloaded") onToast("PDF downloaded!");
    else if (result === "shared") onToast("Shared!");
    if (result !== "cancelled") onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex flex-col animate-[fadeIn_0.2s_ease]">
      {/* Header */}
      <div
        className="bg-white px-4 py-3 flex justify-between items-center border-b border-[#e5e0d8]"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <h2 className="text-base font-bold text-gray-900">{type} Preview</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 text-lg flex items-center justify-center hover:bg-gray-200 transition"
        >
          ×
        </button>
      </div>

      {/* PDF */}
      <div
        className="flex-1 overflow-y-auto bg-gray-200 p-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full bg-white rounded shadow-lg mx-auto"
            style={{ height: "80vh", maxWidth: 500 }}
            title="PDF Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Generating PDF...
          </div>
        )}
      </div>

      {/* Share buttons */}
      <div
        className="bg-white px-4 py-3 border-t border-[#e5e0d8]"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="flex gap-2">
          <button
            onClick={() => handleShare("whatsapp")}
            className="flex-1 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.917l4.458-1.495A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.47-.746-6.222-2.012l-.434-.327-2.927.981.981-2.927-.327-.434A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            WhatsApp
          </button>
          <button
            onClick={() => handleShare("imessage")}
            className="flex-1 py-3 rounded-xl bg-[#007AFF] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.477 2 2 5.813 2 10.5c0 2.612 1.394 4.946 3.564 6.54-.178 1.394-.89 2.862-2.064 3.96 2.387-.222 4.416-1.178 5.685-2.2.896.195 1.838.2 2.815.2 5.523 0 10-3.813 10-8.5S17.523 2 12 2z" />
            </svg>
            iMessage
          </button>
          <button
            onClick={() => handleShare("download")}
            className="flex-1 py-3 rounded-xl bg-[#c27c2a] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 16l-6-6h4V4h4v6h4l-6 6z" />
              <path d="M20 18H4v2h16v-2z" />
            </svg>
            Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}