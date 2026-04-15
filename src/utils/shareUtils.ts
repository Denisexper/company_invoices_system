import { generatePDF, fmt, calcTotal } from "./pdfGenerator"; // Cambiamos downloadPDF/getPDFBlob
import type { FormData, CompanyInfo } from "./types";

type ShareResult = "shared" | "cancelled" | "downloaded" | "whatsapp" | "imessage";

export async function sharePDF(
  formData: FormData,
  companyInfo: CompanyInfo,
  isQuote: boolean,
  method: "native" | "whatsapp" | "imessage" | "download"
): Promise<ShareResult> {
  const type = isQuote ? "Quote" : "Invoice";
  const fileName = `${type}_${formData.invoiceNumber || "draft"}.pdf`;
  
  // Generamos el objeto doc una sola vez para usarlo según el método
  const doc = generatePDF(formData, companyInfo, isQuote);
  const total = calcTotal(formData.items, formData.taxRate);

  if (method === "native" && navigator.share) {
    try {
      // En lugar de getPDFBlob(), usamos doc.output("blob") directamente
      const blob = doc.output("blob");
      const file = new File([blob], fileName, { type: "application/pdf" });
      
      const shareData: ShareData = {
        title: `${type} ${formData.invoiceNumber || ""}`,
        text: `${type} from ${companyInfo.name || "Crawlspace Improvement"} - Total: ${fmt(total)}`,
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        shareData.files = [file];
      }
      
      await navigator.share(shareData);
      return "shared";
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return "cancelled";
      doc.save(fileName); // Fallback a descarga manual
      return "downloaded";
    }
  }

  // Para métodos que requieren descarga + link externo
  if (method === "whatsapp") {
    doc.save(fileName); 
    setTimeout(() => {
      const msg = encodeURIComponent(
        `Hi! Please find the ${type.toLowerCase()} #${formData.invoiceNumber || ""} from ${companyInfo.name || "Crawlspace Improvement"}. Total: ${fmt(total)}`
      );
      window.open(`https://wa.me/?text=${msg}`, "_blank");
    }, 600);
    return "whatsapp";
  }

  if (method === "imessage") {
    doc.save(fileName);
    setTimeout(() => {
      const msg = encodeURIComponent(
        `${type} from ${companyInfo.name || "Crawlspace Improvement"}: ${fmt(total)}`
      );
      window.location.href = `sms:&body=${msg}`;
    }, 600);
    return "imessage";
  }

  // Caso por defecto: Solo descargar
  doc.save(fileName);
  return "downloaded";
}