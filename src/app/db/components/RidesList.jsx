"use client";

import React from "react";
import { getSession } from "next-auth/react";
import { toCurrency } from "../../../../utils/utils";
import { useRouter } from "next/navigation";

export default function RidesList({ filters, totals, setTotals }) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();
  async function fetchUser() {
    const session = await getSession();
    return session.user;
  }

  async function fetchData() {
    const user = await fetchUser();
    if (user.role === "driver") {
      const response = await fetch(`api/driver?name=${user.name}`, {
        method: "GET",
      });
      const dbData = await response.json();
      filters.driver = dbData.body.data._id;
    }

    const response = await fetch(
      `/api/ride?from=${filters.from}&till=${filters.till}&driverId=${filters.driver}&clientId=${filters.client}`,
      {
        method: "GET",
      }
    );
    const dbData = await response.json();
    setData(dbData.body.data);
    const newTotals = {
    total: dbData.body.total,
    credit: dbData.body.credit,
    count: dbData.body.count,
  }

    if (!totals || newTotals.count !== totals.count || newTotals.credit !== totals.credit || newTotals.total !== totals.total ) {
        setTotals(newTotals)
    }
  }

  const titles = ["id", "date", "itinerary", "driver", "client", "total"];

  return (
    <div className="w-fit text-xs bg-gray-800 bg-opacity-60 rounded-b-lg">
      <table className="">
        <thead>
          <tr>
            {titles.map((title, i) => (
              <th className="capitalize text-left px-4" key={i}>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr
              key={i}
              className={`${i % 2 === 0 && " bg-gray-800"} hover:text-gray-400`}
            >
              <th
                onClick={() => router.push(`/db/rides/id=${d._id}`)}
                className={`font-thin text-left px-4 whitespace-nowrap ${
                  !d.invoice || d.invoice.status === "open"
                    ? "hover:!text-blue-700"
                    : "hover:!text-purple-500"
                } cursor-pointer`}
              >
                {d.count}
              </th>
              <th className="font-thin text-left px-4 whitespace-nowrap">
                {new Date(d.date).toLocaleDateString("en-UK", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </th>
              <th className="font-thin text-left px-4 whitespace-nowrap">
                {d.from + "-" + d.to}
              </th>
              <th className="font-thin text-left px-4 whitespace-nowrap">
                {d.driver.name}
              </th>
              <th className="font-thin text-left px-4 whitespace-nowrap">
                {d.client && d.client.name}
              </th>
              <th className="font-thin text-left px-4 whitespace-nowrap">
                {toCurrency(d.total, true)}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
