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
        status: {value: undefined, type: "select", options: ["open", "closed", "paid", "issued"]},
      });
  return (
    <DbPage
      page={"invoice"}
      titles={titles}
      filters={filters}
      setFilters={setFilters}
    />
  );
}
