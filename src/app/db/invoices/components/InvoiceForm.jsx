"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { printInvoice, changeSingleStateValue, toCurrency } from "../../../../../utils/utils";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import ChangeStatus from "./ChangeStatus";
import Table from "../../components/Table";
import Pill from "../../components/Pill";
import { jsPDF } from "jspdf";

export default function InvoiceForm() {
  const router = useRouter();

  const [invoice, setInvoice] = React.useState();
  const [clientName, setClientName] = React.useState();
  const [rides, setRides] = React.useState([]);
  const [dates, setDates] = React.useState({ from: null, till: null });
  const pathname = usePathname();
  const id = pathname.split("id=")[1];

  React.useEffect(() => {
    if (!invoice) fetchInvoice();
    invoice && fetchRides();
  }, [invoice]);

  async function fetchInvoice() {
    const response = await fetch(`/api/invoice?id=${id}`, {
      method: "GET",
    });

    const data = await response.json();
    setInvoice(data.body.data);
    setClientName(data.body.clientName);
  }

  async function fetchRides() {
    const ri = await Promise.all(
      invoice.rides.map(async (ride) => {
        const response = await fetch(`/api/ride?id=${ride}`);
        const data = await response.json();
        return data.body;
      })
    );
    setRides(ri);
    findDates(ri);
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

  async function handleSubmit(event) {
    event.preventDefault();

    await fetch(`/api/invoice?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...invoice }),
    });

    router.back();
  }

  async function handleDelete() {
    await fetch(`/api/invoice?id=${id}`, {
      method: "DELETE",
    });
    router.push("/db/invoices");
  }

  function savePDF() {
    printInvoice(invoice, clientName)
  }

  function Status() {
    return (
      <div className="flex flex-col gap-3 p-4 m-4 rounded-lg bg-slate-700 w-fit shadow-md">
        <h4 className="text-lg font-bold">Status: </h4>
        <ChangeStatus invoice={invoice} setInvoice={setInvoice} />
      </div>
    );
  }

  function Form() {
    return (
      <form onSubmit={handleSubmit}>
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
                changeSingleStateValue(setData, "date", newVal.target.value)
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
                changeSingleStateValue(setData, "notes", newVal.target.value)
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
          {
            <button
              type="button"
              className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-red-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              onClick={handleDelete}
            >
              DELETE
            </button>
          }
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
      <div className="bg-slate-700 p-4 rounded-lg m-4 shadow-md min-w-fit w-1/2 
      flex justify-between max-md:flex-col gap-3 max-md:w-full">

        <div className="w-full">
          <div className="flex flex-col gap-1" >
            <Pill label={"Client:"} value={clientName} />
            <Pill label={"From:"} value={dates.from} />
            <Pill label={"Till:"} value={dates.till} />
          </div>
        </div>

        <div className="flex flex-col text-lg font-bold"> 
          <small>Total</small>
          <span className="bg-green-800 w-[7rem] text-center px-4 py-1 rounded-lg">
            {toCurrency(invoice.total)}</span>
        </div>

      </div>
    );
  }

  const titles = [
    "Id",
    "Date",
    "Itinerary",
    "Passenger",
    "Price",
    "Notes",
    "Actions",
  ];

  return (
    <div>
      {invoice && (
        <div>
          <h1 className="p-4 text-lg font-bold">INVOICE No: <span className="text-purple-400 pl-4 font-extrabold">{invoice.code}</span></h1>
          
          <button onClick={savePDF}>Save PDF</button>
          
          <div className="flex w-full justify-between flex-wrap">
            <Info />
            <Status />
          </div>
          {rides && (
            <div className="bg-slate-700 p-4 rounded-lg m-4 shadow-md">
              <h4 className="text-lg font-bold">Rides: </h4>

              <Table titles={titles} data={rides} type={"ridesInInvoice"} />
            </div>
          )}
          <Form />
        </div>
      )}
    </div>
  );
}
