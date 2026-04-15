import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { FormData, CompanyInfo } from "./types";

declare module "jspdf" {
    interface jsPDF {
        lastAutoTable: { finalY: number };
    }
}

export const fmt = (n: number): string =>
    "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const calcSubtotal = (items: FormData["items"]) =>
    items.reduce(
        (sum, item) =>
            sum + (parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0),
        0
    );
export const calcTax = (items: FormData["items"], taxRate: number) =>
    calcSubtotal(items) * (taxRate / 100);
export const calcTotal = (items: FormData["items"], taxRate: number) =>
    calcSubtotal(items) + calcTax(items, taxRate);

// ── Draw the house logo using vector paths ──
function drawLogo(doc: jsPDF, x: number, y: number, scale: number = 1) {
    const s = scale;

    // Roof - gradient simulated with two overlapping triangles
    doc.setFillColor(194, 124, 42); // gold
    doc.triangle(
        x + 12 * s, y,              // top center
        x, y + 10 * s,              // bottom left
        x + 3 * s, y + 10 * s,     // inner left
        "F"
    );
    doc.setFillColor(90, 138, 58); // green
    doc.triangle(
        x + 12 * s, y,              // top center
        x + 3 * s, y + 10 * s,     // inner left
        x + 24 * s, y + 10 * s,    // bottom right
        "F"
    );

    // Chimney
    doc.setFillColor(90, 138, 58);
    doc.rect(x + 18 * s, y + 3 * s, 2.5 * s, 6 * s, "F");

    // House body
    doc.setFillColor(58, 122, 90); // brand green
    doc.rect(x + 4 * s, y + 10 * s, 16 * s, 12 * s, "F");

    // Door
    doc.setFillColor(249, 248, 246); // light
    doc.rect(x + 9.5 * s, y + 14 * s, 5 * s, 8 * s, "F");

    // Wave accent at bottom
    doc.setDrawColor(42, 138, 122);
    doc.setLineWidth(0.8 * s);
    // Simple curve approximation
    const wy = y + 21 * s;
    doc.line(x + 6 * s, wy, x + 10 * s, wy - 2 * s);
    doc.line(x + 10 * s, wy - 2 * s, x + 14 * s, wy);
    doc.line(x + 14 * s, wy, x + 18 * s, wy - 2 * s);
}

