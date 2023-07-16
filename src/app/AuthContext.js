'use client';

import { SessionProvider } from "next-auth/react";
import React from "react";

export default function AuthContext({ children, session }) {

    const [searchData, setSearchData] = React.useState()

    async function fetchData() {
        const response = await fetch(`/api/ride`, {
          method: "GET",
          });
          const data = await response.json();
          setSearchData(data.body.data);
        }
  
    React.useEffect(() => {
        fetchData();
      }, []);

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}