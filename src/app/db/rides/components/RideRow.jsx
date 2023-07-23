"use client";

import { MdModeEditOutline } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { useRouter } from "next/navigation";
import React from "react";
import DateDisplay from "../../components/DateDisplay";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

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
  setReload,
}) {
  const router = useRouter();

  function handleEdit() {
    if (invoice.status !== "open" ) {
      alert("Invoice is not OPEN")
      return
    }
    router.push(`/db/rides/id=${_id}`);
  }

  async function handleDelete() {
    confirmAlert({
      title: "Are you sure?",
      message: "You want to delete this?",
      buttons: [
        {
          label: "No",
          onClick: () => {},
        },
        {
          label: "Yes, Delete it.",
          onClick: async () => {
            await fetch(`/api/ride?id=${_id}`, {
              method: "DELETE",
            });
            setReload((prev) => !prev);
          },
        },
      ],
    });
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

      <td className={tdClass + " min-w-[16rem] "}>
        <div className="flex flex-col">
          <small>From</small>
          <span>{from ? from : "-"}</span>
        </div>
        <div className="flex flex-col">
          <small>To</small>
          <span>{to ? to : "-"}</span>
        </div>
      </td>

      {!invoiceView && (
        <td className={tdClass + " min-w-[8rem]"}>
          <span>{driver.count +". "+ driver.name}</span>
        </td>
      )}
      {!invoiceView && (
        <td className={tdClass + " min-w-[8rem]"}>
          <span>{client && client.code +". "+ client.name}</span>
        </td>
      )}
      <td className={tdClass + " min-w-[8rem]"}>
        <span>{passenger}</span>
      </td>

      <td className={tdClass + " min-w-[5rem]"}>
        <div className="flex flex-col">
          <small>Cash</small>
          <span>{cash ? cash : "-"}</span>
        </div>
        <div className="flex flex-col">
          <small>Credit</small>
          <span>{credit ? credit : "-"}</span>
        </div>
      </td>

      {!invoiceView && (
        <td className={tdClass + " min-w-[7rem]"}>
          <div
            onClick={() => {
              invoice && router.push(`/db/invoices/id=${invoice._id}`);
            }}
            className="flex flex-col gap-1 "
          >
            <small className="whitespace-nowrap text-center">
              {invoice ? invoice.status + " invoice" : "no invoice"}
            </small>
            {invoice && (
              <span
                className={`cursor-pointer hover:bg-opacity-100 hover:px-3 hover:bg-purple-500 hover:text-white duration-300
              ${
                invoice.status == "open"
                  ? "bg-open"
                  : invoice.status === "closed"
                  ? "bg-closed"
                  : invoice.status === "issued"
                  ? "bg-issued"
                  : "bg-paid"
              }  
              bg-opacity-70 rounded-md text-center text-black font-bold p-2 w-fit m-auto`}
              >
                {invoice.code}
              </span>
            )}
          </div>
        </td>
      )}
      <td className={tdClass + " min-w-[8rem]"}>{notes}</td>

      <td className={tdClass + " "}>
        <button onClick={handleEdit} className="flex gap-2 mb-3">
          <MdModeEditOutline />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className={`flex gap-2 text-red-600 ${
            ((invoice && invoice.status !== "open" && invoice.status) ||
              (invoiceView && invoiceView !== "open")) &&
            "hidden"
          }`}
        >
          <TiDelete />
          Delete
        </button>
      </td>
    </tr>
  );
}
