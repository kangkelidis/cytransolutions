'use client'

import InvoiceForm from "../components/InvoiceForm";
import { useSession } from "next-auth/react";
import React from "react";

export default function EditInvoice() {
    const { data: session } = useSession();

    let role
    React.useEffect(() => {
        if (!session) return
        role = session.user.role
    
      }, [session]);

    return (
        <div>
            {role === "admin" || role === "manager" ? <InvoiceForm /> : <></> }
        </div>
    )
}