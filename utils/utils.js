import * as jsPDF from "jspdf";

export function changeSingleStateValue(setter, name, value) {
  setter((prev) => {
    return {
      ...prev,
      [name]: value,
    };
  });
}

export async function delay(ms) {
  await new Promise((res) => setTimeout(res, ms));
}

export function toCurrency(number, withoutCents) {
  if (isNaN(number)) return;
  return number.toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: withoutCents ? 0 : 2,
    maximumFractionDigits: withoutCents ? 0 : 2,
  });
}

export function printInvoice(invoice, clientName) {
  // const doc = new jsPDF.jsPDF();

  // let file = require("../public/logo.js");

  // doc.addImage(file.logo, "png", 10, 10, 40, 50);

  // doc.text("Bill To:", 10, 10);
  // doc.text(clientName, 10, 20);
  // doc.text(invoice.code, 10, 10);
  // // create a temp pdf
  // doc.save(`a4.pdf`);
}
