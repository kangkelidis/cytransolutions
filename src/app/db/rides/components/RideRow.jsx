'use client'

import { MdModeEditOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import React from "react";

export default function RideRow({
  id,
  _id,
  date,
  client_id,
  driver_id,
  from,
  to,
  cash,
  credit,
  invoice,
  notes,
}) {

  const router = useRouter();
  const [driver, setDriver] = React.useState()
  const [client, setClient] = React.useState()
  const [needsUpdate, setNeedsUpdate] = React.useState(true);

  function handleEdit() {
    router.push(`/db/rides/id=${_id}`)
  }

  React.useEffect(() => {
    fetchClient(client_id)
    fetchDriver(driver_id)
  }, [needsUpdate])
  
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

  const tdClass = "align-top px-3 pt-1 pb-2 border-b-2"

  return (
    <tr className="bg-gray-800 hover:bg-gray-700">
      <td className={tdClass}>
        <span onClick={handleEdit} className="font-bold underline cursor-pointer">{id}</span>
      </td>

      <td className={tdClass}>
        <span className="font-bold">{date}</span>
      </td>

      <td className={tdClass}>
        <div className="flex flex-col">
          <small className="text-xs">From</small>
          <span>{from}</span>
        </div>
        <div className="flex flex-col">
          <small className="text-xs">To</small>
          <span>{to}</span>
        </div>
      </td>

      <td className={tdClass}>
        <span>{driver && driver.name}</span>
      </td>

      <td className={tdClass}>
        <span>{client && client.name}</span>
      </td>

      <td className={tdClass}>
        <div className="flex flex-col">
          <small className="text-xs">Cash</small>
          <span>{cash}</span>
        </div>
        <div className="flex flex-col">
          <small className="text-xs">Credit</small>
          <span>{credit}</span>
        </div>
      </td>

      <td className={tdClass}>
        <div className="flex flex-col">
          <small className="text-xs w-24">Open Invoice</small>
          <span className=" bg-green-400 bg-opacity-50 rounded-md text-center text-black font-bold">
            {invoice}98
          </span>
        </div>

      </td>

      <td className={tdClass}>
        <div className=" text-xs px-2 w-32 h-16">
          {notes}
        </div>
      </td>

      <td className={tdClass}>
        <button 
        onClick={handleEdit}
        className="flex gap-2">
          <MdModeEditOutline />
          Edit
        </button>
      </td>
    </tr>
  );
}
