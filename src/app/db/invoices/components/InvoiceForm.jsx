"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { changeSingleStateValue, toCurrency } from "../../../../../utils/utils";
import { printInvoice } from "../../../../../utils/generatePDF";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import ChangeStatus from "./ChangeStatus";
import Table from "../../components/Table";
import Pill from "../../components/Pill";
import { confirmAlert } from "react-confirm-alert";

export default function InvoiceForm() {
  const router = useRouter();

  const [invoice, setInvoice] = React.useState();
  const [dates, setDates] = React.useState({ from: null, till: null });
  const [sortBy, setSortBy] = React.useState({ col: "date", rev: false });
  const pathname = usePathname();
  const id = pathname.split("id=")[1];
  const [reload, setReload] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    fetchInvoice();
  }, [sortBy, reload]);

  async function fetchInvoice() {
    const response = await fetch(
      `/api/invoice?id=${id}&sort=${sortBy.col}&rev=${sortBy.rev}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    if (!data.body.data) {
      router.push("/db/invoices")
      setIsLoading(false);
      return
    }
    setInvoice(data.body.data);
    findDates(data.body.data.rides);
    setIsLoading(false);
  }

  function findDates(rides) {
    let from = rides[0].date;
    let till = rides[0].date;
    rides.forEach((ride) => {
      if (ride.date < from) {
        from = ride.date;
      }
      if (ride.date > till) {
        till = ride.date;
      }
    });
    setDates({
      from: new Date(from).toLocaleDateString("en-UK"),
      till: new Date(till).toLocaleDateString("en-UK"),
    });
  }

  async function handleSubmit(event, id, value, date) {
    event.preventDefault();
    setIsLoading(true);

    const b = value
      ? JSON.stringify({ ...invoice, status: value, date: date })
      : JSON.stringify({ ...invoice, date: date });

    await fetch(`/api/invoice?id=${id}`, {
      method: "PUT",
      body: b,
    });

    router.refresh();
    setIsLoading(false);
  }


  // TODO try catch and async
  function savePDF() {
    if (invoice.status === "open") {
      confirmAlert({
        title: "Invoice is OPEN",
        message: "Do you want to CLOSE the invoice with today's Date?",
        buttons: [
          {
            label: "Cancel",
            onClick: () => {},
          },
          {
            label: "No. Print Draft",
            onClick: () => {
              printInvoice(invoice);
            },
          },
          {
            label: "Yes, Close it.",
            onClick: async () => {
              changeSingleStateValue(setInvoice, "status", "closed");
              changeSingleStateValue(setInvoice, "date", new Date());
              await fetch(`/api/invoice?id=${invoice._id}`, {
                method: "PUT",
                body: JSON.stringify({
                  ...invoice,
                  status: "closed",
                  date: new Date(),
                }),
              });
              printInvoice({ ...invoice, status: "closed", date: new Date() });
            },
          },
        ],
      });
    } else {
      printInvoice(invoice);
    }
  }

  async function emailPDF() {
    if (invoice.status === "open") return
    if (!invoice.client.email) {
      alert("Client has no email. Add email in client settings")
      return
    }
    if (invoice.status === "closed") {
      confirmAlert({
        title: "Invoice is CLOSED",
        message: "Do you want to set status to ISSUED?",
        buttons: [
          {
            label: "Cancel",
            onClick: () => {},
          },
          {
            label: "Yes, set it to ISSUED.",
            onClick: async () => {
              changeSingleStateValue(setInvoice, "status", "issued");
              await fetch(`/api/invoice?id=${invoice._id}`, {
                method: "PUT",
                body: JSON.stringify({
                  ...invoice,
                  status: "issued",
                }),
              });
              printInvoice({ invoice });
            },
          },
        ],
      });
    }
    if (invoice.status === "paid") {
      confirmAlert({
        title: "Invoice is already PAID",
        message: "Do you want send an email anyway?",
        buttons: [
          {
            label: "Cancel",
            onClick: () => {},
          },
          {
            label: "Yes, and set status to ISSUED",
            onClick:async () => {
              changeSingleStateValue(setInvoice, "status", "issued");
              await fetch(`/api/invoice?id=${invoice._id}`, {
                method: "PUT",
                body: JSON.stringify({
                  ...invoice,
                  status: "issued",
                }),
              });

              printInvoice(invoice);
            },
          },
          {
            label: "Yes, and leave status as PAID.",
            onClick: () => {
              printInvoice(invoice);
            },
          },
        ],
      });
    }
    if (invoice.status === "issued") {
      printInvoice(invoice);
 
    }
  }

  function Status() {
    return (
      <div className="flex flex-col gap-3 p-4 m-4 rounded-lg bg-slate-700 w-fit shadow-md">
        <h4 className="text-lg font-bold">Status: </h4>
        <ChangeStatus
          invoice={invoice}
          setInvoice={setInvoice}
          handleSubmit={handleSubmit}
          id={id}
        />
      </div>
    );
  }

  function Form() {
    return (
      <form onSubmit={async (event) => await handleSubmit(event, id)}>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 bg-slate-700 p-4 rounded-lg m-4 shadow-md">
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="Name">
              Date*
            </label>
            <Flatpickr
              options={{
                altInput: true,
                altFormat: "d-m-y -- H:i",
              }}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              data-enable-time
              value={invoice.date}
              onChange={(newVal) =>
                changeSingleStateValue(setInvoice, "date", newVal)
              }
            />
          </div>

          <div className="col-span-2">
            <label className="text-gray-700 dark:text-gray-200" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              type="email"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              value={invoice ? invoice.notes : null}
              onChange={(newVal) =>
                changeSingleStateValue(setInvoice, "notes", newVal.target.value)
              }
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="submit"
            className=" px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            onClick={() => router.back()}
          >
            Back
          </button>

          <button
            type="submit"
            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Update
          </button>
        </div>
      </form>
    );
  }

  function Info() {
    return (
      <div
        className="bg-slate-700 p-4 rounded-lg m-4 shadow-md min-w-fit w-1/2 
      flex justify-between max-md:flex-col gap-3 max-md:w-full"
      >
        <div className="w-full">
          <div className="flex flex-col gap-1">
            <div
              className="cursor-pointer"
              onClick={() =>
                router.push(`/db/clients/id=${invoice.client._id}`)
              }
            >
              <Pill label={"Client:"} value={invoice.client.name} />
            </div>
            <Pill label={"From:"} value={dates.from} />
            <Pill label={"Till:"} value={dates.till} />
          </div>
        </div>

        <div className="flex flex-col text-lg font-bold">
          <small>Total</small>
          <span className="bg-green-800 w-[7rem] text-center px-4 py-1 rounded-lg">
            {toCurrency(invoice.total)}
          </span>
        </div>
      </div>
    );
  }

  const titles = [
    { Id: "_id" },
    { Date: "date" },
    { Itinerary: "from" },
    { Passenger: "passenger" },
    { Price: "credit" },
    { Notes: "notes" },
    { Actions: null },
  ];

  return (
    <div className="">
      {invoice && !isLoading && (
        <div>
          <h1 className="p-4 text-lg font-bold">
            INVOICE No:{" "}
            <span className="text-purple-400 pl-4 font-extrabold">
              {invoice.code}
            </span>
          </h1>

          <div className="flex flex-row gap-3">
            <button
              className={`border-[0.5px] rounded-md px-3 py-1 w-[7rem] hover:bg-purple-400`}
              onClick={savePDF}
            >
              Save PDF
            </button>

            <button
              className={`border-[0.5px] rounded-md px-3 py-1 w-[7rem] hover:bg-purple-400 disabled:bg-slate-600 disabled:text-gray-400 disabled:border-0`}
              disabled={invoice.status === "open"}
              onClick={emailPDF}
            >
              Send Email
            </button>
          </div>

          <div className="flex w-full justify-between flex-wrap">
            <Info />
            <Status />
          </div>
          {invoice.rides && (
            <div className="bg-slate-700 p-4 rounded-lg m-4 shadow-md">
              <h4 className="text-lg font-bold">Rides: </h4>
              <Table
                titles={titles}
                data={invoice.rides}
                setSortBy={setSortBy}
                sortBy={sortBy}
                type={"ridesInInvoice"}
                ridesInInvoice={invoice.status}
                setReload={setReload}
              />
            </div>
          )}
          <Form />
        </div>
      )}
    </div>
  );
}
