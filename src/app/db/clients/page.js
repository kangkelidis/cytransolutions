"use client";

import React from "react";
import DbPage from "../components/DbPage";

export default function Clients() {

  const titles = [
    {"Id": "_id" },
    {"Name": "name"},
    {"Address": "address"},
    {"Contact": null},
    // TODO: add this to client?
    {"Charges": null},
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
      page={"client"}
      titles={titles}
      filters={filters}
      setFilters={setFilters}
    />
  );
}
