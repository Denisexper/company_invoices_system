import { useEffect, useState, useRef } from "react";
import { generatePDF } from "../utils/pdfGenerator";
import { sharePDF } from "../utils/shareUtils";
import * as pdfjsLib from "pdfjs-dist";
import type { FormData, CompanyInfo } from "../utils/types";

// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

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
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderPDF() {
      try {
        const doc = generatePDF(formData, companyInfo, isQuote);
        const pdfBytes = doc.output("arraybuffer");

        const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
        const images: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const scale = 2; // 2x for retina clarity
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          await page.render({ canvas, viewport }).promise;
          images.push(canvas.toDataURL("image/png"));
        }

        if (!cancelled) {
          setPageImages(images);
          setLoading(false);
        }
      } catch (err) {
        console.error("PDF render error:", err);
        if (!cancelled) setLoading(false);
      }
    }

    renderPDF();
    return () => {
      cancelled = true;
    };
  }, [formData, companyInfo, isQuote]);

  const handleShare = async (
    method: "native" | "whatsapp" | "imessage" | "download"
  ) => {
    const result = await sharePDF(formData, companyInfo, isQuote, method);
    const messages: Record<string, string> = {
      whatsapp: "PDF downloaded! Attach in WhatsApp",
      imessage: "PDF downloaded! Attach in iMessage",
      downloaded: "PDF saved!",
      shared: "Shared successfully!",
    };
    if (messages[result]) onToast(messages[result]);
    if (result !== "cancelled") onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
      {/* Header */}
      <div className="shrink-0 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 flex justify-between items-center border-b border-gray-200 safe-top">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3a7a5a] to-[#1a2e1a] flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              {type} Preview
            </h2>
            <p className="text-[11px] text-gray-400">PDF ready to share</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-lg flex items-center justify-center transition-all"
        >
          ✕
        </button>
      </div>

      {/* PDF as rendered images */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gradient-to-b from-gray-100 to-gray-200 p-3 sm:p-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-[3px] border-[#3a7a5a] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Rendering PDF...</span>
          </div>
        ) : pageImages.length > 0 ? (
          <div className="flex flex-col items-center gap-4">
            {pageImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${type} page ${i + 1}`}
                className="w-full max-w-[850px] bg-white rounded-lg shadow-2xl border border-gray-300"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Could not render PDF preview
          </div>
        )}
      </div>

      {/* Share bar */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 safe-bottom">
        <div className="flex gap-2 max-w-xl mx-auto">
          <button
            onClick={() => handleShare("whatsapp")}
            className="flex-1 py-3 sm:py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-sm hover:shadow-md"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.917l4.458-1.495A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.47-.746-6.222-2.012l-.434-.327-2.927.981.981-2.927-.327-.434A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">WA</span>
          </button>

          <button
            onClick={() => handleShare("imessage")}
            className="flex-1 py-3 sm:py-3.5 rounded-xl bg-[#007AFF] hover:bg-[#0066dd] text-white font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-sm hover:shadow-md"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 5.813 2 10.5c0 2.612 1.394 4.946 3.564 6.54-.178 1.394-.89 2.862-2.064 3.96 2.387-.222 4.416-1.178 5.685-2.2.896.195 1.838.2 2.815.2 5.523 0 10-3.813 10-8.5S17.523 2 12 2z" />
            </svg>
            <span className="hidden sm:inline">iMessage</span>
            <span className="sm:hidden">iMsg</span>
          </button>

          <button
            onClick={() => handleShare("download")}
            className="flex-1 py-3 sm:py-3.5 rounded-xl bg-gradient-to-br from-[#c27c2a] to-[#a06520] hover:from-[#d48a32] hover:to-[#b07228] text-white font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-sm hover:shadow-md"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline">Save PDF</span>
            <span className="sm:hidden">Save</span>
          </button>

          <button
            onClick={() => handleShare("native")}
            className="py-3 sm:py-3.5 px-4 rounded-xl bg-[#1a2e1a] hover:bg-[#2a4a2a] text-white font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-sm hover:shadow-md"
            title="Share via system"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}