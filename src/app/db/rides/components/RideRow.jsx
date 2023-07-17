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
    client,
    driver,
    passenger,
    from,
    to,
    cash,
    credit,
    invoice,
    notes,
  },
  invoiceView,
  tdClass,
  trClass,
  tdId,
}) {
  const router = useRouter();

  function handleEdit() {
    router.push(`/db/rides/id=${_id}`);
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

      {!invoiceView &&
      <td className={tdClass}>
        <span>{driver.name}</span>
      </td>
      }
      {!invoiceView &&
      <td className={tdClass}>
        <span>{client && client.name}</span>
      </td>
}
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

      {!invoiceView &&


      <td className={tdClass}>
        <div
          onClick={() => router.push(`/db/invoices/id=${invoice._id}`)}
          className="flex flex-col gap-3 "
          >
        <small className="whitespace-nowrap">Open Invoice</small>
          <span className={`${invoice && invoice.code ? "cursor-pointer hover:bg-opacity-100 hover:text-white " : ""} bg-purple-400 bg-opacity-20 rounded-md text-center text-black font-bold`}>
            {invoice && invoice.code}
          </span>
        </div>
      </td>
}

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
