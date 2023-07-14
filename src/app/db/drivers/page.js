'use client'

import React from "react";
import Table from "../components/Table";

export default function Drivers() {
    const [drivers, setDrivers] = React.useState([]);

    const [numOfEntries, setNumOfEntries] = React.useState(0);
    const [pageNo, setPageNo] = React.useState(0);
    const [limit, setLimit] = React.useState(10);
    const [pages, setPages] = React.useState([])

    async function fetchDrivers() {
      const response = await fetch(`/api/driver?page=${pageNo}&limit=${limit}`, {
        method: "GET",
        });
        const data = await response.json();
        setDrivers(data.body.data);
        setNumOfEntries(data.body.total);
        const arr = Array(Math.ceil(numOfEntries/limit))
        for (let index = 0; index < arr.length; index++) {
          arr[index] = index +1
        }
        setPages(arr)
      }

    React.useEffect(() => {
      fetchDrivers();
    }, []);

    const titles = [
        "Id",
        "Name",
        "Address",
        "Contact",
        "Charges",
        "Notes",
        "Actions",
      ];
  return (
    <Table titles={titles} data={drivers} type={"drivers"} pageNo={pageNo} setPageNo={setPageNo} limit={limit} pages={pages} numOfEntries={numOfEntries} setLimit={setLimit}/>

  );
}
