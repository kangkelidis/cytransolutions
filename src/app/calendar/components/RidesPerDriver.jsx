"use client";

import { getSession } from "next-auth/react";
import React from "react";
import ResizableDiv from "./ResizableDiv";

export default function RidesPerDriver({ groupedByDriver }) {
  const [driverUser, setDriverUser] = React.useState();

  React.useEffect(() => {
    fetchUser().then((res) => {
      setDriverUser(res);
    });
  }, []);

  async function fetchUser() {
    const session = await getSession();
    return session.user.role === "driver" ? session.user : "manager";
  }

  return (
    <div className="flex flex-row gap-[110px]">
      {Object.keys(groupedByDriver).map((driver, i) => {
        if (driver === driverUser?.name || driverUser === "manager") {
            return (
              <div key={i}>
                {groupedByDriver[driver].map((result, i) => (
                  <div key={i} className="absolute pl-11 mt-[30px]">
                    <ResizableDiv rideInfo={result} />
                  </div>
                ))}
              </div>
            );
        }
      })}
    </div>
  );
}
