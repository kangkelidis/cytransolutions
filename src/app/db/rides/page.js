"use client";

import React from "react";
import DbPage from "../components/DbPage";

export default function Rides() {
  const [filters, setFilters] = React.useState([

    {
    "Date From" : {
      active: false,
      value: -Infinity,
    }
  },

  {
    "Date Till" : {
      active: false,
      value: Infinity
    }
  },
  
]);

  
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
  return <DbPage page={"ride"} titles={titles} filters={filters} setFilters={setFilters} />;
}
