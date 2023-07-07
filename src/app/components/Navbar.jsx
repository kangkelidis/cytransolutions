"use client";

import { signOut } from "next-auth/react";
import SidebarLink from "./SidebarLink";
import React from "react";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = React.useState(pathname);

  return (
      <nav
        className={`${
          sidebarOpen ? "w-[10rem]" : "max-md:!w-0 w-fit"
        } max-md:absolute ease-in-out duration-300 flex flex-col items-center overflow-hidden text-white bg-gray-900 rounded`}
      >
        <a
          className="flex items-center justify-center w-full px-3 mt-3"
          href="/"
        >
          <svg
            className="w-8 h-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
          <span className={`${sidebarOpen ? "" : "hidden"} ml-2 text-sm font-bold`}>
            Cytransolutions
          </span>
        </a>

        <div className="flex flex-col items-center w-full mt-3 px-2 border-t border-gray-700">
          <SidebarLink
            href={"/dashboard"}
            name={"dashboard"}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            href={"/calendar"}
            name={"calendar"}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            href={"/db/rides"}
            name={"rides"}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            href={"/db/invoices"}
            name={"invoices"}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            href={"/db/drivers"}
            name={"drivers"}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            sidebarOpen={sidebarOpen}
          />
          <SidebarLink
            href={"/db/clients"}
            name={"clients"}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            sidebarOpen={sidebarOpen}
          />
        </div>

        <div className=" mt-auto mb-5 cursor-pointer w-full">
          <a
            className={`flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`}
            onClick={(evt) => {
              evt.preventDefault();
              signOut();
            }}
          >
            <Image
              src={"/icons/logout.svg"}
              width={24}
              height={24}
              alt={"logout-icon"}
            />

            <span className={`${sidebarOpen ? "" : "hidden"} ml-2 text-sm font-medium capitalize`}>
              Logout
            </span>
          </a>
        </div>
      </nav>
  );
}
