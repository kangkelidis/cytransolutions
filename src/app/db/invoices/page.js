'use client'

import React from "react";
import Table from "../components/Table";

export default function Invoices() {
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
    <Table titles={titles} data={invoices} type={"invoices"}/>
  );
}
