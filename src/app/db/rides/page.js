'use client'

import React from "react";
import Table from "../components/Table";

export default function Rides() {
    const [rides, setRides] = React.useState([]);
    
    const [numOfEntries, setNumOfEntries] = React.useState(0);
    const [pageNo, setPageNo] = React.useState(0);
    const [limit, setLimit] = React.useState(10);
    const [pages, setPages] = React.useState([])

    async function fetchRides() {
      const response = await fetch(`/api/ride?page=${pageNo}&limit=${limit}`, {
        method: "GET",
        });
        const data = await response.json();
        setRides(data.body.data);
        setNumOfEntries(data.body.total);
        const arr = Array(Math.ceil(numOfEntries/limit))
        for (let index = 0; index < arr.length; index++) {
          arr[index] = index +1
        }
        setPages(arr)
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
    <Table titles={titles} data={rides} type={"rides"}  pageNo={pageNo} setPageNo={setPageNo} limit={limit} pages={pages} numOfEntries={numOfEntries} setLimit={setLimit}/>
  );
}
