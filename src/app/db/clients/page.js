"use client";

import React from "react";
import DbPage from "../components/DbPage";
import { useContext } from 'react';
import { FiltersContext } from "../layout";

export default function Clients() {

  let {filters_cli, setFilters_cli, sortBy_cli, setSortBy_cli} = useContext(FiltersContext);

  const titles = [
    {"Id": "_id" },
    {"Name": "name"},
    {"Address": "address"},
    {"Contact": null},
    // TODO: add this to client?
    // {"Charges": null},
    {"Notes": "notes"},
    {"Actions": null},
  ];

  return (
    <DbPage
      page={"client"}
      titles={titles}
      filters={filters_cli}
      setFilters={setFilters_cli}
      sortBy={sortBy_cli}
      setSortBy={setSortBy_cli}
    />
  );
}
