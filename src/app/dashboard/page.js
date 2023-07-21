"use client";

import React from "react";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  const role = session && session.user.role;

  async function handleSubmit(event) {
    event.preventDefault();
    let data = {
        name: "driver test",
        email: "driver@test.com",
        password: "123456",
        role: "driver",
    }

    await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ ...data }),
      });

  }

  return (
    <main>
      <h1>DASHBOARD</h1>

      {(role === "admin" || (role === "manager")) && (
          <div>
            <form onSubmit={(event) => handleSubmit(event)}>
              <div>
                <label>Name</label>
                <input type="text" />
              </div>
              <div>
                <label>Email</label>
                <input type="text" />
              </div>
              <div>
                <label>Role</label>
                <select>
                  <option>Driver</option>
                </select>
                <input type="text" />
              </div>
              <button>Create User</button>
            </form>
          </div>
        )}
    </main>
  );
};

export default Dashboard;
