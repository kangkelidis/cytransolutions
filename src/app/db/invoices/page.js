"use client";

import React from "react";
import DbPage from "../components/DbPage";
import { createContext, useContext, useState } from 'react';
import { FiltersContext } from "../layout";


export default function Invoices() {

  let  {filters, setFilters} = useContext(FiltersContext);

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
  // const [filters, setFilters] = React.useState({
  //   from: { value: undefined, type: "date" },
  //   till: { value: undefined, type: "date" },
  //   invoice: { value: "true", type: "hidden" },
  //   inv_status: { value: ["open"], type: "hidden" },
  // });


  return (
    <DbPage
      page={"invoice"}
      titles={titles}
      filters={filters}
      setFilters={setFilters}
    />
  );
}
