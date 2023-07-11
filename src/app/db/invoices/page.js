'use client'

import Title from "@/app/components/Title";
import React from "react";
import InvoiceRow from "@/app/db/invoices/components/InvoiceRow" 
import { useRouter } from "next/navigation";

export default function Invoices() {
  const router = useRouter()

    const [invoices, setInvoices] = React.useState([]);

    async function fetchInvoices() {
        const response = await fetch(`/api/invoice`, {
          method: "GET",
        });
        const data = await response.json();
        setInvoices(data.body.data);
      }

      React.useEffect(() => {
        fetchInvoices();
      }, []);

    const titles = [
        "Id",
        "Client",
        "Date",
        "Total",
        "Status",
        "Notes",
        "Actions",
      ];
  return (
    <main className="w-full overflow-hidden ">
              <Title title={"Invoices Overview"} />

      <table className="table-auto w-full min-w-fit">
        <thead>
          <tr>
            {titles.map((title, i) => (
              <th key={i} className="text-left px-3">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <InvoiceRow
              key={invoice._id}
              _id={invoice._id}
              code={invoice.code}
              clientName={invoice.client.name}
              date={invoice.date}
              status={invoice.status}
              notes={invoice.notes}
              total={invoice.total}
            />
          ))}
        </tbody>
      </table>
    </main>
  );
}
