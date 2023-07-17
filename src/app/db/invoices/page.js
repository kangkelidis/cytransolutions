"use client";

import React from "react";
import DbPage from "../components/DbPage";

export default function Invoices() {

    const titles = [
        {"Id": "_id"},
        {"Client": "client"},
        {"Date": "date"},
        {"Total": "total"},
        {"Status": "status"},
        {"Notes": "notes"},
        {"Actions": null},
      ];
      const [filters, setFilters] = React.useState({
        from: {value: undefined, type: "date"},
        till: {value: undefined, type: "date"},
        client: {value: undefined, type: "select"},
        cash: {value: undefined, type: "select"},
        credit: {value: undefined, type: "select"},
        invoice: {value: undefined, type: "select"},
      });
  return (
    <DbPage
      page={"ride"}
      titles={titles}
      filters={filters}
      setFilters={setFilters}
    />
  );
}
