'use client'

import InvoiceForm from "../components/InvoiceForm";
import { getSession } from "next-auth/react";
import React from "react";

export default function EditInvoice() {
    async function fetchUser() {
        const session = await getSession()
        setUser(session.user)
      }

    const [user, setUser] = React.useState()

    React.useEffect(() => {
        fetchUser()
      }, []);


    return (
        <div>
            {user && (user.role === "admin" || user.role === "manager") ? <InvoiceForm /> : <></> }
        </div>
    )
}