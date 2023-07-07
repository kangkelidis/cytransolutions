"use client";

import React from "react";
import Card from "./components/Card";
import Title from "@/app/components/Title";

export default function Clients() {
  const [clients, setClients] = React.useState([]);
  const [needsUpdate, setNeedsUpdate] = React.useState(true);
  const [clientsNames, setClientsNames] = React.useState([{}]);

  function handleAddClicked() {
    fetch("/api/client", {
      method: "POST",
      body: JSON.stringify({ name: "test5" }),
    });
    setNeedsUpdate(true);
  }
  async function fetchClients() {
    const request = await fetch("/api/client", {
      method: "GET",
    });
    const data = await request.json();
    setClients(data.body);

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
  }, [needsUpdate]);

  return (
    <main className="w-full h-full overflow-hidden ">
      <Title title={"Clients Overview"} data={clientsNames} />
      <div className="w-full h-5/6 overflow-y-scroll">
        {clients.map((client) => (
          <Card
            key={client._id}
            name={client.name}
            address={client.address}
            email={client.email}
          />
        ))}
      </div>
    </main>
  );
}
