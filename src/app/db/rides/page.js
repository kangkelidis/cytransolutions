'use client'

import React from "react";
import Table from "../components/Table";

export default function Rides() {
    const [rides, setRides] = React.useState([]);

    async function fetchRides() {
        const response = await fetch(`/api/ride`, {
          method: "GET",
        });
        const data = await response.json();
        setRides(data.body.data);
      }

    React.useEffect(() => {
      fetchRides();
    }, []);

    const titles = [
        "Id",
        "Date",
        "Itinerary",
        "Driver",
        "Client",
        "Passenger",
        "Price",
        "Invoice",
        "Notes",
        "Actions",
      ];
  return (
    <Table titles={titles} data={rides} type={"rides"}/>
  );
}
