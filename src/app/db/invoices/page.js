"use client";

import React from "react";
import DbPage from "../components/DbPage";
import { useContext } from 'react';
import { FiltersContext } from "../layout";


export default function Invoices() {

  let {filters_inv, setFilters_inv, sortBy_inv, setSortBy_inv} = useContext(FiltersContext);

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
    <DbPage
      page={"invoice"}
      titles={titles}
      filters={filters_inv}
      setFilters={setFilters_inv}
      sortBy={sortBy_inv}
      setSortBy={setSortBy_inv}
    />
  );
}
