"use client";

import React from "react";
import { changeSingleStateValue } from "../../../../utils/utils";
import { getSession } from "next-auth/react";

export default function UserForm() {
  const [data, setData] = React.useState();
  const [user, setUser] = React.useState();

  async function fetchUser() {
    const session = await getSession();
    setUser(session.user);
  }
  React.useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`/api/user`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  return (
    <div>
      {user && user.role === "admin" && (
        <form
          id="create"
          onSubmit={handleSubmit}
          className="flex flex-col w-1/2 p-4 "
        >
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="bg-slate-600 p-2 text-white"
            onChange={(nv) =>
              changeSingleStateValue(setData, "email", nv.target.value)
            }
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="text"
            className="bg-slate-600 p-2 text-white"
            onChange={(nv) =>
              changeSingleStateValue(setData, "password", nv.target.value)
            }
          />
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="bg-slate-600 p-2 text-white"
            onChange={(nv) =>
              changeSingleStateValue(setData, "name", nv.target.value)
            }
          />
          <label htmlFor="role">Role</label>
          <select
            id="role"
            className="bg-slate-600 p-2 text-white"
            onChange={(nv) =>
              changeSingleStateValue(setData, "role", nv.target.value)
            }
          >
            <option value={"admin"}>Admin</option>
            <option value={"manager"}>Manager</option>
            <option value={"driver"}>Driver</option>
          </select>
          <button type="submit" className="p-2 mt-4 bg-black">
            Create new User
          </button>
        </form>
      )}
    </div>
  );
}
