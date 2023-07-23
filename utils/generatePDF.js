import * as jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'
import { toCurrency } from "./utils.js";

// TODO: multiple pages when rides table does not fit in a single page
// TODO: Check account 
export function printInvoice(invoice) {
    const doc = new jsPDF.jsPDF();
  
    if (!invoice.date) {
        doc.setFontSize(19);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(255,0,0);

        doc.text("DRAFT", 100, 20)
        doc.setTextColor(0,0,0);


    }
    let file = require("../public/logo.js");
    doc.addImage(file.logo, "png", 13, 13, 17.4, 14.4);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
  
    doc.text("CYTRANSOLUTIONS LTD", 13, 34.8)
  
    doc.setFontSize(19);

    doc.text("Invoice", 197, 34.8, null,null, "right")
    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.text("Invoice No.", 170, 41.2)
    doc.text(invoice.date ? "Date: " + new Date(invoice.date).toLocaleDateString("en-UK") : "DRAFT", 197, 65.8, null,null, "right")
  
  
    doc.setFont("Helvetica", "bold");
    doc.text(invoice.code, 197, 41.2, null,null, "right");
  
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7);
  
    doc.text("Amathountos 34, Shop 8,", 13, 38.2)
    doc.text("Limassol, 4532", 13, 41.2)
    doc.text("Tel: +35799667777", 13, 44.2)
    doc.text("Email: 99667777cy@gmail.com", 13, 47.2)
    doc.text("VAT no : 10361018V", 13, 50.2)
  
    doc.text("Bill To:", 13, 61.8);
    if (invoice.client.email) {
        doc.text(["Email: " , invoice.client.email], 13, 70.5);
    } 
    if (invoice.client.tel) {
        doc.text(["Tel: ", invoice.client.tel], 13, 76.5);
    }
  
  
    doc.setFontSize(11);
    doc.setFont("Helvetica", "bold");
    doc.text(invoice.client.name, 13, 65.8);
  
  
    doc.autoTable({
        startY: 85,
        headStyles: { fillColor: [50,50,50] },
        margin: {left: 13, right: 13},
        styles: {
            fontSize: 9
          },
        head: [["Date", "Passenger", "Itinerary", "Notes", "Price" ]],
        body: invoice.rides.map(ride => {
            return [new Date(ride.date).toLocaleDateString("en-UK"), ride.passenger, ride.from + " - " + ride.to, ride.notes, ride.credit ]})
    })

    let finalY = doc.lastAutoTable.finalY
    doc.line(13, finalY + 5, 197, finalY + 5 )

    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text("Subtotal:", 150, finalY + 10 )
    doc.text(`${toCurrency(invoice.total)}`, 197, finalY + 10, null, null, "right" )
    doc.text("VAT 9%:", 150, finalY + 15 )
    doc.text(`${toCurrency(invoice.total * 9 / 100)}`, 197, finalY + 15, null, null, "right" )
    doc.text("Total:", 150, finalY + 20 )
    doc.setFont("Helvetica", "bold");
    doc.text(`${toCurrency(invoice.total * 109 / 100)}`, 197, finalY + 20, null, null, "right" )
    
    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.text("Notes: ", 13, finalY + 30);
    if (invoice.notes) {
        doc.text(invoice.notes, 13, finalY + 35);
    }

    doc.line(13, 270, 197, 270, "S" )
    doc.text(["Account name: CYTRANSOLUTIONS LTD", "Account number: 357026026038", 
    "IBAN: CY470020001950000357026026038", "BIC: BCYPCY2N"], 13, 275)

    // console.log(`${invoice.date ? new Date(invoice.date).toLocaleDateString("en-US") : "DRAFT" }_${invoice.code.replace("/", "-")}_${invoice.client.name}.pdf`);
    doc.save(`${invoice.date ? new Date(invoice.date).toLocaleDateString("en-UK") : "DRAFT" }_${invoice.code.replace("/", "-")}_${invoice.client.name}.pdf`);
  }