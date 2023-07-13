"use client";

import { usePathname } from "next/navigation";

export default function DatabaseLayout({ children }) {
  const pathName = usePathname();
  return (
    <main className="w-full md:py-10 md:px-5 md:mx-5 xl:mx-auto my-10 max-w-7xl rounded-md shadow-lg bg-gray-800">
      <div className="bg-black rounded-md p-5 shadow-lg">
        <h1 className=" capitalize text-2xl font-bold">
          {pathName.split("/db/")[1] + " Overview"}
        </h1>

        <div className="bg-gray-800 rounded-md md:p-5 shadow-lg no-scrollbar overflow-scroll">
          {children}
        </div>
      </div>
    </main>
  );
}
