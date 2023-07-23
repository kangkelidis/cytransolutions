"use client";

import React from "react";
import DbPage from "../components/DbPage";
import { useContext } from 'react';
import { FiltersContext } from "../layout";

export default function Drivers() {

  let {filters_dri, setFilters_dri, sortBy_dri, setSortBy_dri} = useContext(FiltersContext);

    const titles = [
        {"Id": "_id"},
        {"Name": "name"},
        {"Address": "address"},
        {"Contact": "tel"},
        // {"Charges": null},
        {"Notes": "notes"},
        {"Actions": null},
      ];
  return (
    <DbPage
      page={"driver"}
      titles={titles}
      filters={filters_dri}
      setFilters={setFilters_dri}
      sortBy={sortBy_dri}
      setSortBy={setSortBy_dri}
    />

  );
}
