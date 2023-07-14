"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { changeSingleStateValue } from "../../../../../utils/utils";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import ChangeStatus from "./ChangeStatus";

export default function InvoiceForm() {
  const router = useRouter();

  const [invoice, setInvoice] = React.useState();
  const [rides, setRides] = React.useState([]);
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
    setInvoice(data.body);
  }

  async function fetchRides() {
    const ri = await Promise.all(
      invoice.rides.map(async (ride) => {
        const response = await fetch(`/api/ride?id=${ride}`);
        const data = await response.json();
        return data.body;
      })
    );
    setRides(ri[0].data);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await fetch(`/api/invoice?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...invoice }),
    });

  }

  async function handleDelete() {
    await fetch(`/api/invoice?id=${id}`, {
      method: "DELETE",
    });
    router.push("/db/invoices");
  }

  return (
    <div>
      <ChangeStatus />
      {invoice && (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="Name"
                >
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
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="notes"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  type="email"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  value={invoice ? invoice.notes : null}
                  onChange={(newVal) =>
                    changeSingleStateValue(
                      setData,
                      "notes",
                      newVal.target.value
                    )
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

          <div>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Date</th>
                  <th>Passenger</th>
                  <th>Itinerary</th>
                  <th>Price</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {rides &&
                  rides.map((ride) => (
                    <tr>
                      <th
                        className="cursor-pointer"
                        onClick={() => router.push(`/db/rides/id=${ride._id}`)}
                      >
                        {ride.count}
                      </th>
                      <th>{ride.date}</th>
                      <th>{ride.passenger}</th>
                      <th>{ride.itinerary}</th>
                      <th>{ride.credit}</th>
                      <th>{ride.notes}</th>
                    </tr>
                  ))}
              </tbody>
            </table>

            {invoice && (
              <div>
                <div>
                  <span>Total</span>
                  <span>{invoice.total}</span>
                </div>

                <div>
                  <div>
                    <label>Invoice No.</label>
                    <span>{invoice.code}</span>
                  </div>
                  {/* <div><label>Client:</label><span>{clientName}</span></div> */}
                  <div>
                    <label>From</label>
                    <span>{}</span>
                  </div>
                  <div>
                    <label>Till</label>
                    <span>{}</span>
                  </div>
                </div>

                <div>
                  <span>Status</span>
                  <div>{invoice.status}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