export function generatePDF(
    formData: FormData,
    companyInfo: CompanyInfo,
    isQuote: boolean
): jsPDF {
    const doc = new jsPDF("p", "mm", "letter");
    const type = isQuote ? "Quote" : "Invoice";
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 16;
    const rightX = pageW - margin;
    const contentW = rightX - margin;
    let y = 10;

    // Colors
    const green: [number, number, number] = [58, 122, 90];
    const dark: [number, number, number] = [26, 46, 26];
    const gray: [number, number, number] = [107, 107, 107];
    const lightBg: [number, number, number] = [249, 248, 246];

    // ═══════════════════════════════════════════
    // TOP GREEN BAR
    // ═══════════════════════════════════════════
    doc.setFillColor(...green);
    doc.rect(0, 0, pageW, 3, "F");

    // ═══════════════════════════════════════════
    // HEADER: Logo + Company Name | Document Type
    // ═══════════════════════════════════════════
    y = 8;

    // Draw vector logo — vertically centered with text
    drawLogo(doc, margin, y + 1, 0.9);

    // Company name next to logo — aligned to logo center
    const nameX = margin + 24;
    const textCenterY = y + 11; // vertical center of header block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...dark);
    doc.text(
        (companyInfo.name || "Crawlspace Improvement").toUpperCase(),
        nameX,
        textCenterY - 2
    );
    doc.setFontSize(7.5);
    doc.setTextColor(...green);
    doc.text(
        (companyInfo.tagline || "Environment Systems").toUpperCase(),
        nameX,
        textCenterY + 3
    );

    // Document type - right aligned, vertically centered
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(...dark);
    doc.text(type, rightX, textCenterY + 1, { align: "right" });

    y += 20;

    // Green divider line
    doc.setDrawColor(...green);
    doc.setLineWidth(0.7);
    doc.line(margin, y, rightX, y);
    y += 8;

    // ═══════════════════════════════════════════
    // FROM / BILL TO
    // ═══════════════════════════════════════════
    const colMid = margin + contentW * 0.5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...green);
    doc.text("FROM", margin, y);
    doc.text(isQuote ? "PREPARED FOR" : "BILL TO", colMid + 5, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    const fromLines = [
        `${companyInfo.name || "Crawlspace Improvement"} ${companyInfo.tagline || "Environment Systems"}`,
        companyInfo.address,
        companyInfo.phone,
        companyInfo.email,
    ].filter(Boolean);

    const toLines = [
        formData.clientName || "—",
        formData.clientAddress,
        formData.clientPhone,
        formData.clientEmail,
    ].filter(Boolean);

    const maxLines = Math.max(fromLines.length, toLines.length);
    fromLines.forEach((line, i) => doc.text(line, margin, y + i * 4.5));
    toLines.forEach((line, i) => doc.text(line, colMid + 5, y + i * 4.5));
    y += maxLines * 4.5 + 8;

    // ═══════════════════════════════════════════
    // INFO BOX (Invoice #, Date, Terms, Due)
    // ═══════════════════════════════════════════
    doc.setFillColor(...lightBg);
    doc.roundedRect(margin, y, contentW, 18, 2, 2, "F");

    const info = [
        { label: `${type} #`, value: formData.invoiceNumber || "—" },
        { label: "Date", value: formData.date || "—" },
        ...(isQuote
            ? [
                {
                    label: "Valid Until",
                    value: formData.validUntil || "—",
                },
            ]
            : [
                { label: "Terms", value: formData.terms || "—" },
                { label: "Due Date", value: formData.dueDate || "—" },
            ]),
    ];

    const colW = contentW / info.length;
    const infoY = y + 6;
    info.forEach((item, i) => {
        const ix = margin + i * colW + 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...gray);
        doc.text(item.label, ix, infoY);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...dark);
        doc.text(item.value, ix, infoY + 5.5);
    });

    y += 26;

    // ═══════════════════════════════════════════
    // QUOTE VALIDITY BANNER
    // ═══════════════════════════════════════════
    if (isQuote && formData.validUntil) {
        doc.setFillColor(235, 245, 238);
        doc.roundedRect(margin, y, contentW, 10, 1, 1, "F");
        doc.setFillColor(...green);
        doc.rect(margin, y, 1.5, 10, "F"); // left accent
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...dark);
        doc.text(
            `This quote is valid until ${formData.validUntil}. Prices subject to change after expiration.`,
            margin + 6,
            y + 6.5
        );
        y += 14;
    }

    // ═══════════════════════════════════════════
    // ITEMS TABLE
    // ═══════════════════════════════════════════
    const tableBody = formData.items.map((item, i) => [
        item.description || `Item ${i + 1}`,
        item.details || "",
        fmt(parseFloat(item.price) || 0),
        item.qty || "1",
        fmt((parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0)),
    ]);

    autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["SERVICE", "DETAILS", "PRICE", "QTY", "AMOUNT"]],
        body: tableBody,
        theme: "plain",
        headStyles: {
            fillColor: dark,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 7.5,
            cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
            halign: "left",
        },
        columnStyles: {
            0: { cellWidth: 42, fontStyle: "bold" },
            1: { cellWidth: "auto", fontSize: 8, textColor: gray },
            2: { cellWidth: 22, halign: "right" },
            3: { cellWidth: 14, halign: "center" },
            4: { cellWidth: 26, halign: "right", fontStyle: "bold" },
        },
        bodyStyles: {
            fontSize: 9,
            cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
            lineColor: [235, 235, 235],
            lineWidth: 0.3,
        },
        alternateRowStyles: {
            fillColor: [252, 251, 249],
        },
    });

    y = doc.lastAutoTable.finalY + 8;

    // ═══════════════════════════════════════════
    // TOTALS
    // ═══════════════════════════════════════════
    const subtotal = calcSubtotal(formData.items);
    const tax = calcTax(formData.items, formData.taxRate);
    const total = calcTotal(formData.items, formData.taxRate);

    const totalsX = rightX - 55;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.setTextColor(...gray);
    doc.text("Subtotal", totalsX, y);
    doc.setTextColor(...dark);
    doc.text(fmt(subtotal), rightX, y, { align: "right" });
    y += 5.5;

    doc.setTextColor(...gray);
    doc.text(`Tax (${formData.taxRate}%)`, totalsX, y);
    doc.setTextColor(...dark);
    doc.text(`+${fmt(tax)}`, rightX, y, { align: "right" });
    y += 3;

    // Green line
    doc.setDrawColor(...green);
    doc.setLineWidth(0.6);
    doc.line(totalsX - 5, y, rightX, y);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...dark);
    doc.text(isQuote ? "Estimated Total" : "Balance Due", totalsX - 5, y);
    doc.text(fmt(total), rightX, y, { align: "right" });
    y += 14;

    // ═══════════════════════════════════════════
    // NOTES & PAYMENT
    // ═══════════════════════════════════════════
    if (formData.notes) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...green);
        doc.text("NOTES", margin, y);
        y += 4.5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...gray);
        const lines = doc.splitTextToSize(formData.notes, contentW);
        doc.text(lines, margin, y);
        y += lines.length * 3.8 + 5;
    }

    if (formData.paymentInfo) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...green);
        doc.text("PAYMENT INFORMATION", margin, y);
        y += 4.5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...gray);
        const lines = doc.splitTextToSize(formData.paymentInfo, contentW);
        doc.text(lines, margin, y);
        y += lines.length * 3.8 + 5;
    }

    // ═══════════════════════════════════════════
    // LICENSE BADGE
    // ═══════════════════════════════════════════
    if (companyInfo.license) {
        doc.setFillColor(...lightBg);
        doc.roundedRect(margin, y, contentW, 9, 1.5, 1.5, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...gray);
        doc.text(
            `License # ${companyInfo.license}  ·  Fully Licensed & Insured`,
            margin + 5,
            y + 6
        );
        y += 14;
    }

    // ═══════════════════════════════════════════
    // SIGNATURE (quotes only)
    // ═══════════════════════════════════════════
    if (isQuote) {
        y = Math.max(y, pageH - 55); // push toward bottom
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        doc.text(
            "By signing below, you accept this quote and authorize the work described above.",
            margin,
            y
        );
        y += 14;

        doc.setDrawColor(170, 170, 170);
        doc.setLineWidth(0.3);
        doc.line(margin, y, margin + 70, y);
        doc.line(colMid + 5, y, colMid + 65, y);
        y += 4;
        doc.setFontSize(7);
        doc.text("Client Signature", margin, y);
        doc.text("Date", colMid + 5, y);
    }

    // ═══════════════════════════════════════════
    // BOTTOM GREEN BAR
    // ═══════════════════════════════════════════
    doc.setFillColor(...green);
    doc.rect(0, pageH - 4, pageW, 4, "F");

    return doc;
}