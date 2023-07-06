"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SidebarLink({ name, href, activeLink, setActiveLink }) {
  const router = useRouter();

  return (
    <a
      className={`${activeLink === href ? "text-purple-500 bg-gray-700" : ""}
      flex items-center max-md:justify-center max-md:w-12 w-full h-12 md:px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`}
      href={href}
      onClick={(evt) => {
        evt.preventDefault();
        setActiveLink(href);
        router.push(href);
      }}
    >
      <Image
        src={"/icons/" + name + ".svg"}
        width={24}
        height={24}
        alt={name + "-icon"}
      />

      <span className="max-md:hidden ml-2 text-sm font-medium capitalize">
        {name}
      </span>
    </a>
  );
}
