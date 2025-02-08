"use client";

import React, { useContext } from "react";
import DbPage from "../components/DbPage";
import { FiltersContext } from "../layout";
import CreateInvoiceButton from "./components/CreateInvoiceButton";

export default function Invoices() {
  const { filters_inv, setFilters_inv, sortBy_inv, setSortBy_inv } = useContext(FiltersContext);

  const titles = [
    { "": null },
    { Id: "_id" },
    { Client: "client" },
    { Date: "date" },
    { Total: "total" },
    { Status: "status" },
    { Notes: "notes" },
    { Actions: null },
  ];

  return (
    <>
      <div className="w-ull flex justify-end">
        <CreateInvoiceButton />
      </div>
      <DbPage
        page={"invoice"}
        titles={titles}
        filters={filters_inv}
        setFilters={setFilters_inv}
        sortBy={sortBy_inv}
        setSortBy={setSortBy_inv}
      />
    </>
  );
}