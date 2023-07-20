"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function SidebarLink({ name, href, activeLink, setActiveLink, sidebarOpen }) {
  const router = useRouter();
  const [isHovering, setIsHovering] = React.useState(false)

  return (
    <div className="w-full">
    <a
      className={`${activeLink === href ? "text-purple-500 bg-gray-700" : ""}
      flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`}
      href={href}
      onClick={(evt) => {
        evt.preventDefault();
        setActiveLink(href);
        router.push(href);
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        src={"/icons/" + name + ".svg"}
        width={24}
        height={24}
        alt={name + "-icon"}
      />

      <span className={`${sidebarOpen ? "" : "hidden"} ml-2 text-sm font-medium capitalize`}>
        {name}
      </span>
    </a>
      <div className={`absolute left-[3rem] capitalize ${(!isHovering || sidebarOpen) && "hidden"} bg-gray-900 px-3 py-2 rounded-lg `}>
        {name}
      </div>
      </div>
  );
}
