'use client'

import React from "react"
import StatusBox from "../../components/StatusBox"

export default function ChangeStatus({ currentStatus }) {

    const [status, setStatus] = React.useState(currentStatus) 
    const statusArr = ["open", "closed", "issued", "paid"]

    return (
        <div className="flex gap-2">
            {statusArr.map(item => 
            <div className="bg-purple-500 rounded-lg p-2 w-16 text-center text-sm">{item}</div>)}
        </div>
    )
}