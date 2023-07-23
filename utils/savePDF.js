"use client";

import { confirmAlert } from "react-confirm-alert";
import { printInvoice } from "./generatePDF";

export async function savePDF(inv_id, closeInvoice) {
  const invoice = await fetchInvoice();

  async function fetchInvoice() {
    const response = await fetch(`/api/invoice?id=${inv_id}`, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    return data.body.data;
  }

  if (invoice.status === "open") {
    if (closeInvoice) {
      await fetch(`/api/invoice?id=${invoice._id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...invoice,
          status: "closed",
          date: new Date(),
        }),
      });
      printInvoice({ ...invoice, status: "closed", date: new Date() });
    } else {
        confirmAlert({
          title: "Invoice " + invoice.code + " is OPEN",
          message: "Do you want to CLOSE the invoice with today's Date?",
          buttons: [
            {
              label: "Cancel",
              onClick: () => {},
            },
            {
              label: "No. Print Draft",
              onClick: () => {
                printInvoice(invoice);
              },
            },
            {
              label: "Yes, Close it.",
              onClick: async () => {
                await fetch(`/api/invoice?id=${invoice._id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    ...invoice,
                    status: "closed",
                    date: new Date(),
                  }),
                });
                printInvoice({ ...invoice, status: "closed", date: new Date() });
              },
            },
          ],
        });
    }
  } else {
    printInvoice(invoice);
  }
}
