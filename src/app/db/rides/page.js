"use client";

import React from "react";
import DbPage from "../components/DbPage";

export default function Rides() {
  const [filters, setFilters] = React.useState({
    from: {value: undefined, type: "date"},
    till: {value: undefined, type: "date"},
    client: {value: undefined, type: "select"},
    cash: {value: undefined, type: "select"},
    credit: {value: undefined, type: "select"},
    invoice: {value: undefined, type: "select"},
  });


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
      filters={filters}
      setFilters={setFilters}
    />
  );
}
