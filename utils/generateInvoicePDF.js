import * as jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toCurrency } from "./utils.js";

export function generateInvoicePDF(invoice) {
  const doc = new jsPDF.jsPDF();
  const vatRate = 0.09;

  // Layout constants (adjusted to match invoice.js)
  const PAGE_MARGIN = 13; // invoice.js uses 10 but here we use 13
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  const HEADER_Y = 15;
  const SPACING = 3.5;
  const LOGO_SCALE = 1.2;
  const LOGO_SIZE = [17.4 * LOGO_SCALE, 15.4 * LOGO_SCALE];

  // Pre-calculate totals (for header balance due later and table totals)
  let subtotal = 0;
  let totalTax = 0;
  invoice.items.forEach((item) => {
    const amount = parseFloat(item.amount) || 0;
    if (invoice.pricesIncludeVat) {
      subtotal += amount / (1 + vatRate);
      totalTax += amount - amount / (1 + vatRate);
    } else {
      subtotal += amount;
      totalTax += amount * vatRate;
    }
  });
  const balanceDue = invoice.pricesIncludeVat
    ? invoice.items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0)
    : subtotal + totalTax;

  // Mark as DRAFT if invoiceDate is not set.
  if (!invoice.invoiceDate) {
    doc.setFontSize(19);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    doc.text("DRAFT", PAGE_WIDTH / 2, 20, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  // Left side: Company logo and details.
  let logo = require("../public/logo.js");
  // Logo at top left.
  doc.addImage(logo.logo, "png", PAGE_MARGIN, HEADER_Y, LOGO_SIZE[0], LOGO_SIZE[1]);

  // Company details next to logo.
  const companyX = PAGE_MARGIN + LOGO_SIZE[0] + SPACING;
  // Company name aligns with the top of the logo.
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text("CYTRANSOLUTIONS LTD", companyX, HEADER_Y + SPACING);
  // Below the company name, the address and contact details.
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Amathountos 34, Shop 8,", companyX, HEADER_Y + 6);
  doc.text("Limassol, 4532", companyX, HEADER_Y + 9);
  doc.text("Tel: +35799667777", companyX, HEADER_Y + 12);
  doc.text("Email: 99667777cy@gmail.com", companyX, HEADER_Y + 15);
  doc.text("VAT no: 10361018V", companyX, HEADER_Y + 18);

  // Right side: Invoice header details.
  const invoiceInfoX = PAGE_WIDTH - PAGE_MARGIN;
  // "Invoice" title at top right.
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(19);
  doc.text("Invoice", invoiceInfoX, HEADER_Y, { align: "right" });
  // Invoice number and date just below.
  doc.setFontSize(11);
  doc.setFont("Helvetica", "bold");
  doc.text(`Invoice No: ${invoice.invoiceCode}`, invoiceInfoX, HEADER_Y + 7, { align: "right" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    invoice.invoiceDate
      ? `Date: ${new Date(invoice.invoiceDate).toLocaleDateString("en-UK")}`
      : "DRAFT",
    invoiceInfoX,
    HEADER_Y + 12,
    { align: "right" }
  );
  // Balance Due on top right under invoice details.
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Balance Due: ${toCurrency(balanceDue)}`, invoiceInfoX, HEADER_Y + 18, { align: "right" });

  // Bill To details (left side below company details)
  const billToY = HEADER_Y + LOGO_SIZE[1] + SPACING + 10;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Bill To:", PAGE_MARGIN, billToY);
  const client = invoice.billTo.details;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text(client.name, PAGE_MARGIN, billToY + 4);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  if (client.email) {
    doc.text("Email: " + client.email, PAGE_MARGIN, billToY + 9);
  }
  if (client.tel) {
    doc.text("Tel: " + client.tel, PAGE_MARGIN, billToY + 13);
  }
  if (client.address) {
    doc.text("Address: " + client.address, PAGE_MARGIN, billToY + 17);
  }

  // Prepare invoice items table.
  // Table columns: No, Description, Tax, Amount.
  // Define smaller widths for No, Tax and Amount.
  const fixedWidthNo = 10;
  const fixedWidthTax = 20;
  const fixedWidthAmount = 20;
  const remainingWidth = PAGE_WIDTH - 2 * PAGE_MARGIN - (fixedWidthNo + fixedWidthTax + fixedWidthAmount);
  
  // Build table rows (order: no, description, tax, amount)
  const tableBody = invoice.items.map((item, index) => {
    const amount = parseFloat(item.amount) || 0;
    let tax = 0;
    if (amount > 0) {
      if (invoice.pricesIncludeVat) {
        tax = amount - amount / (1 + vatRate);
      } else {
        tax = amount * vatRate;
      }
    }
    return [
      (index + 1).toString(),
      item.description,
      toCurrency(tax),
      toCurrency(amount)
    ];
  });

  autoTable(doc, {
    startY: billToY + 25,
    headStyles: { fillColor: [50, 50, 50] },
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    styles: { fontSize: 9 },
    head: [["No", "Description", "Tax", "Amount"]],
    body: tableBody,
    columnStyles: {
      0: { cellWidth: fixedWidthNo },
      1: { cellWidth: remainingWidth },
      2: { cellWidth: fixedWidthTax },
      3: { cellWidth: fixedWidthAmount },
    },
  });

  const finalY = doc.lastAutoTable.finalY || (billToY + 25);

  // Totals section (below table).
  doc.line(PAGE_MARGIN, finalY + 5, PAGE_WIDTH - PAGE_MARGIN, finalY + 5);
  doc.setFontSize(11);
  doc.setFont("Helvetica", "normal");
  doc.text("Subtotal:", PAGE_WIDTH - 60, finalY + 10, { align: "right" });
  doc.text(toCurrency(subtotal), PAGE_WIDTH - PAGE_MARGIN, finalY + 10, { align: "right" });
  doc.text("Total Tax:", PAGE_WIDTH - 60, finalY + 15, { align: "right" });
  doc.text(toCurrency(totalTax), PAGE_WIDTH - PAGE_MARGIN, finalY + 15, { align: "right" });
  doc.text("Balance Due:", PAGE_WIDTH - 60, finalY + 20, { align: "right" });
  doc.setFont("Helvetica", "bold");
  doc.text(toCurrency(balanceDue), PAGE_WIDTH - PAGE_MARGIN, finalY + 20, { align: "right" });

  // Footer: page numbers and account info.
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.text(`page: ${pageCurrent} of ${pageCount}`, PAGE_MARGIN, PAGE_HEIGHT - 35);
    if (pageCount > pageCurrent) {
      doc.text("continues to next page", PAGE_WIDTH - PAGE_MARGIN, PAGE_HEIGHT - 45, { align: "right" });
    }
    doc.line(PAGE_MARGIN, 270, PAGE_WIDTH - PAGE_MARGIN, 270);
    doc.text(
      [
        "Account name: CYTRANSOLUTIONS LTD",
        "Account number: 357026026038",
        "IBAN: CY47002001950000357026026038",
        "BIC: BCYPCY2N",
      ],
      PAGE_MARGIN,
      275
    );
  }

  const filename = `${
    invoice.invoiceDate
      ? new Date(invoice.invoiceDate).toISOString().slice(0, 10)
      : "DRAFT"
  }_${invoice.invoiceCode.replace("/", "-")}_${client.name}.pdf`;
  doc.save(filename);
}