"use client";

import React from "react";
import DbPage from "../components/DbPage";
import { useContext } from 'react';
import { FiltersContext } from "../layout";

export default function Rides() {

  let {filters_ride, setFilters_ride, sortBy_ride, setSortBy_ride} = useContext(FiltersContext);

  const titles = [
    { Id: "_id" },
    { Date: "date" },
    { Itinerary: "from" },
    { Driver: "driver" },
    { Client: "client" },
    { Passenger: "passenger" },
    { Price: "total" },
    { Invoice: "invoice" },
    { Notes: "notes" },
    { Actions: null },
  ];
  return (
    <DbPage
      page={"ride"}
      titles={titles}
      filters={filters_ride}
      setFilters={setFilters_ride}
      sortBy={sortBy_ride}
      setSortBy={setSortBy_ride}
    />
  );
}
