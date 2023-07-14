'use client'

import React from "react";
import Table from "../components/Table";

export default function Invoices() {
    const [invoices, setInvoices] = React.useState([]);

    const [numOfEntries, setNumOfEntries] = React.useState(0);
    const [pageNo, setPageNo] = React.useState(0);
    const [limit, setLimit] = React.useState(10);
    const [pages, setPages] = React.useState([])

    async function fetchInvoices() {
      const response = await fetch(`/api/invoice?page=${pageNo}&limit=${limit}`, {
        method: "GET",
        });
        const data = await response.json();
        setInvoices(data.body.data);
        setNumOfEntries(data.body.total);
        const arr = Array(Math.ceil(numOfEntries/limit))
        for (let index = 0; index < arr.length; index++) {
          arr[index] = index +1
        }
        setPages(arr)
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
    <Table titles={titles} data={invoices} type={"invoices"}  pageNo={pageNo} setPageNo={setPageNo} limit={limit} pages={pages} numOfEntries={numOfEntries} setLimit={setLimit}/>
  );
}
