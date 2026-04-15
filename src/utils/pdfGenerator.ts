import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { FormData, CompanyInfo } from "./types";

// Tipado para evitar errores de compilación
declare module "jspdf" {
    interface jsPDF {
        lastAutoTable: { finalY: number };
    }
}

export const fmt = (n: number): string =>
    "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Funciones de cálculo (se mantienen igual)
export const calcSubtotal = (items: FormData["items"]) =>
    items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0), 0);
export const calcTax = (items: FormData["items"], taxRate: number) => calcSubtotal(items) * (taxRate / 100);
export const calcTotal = (items: FormData["items"], taxRate: number) => calcSubtotal(items) + calcTax(items, taxRate);

export function generatePDF(formData: FormData, companyInfo: CompanyInfo, isQuote: boolean): jsPDF {
    const doc = new jsPDF("p", "mm", "letter");
    const type = isQuote ? "Quote" : "Invoice";
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 20; // Margen estándar de impresión
    const rightX = pageW - margin;
    let y = margin;

    // Paleta de colores extraída de tu diseño
    const primaryGreen: [number, number, number] = [58, 122, 90]; // #3a7a5a
    const darkText: [number, number, number] = [26, 46, 26];    // #1a2e1a
    const accentGold: [number, number, number] = [194, 124, 42]; // #c27c2a
    const softGray: [number, number, number] = [107, 107, 107];
    const lightBg: [number, number, number] = [249, 248, 246];

    // ── Header: Logo & Title ──
    // Nota: Como no podemos pasar el componente React al PDF, 
    // simulamos el icono del logo con formas geométricas
    doc.setFillColor(...accentGold);
    // ── Dibujando el Techo (Triángulo) ──
    doc.setFillColor(...accentGold);
    // triangle(x1, y1, x2, y2, x3, y3, estilo)
    doc.triangle(
        margin, y + 7,           // Punta izquierda
        margin + 4.5, y + 2,     // Punta superior (centro)
        margin + 9, y + 7,       // Punta derecha
        "F"
    );

    // ── Dibujando el Cuerpo (Rectángulo) ──
    doc.setFillColor(...primaryGreen);
    // rect(x, y, ancho, alto, estilo)
    doc.rect(margin + 1.5, y + 7, 6, 5, "F");

    // ── Dibujando la Chimenea (opcional para más detalle) ──
    doc.setFillColor(...accentGold);
    doc.rect(margin + 6, y + 3.5, 1.5, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...darkText);
    doc.text((companyInfo.name || "Crawlspace Improvement").toUpperCase(), margin, y + 8);

    doc.setFontSize(7);
    doc.setTextColor(...primaryGreen);
    doc.text((companyInfo.tagline || "Environment Systems").toUpperCase(), margin, y + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(...darkText);
    doc.text(type.toUpperCase(), rightX, y + 10, { align: "right" });

    y += 20;

    // ── Divider ──
    doc.setDrawColor(...primaryGreen);
    doc.setLineWidth(0.5);
    doc.line(margin, y, rightX, y);
    y += 10;

    // ── Addresses ──
    doc.setFontSize(7);
    doc.setTextColor(...primaryGreen);
    doc.text("FROM", margin, y);
    doc.text(isQuote ? "PREPARED FOR" : "BILL TO", (pageW / 2) + 5, y);

    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);

    const fromText = [
        companyInfo.address,
        companyInfo.phone,
        companyInfo.email
    ].filter(Boolean).join("\n");

    const toText = [
        formData.clientName,
        formData.clientAddress,
        formData.clientPhone
    ].filter(Boolean).join("\n");

    doc.text(fromText, margin, y, { lineHeightFactor: 1.4 });
    doc.text(toText, (pageW / 2) + 5, y, { lineHeightFactor: 1.4 });

    y += 25;

    // ── Info Box (Grid) ──
    doc.setFillColor(...lightBg);
    doc.roundedRect(margin, y, rightX - margin, 18, 2, 2, "F");

    const gridY = y + 6;
    const colW = (rightX - margin) / 4;

    const info = [
        { label: `${type} #`, value: formData.invoiceNumber || "—" },
        { label: "Date", value: formData.date || "—" },
        { label: isQuote ? "Valid Until" : "Terms", value: isQuote ? formData.validUntil : formData.terms },
        { label: isQuote ? "Status" : "Due Date", value: isQuote ? "Draft" : (formData.dueDate || "—") }
    ];

    info.forEach((item, i) => {
        const x = margin + (i * colW) + 5;
        doc.setFontSize(7);
        doc.setTextColor(...softGray);
        doc.text(item.label, x, gridY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...darkText);
        doc.text(String(item.value), x, gridY + 5);
    });

    y += 28;

    // ── Table ──
    const tableBody = formData.items.map(item => [
        item.description || "Item",
        fmt(parseFloat(item.price) || 0),
        item.qty || "1",
        fmt((parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0))
    ]);

    autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["DESCRIPTION", "PRICE", "QTY", "AMOUNT"]],
        body: tableBody,
        theme: "striped",
        headStyles: {
            fillColor: darkText,
            fontSize: 8,
            fontStyle: "bold",
            halign: 'left'
        },
        columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'center' },
            3: { halign: 'right' }
        },
        styles: { fontSize: 8.5, cellPadding: 4 },
        alternateRowStyles: { fillColor: [250, 250, 250] }
    });

    y = doc.lastAutoTable.finalY + 10;

    // ── Totals ──
    const subtotal = calcSubtotal(formData.items);
    const tax = calcTax(formData.items, formData.taxRate);
    const total = calcTotal(formData.items, formData.taxRate);

    const totalsX = rightX - 40;
    doc.setFontSize(9);
    doc.setTextColor(...softGray);
    doc.text("Subtotal", totalsX, y);
    doc.text(fmt(subtotal), rightX, y, { align: "right" });

    y += 6;
    doc.text(`Tax (${formData.taxRate}%)`, totalsX, y);
    doc.text(`+${fmt(tax)}`, rightX, y, { align: "right" });

    y += 8;
    doc.setDrawColor(...primaryGreen);
    doc.line(totalsX - 10, y - 4, rightX, y - 4);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkText);
    doc.text(isQuote ? "Estimated Total" : "Balance Due", totalsX - 10, y);
    doc.text(fmt(total), rightX, y, { align: "right" });

    // ── Footer (Sticky to bottom) ──
    doc.setFillColor(...primaryGreen);
    doc.rect(0, pageH - 5, pageW, 5, "F");

    return doc;
}