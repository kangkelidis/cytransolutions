'use client';

import { SessionProvider } from "next-auth/react";
import React from "react";
const checkUser = import("../../utils/checkUser");


 

export default function AuthContext({ children }) {


    async function fetchData() {
        // const response = await fetch(`/api/ride`, {
        //   method: "GET",
        //   });
        //   const data = await response.json();
        //   setSearchData(data.body.data);
        // const an = await (await checkUser).hasToken()
        //   console.log(an);
        }
  
    React.useEffect(() => {
        fetchData();
      }, []);

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}