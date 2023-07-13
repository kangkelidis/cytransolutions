"use client";

import React from "react";
import Table from "../components/Table";

export default function Clients() {
  const [clients, setClients] = React.useState([]);
  const [needsUpdate, setNeedsUpdate] = React.useState(true);
  const [clientsNames, setClientsNames] = React.useState([{}]);
  const [numOfEntries, setNumOfEntries] = React.useState(0);
  const [pageNo, setPageNo] = React.useState(0);
  const [limit, setLimit] = React.useState(20);
  const [pages, setPages] = React.useState([])

  async function fetchClients() {
    const response = await fetch(`/api/client?page=${pageNo}&limit=${limit}`, {
      method: "GET",
    });
    const data = await response.json();
    setClients(data.body.data);
    setNumOfEntries(data.body.total);
    setPages(Array(Math.ceil(numOfEntries/limit)).fill(0))

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
  }, [pageNo, needsUpdate]);

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

      // <div className="overflow-scroll h-5/6 m-4">
      //   <table className="table-auto w-full min-w-fit">
      //     <thead>
      //       <tr>
      //         {titles.map((title, i) => (
      //           <th key={i} className="text-left px-3">
      //             {title}
      //           </th>
      //         ))}
      //       </tr>
      //     </thead>
      //     <tbody>
      //       {clients.map((client) => (
      //         <Card
      //           key={client._id}
      //           _id={client._id}
      //           code={client.code}
      //           name={client.name}
      //           address={client.address}
      //           email={client.email}
      //           tel={client.tel}
      //           notes={client.notes}
      //         />
      //       ))}
      //     </tbody>
      //   </table>

      //   <div className="w-full bg-white dark:bg-gray-800">
      //     <div className="container flex flex-col items-center px-6 py-5 mx-auto space-y-6 sm:flex-row sm:justify-between sm:space-y-0 ">
      //       <div className="-mx-2 flex">
      //         <a
      //           onClick={() => {
      //             setPageNo((prev) => prev - (1 % numOfEntries));
      //           }}
      //           className="flex items-center px-4 py-2 mx-1 text-gray-500 bg-white rounded-md cursor-not-allowed1 dark:bg-gray-800 dark:text-gray-600"
      //         >
      //           {"<"}
      //         </a>

      //         {
      //           pages.map((x, i) => (
      //             <a
      //               key={i}
      //               onClick={() => setPageNo(i)}
      //               className="inline-flex items-center justify-center px-4 py-1 mx-2 text-gray-700 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      //               >
      //               {i + 1}
      //             </a>
      //           ))
      //         }

      //         <a
      //           onClick={() => {
      //             setPageNo((prev) => prev + (1 % numOfEntries));
      //           }}
      //           className="flex items-center px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
      //         >
      //           {">"}
      //         </a>
      //       </div>

      //       <div className="text-gray-500 dark:text-gray-400">
      //         <span className="font-medium text-gray-700 dark:text-gray-100">
      //           {pageNo * limit + 1} - {Math.min(numOfEntries, (pageNo * limit + limit))}
      //         </span>{" "}
      //         of {numOfEntries} records
      //       </div>
      //     </div>
      //   </div>
      // </div>

      <Table titles={titles} data={clients} type={"clients"}/>

  );
}
