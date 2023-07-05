'use client'

import React from "react";


export default function Clients() {
    const [clients, setClients] = React.useState([])
    const [needsUpdate, setNeedsUpdate] = React.useState(true)
    
    function handleAddClicked() {
        fetch("/api/client", {
            method: "POST",
            body: JSON.stringify({name: "test5"})
        })
        setNeedsUpdate(true)
    }
    async function fetchClients() {
        const request = await fetch("/api/client", {
            method: "GET"})
        const data = await request.json()
        setClients(data.body)
        setNeedsUpdate(false)
    }

    React.useEffect(() => {
        fetchClients()
    }, [needsUpdate])

    return (
        <main>
        <h1>clients</h1>

        <div>{clients.map(client => <p key={client._id}>{client.name}</p>)}</div>

        <button onClick={handleAddClicked}>
            Add
        </button>

        </main>
    )
}

