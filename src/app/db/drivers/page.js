'use client'

import React from "react";
import Table from "../components/Table";

export default function Drivers() {
    const [drivers, setDrivers] = React.useState([]);

    async function fetchDrivers() {
        const response = await fetch(`/api/driver`, {
          method: "GET",
        });
        const data = await response.json();
        setDrivers(data.body.data);
      }

    React.useEffect(() => {
      fetchDrivers();
    }, []);

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
    <Table titles={titles} data={drivers} type={"drivers"}/>

      // <table className="table-auto w-full min-w-fit">
      //   <thead>
      //     <tr>
      //       {titles.map((title, i) => (
      //         <th key={i} className="text-left px-3">
      //           {title}
      //         </th>
      //       ))}
      //     </tr>
      //   </thead>
      //   <tbody>
      //     {drivers.map((driver) => (
      //       <DriverRow
      //         key={driver._id}
      //         _id={driver._id}
      //         id={driver.count}
      //         name={driver.name}
      //         address={driver.address}
      //         email={driver.email}
      //         tel={driver.tel}
      //         notes={driver.notes}
      //       />
      //     ))}
      //   </tbody>
      // </table>

  );
}
