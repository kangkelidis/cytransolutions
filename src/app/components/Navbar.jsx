"use client"

import { signOut } from "next-auth/react"

export default function Navbar() {
    return (
        <nav>
            <button onClick={() => signOut()}>LOG OUT</button>

        </nav>
    )
}