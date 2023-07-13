"use client";

import { MdModeEditOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import React from "react";
import DateDisplay from "../../components/DateDisplay";

export default function RideRow({
  entry: {
    count: id,
    _id,
    date,
    client: client_id,
    driver: driver_id,
    passenger,
    from,
    to,
    cash,
    credit,
    invoice: invoice_id,
    invoice_code: invoice,
    notes,
  },
  tdClass,
  trClass,
  tdId,
}) {
  const router = useRouter();
  const [driver, setDriver] = React.useState();
  const [client, setClient] = React.useState();
  const [needsUpdate, setNeedsUpdate] = React.useState(true);

  function handleEdit() {
    router.push(`/db/rides/id=${_id}`);
  }

  React.useEffect(() => {
    fetchClient(client_id);
    fetchDriver(driver_id);
  }, [needsUpdate]);

  async function fetchDriver(id) {
    const response = await fetch(`/api/driver?id=${id}`, {
      method: "GET",
    });
    const data = await response.json();
    setDriver(data.body);
    setNeedsUpdate(false);
  }

  async function fetchClient(id) {
    const response = await fetch(`/api/client?id=${id}`, {
      method: "GET",
    });
    const data = await response.json();
    setClient(data.body);
    setNeedsUpdate(false);
  }

  return (
    <tr className={trClass}>
      <td className={tdClass}>
        <span onClick={handleEdit} className={tdId}>
          {id}
        </span>
      </td>

      <td className={tdClass}>
        <DateDisplay date={date} />
      </td>

      <td className={tdClass}>
        <div className="flex flex-col">
          <small>From</small>
          <span>{from ? from : "-"}</span>
        </div>
        <div className="flex flex-col">
          <small>To</small>
          <span>{to ? to : "-"}</span>
        </div>
      </td>

      <td className={tdClass}>
        <span>{driver && driver.name}</span>
      </td>

      <td className={tdClass}>
        <span>{client && client.name}</span>
      </td>

      <td className={tdClass}>
        <span>{passenger}</span>
      </td>

      <td className={tdClass}>
        <div className="flex flex-col">
          <small>Cash</small>
          <span>{cash ? cash : "-"}</span>
        </div>
        <div className="flex flex-col">
          <small>Credit</small>
          <span>{credit ? credit : "-"}</span>
        </div>
      </td>

      <td className={tdClass}>
        <div
          onClick={() => router.push(`/db/invoices/id=${invoice_id}`)}
          className="flex flex-col cursor-pointer gap-3 "
          >
        <small className="whitespace-nowrap">Open Invoice</small>
          <span className=" bg-purple-400 bg-opacity-20 hover:bg-opacity-100 hover:text-white rounded-md text-center text-black font-bold">
            {invoice}
          </span>
        </div>
      </td>

      <td className={tdClass}>{notes}</td>

      <td className={tdClass}>
        <button onClick={handleEdit} className="flex gap-2">
          <MdModeEditOutline />
          Edit
        </button>
      </td>
    </tr>
  );
}
