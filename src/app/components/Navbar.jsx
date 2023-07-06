"use client";

import { signOut } from "next-auth/react";
import SidebarLink from "./SidebarLink";

export default function Navbar() {
  return (
    <nav className="flex flex-col items-center w-40 max-md:w-16 h-screen overflow-hidden text-white bg-gray-900 rounded">
      <a
        className="flex items-center max-md:justify-center w-full md:px-3 mt-3"
        href="/"
      >
        <svg
          class="w-8 h-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
        </svg>
        <span className=" max-md:hidden ml-2 text-sm font-bold">Cytransolutions</span>
      </a>

      <div className="flex flex-col items-center md:w-full mt-3 md:px-2 border-t border-gray-700">
        <SidebarLink href={"/dashboard"} name={"dashboard"} />
        <SidebarLink href={"/calendar"} name={"calendar"} />
        <SidebarLink href={"/db/rides"} name={"rides"} />
        <SidebarLink href={"/db/invoices"} name={"invoices"} />
        <SidebarLink href={"/db/drivers"} name={"drivers"} />
        <SidebarLink href={"/db/clients"} name={"clients"} />
      </div>

      <div className=" mt-auto mb-5">
        <SidebarLink onClick={signOut} name={"logout"} />
      </div>

    </nav>
  );
}
