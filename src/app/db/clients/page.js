"use client";

import React from "react";
import Table from "../components/Table";

export default function Clients() {
  const [clients, setClients] = React.useState([]);
  const [needsUpdate, setNeedsUpdate] = React.useState(true);
  const [clientsNames, setClientsNames] = React.useState([{}]);
  const [numOfEntries, setNumOfEntries] = React.useState(0);

  const [pageNo, setPageNo] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState([])

  async function fetchClients() {
    const response = await fetch(`/api/client?page=${pageNo}&limit=${limit}`, {
      method: "GET",
    });
    const data = await response.json();
    setClients(data.body.data);
    setNumOfEntries(data.body.total);
    const arr = Array(Math.ceil(numOfEntries/limit))
    for (let index = 0; index < arr.length; index++) {
      arr[index] = index +1
    }
    setPages(arr)


    clients.map((client) => {
      setClientsNames((prev) => [
        ...prev,
        {
          key: client.name,
          value: client.name,
        },
      ]);
    });

    setNeedsUpdate(false);
  }

  React.useEffect(() => {
    fetchClients();
  }, [pageNo, limit, needsUpdate]);

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
    <Table titles={titles} data={clients} type={"clients"} pageNo={pageNo} setPageNo={setPageNo} limit={limit} pages={pages} numOfEntries={numOfEntries} setLimit={setLimit}/>
  );
}
