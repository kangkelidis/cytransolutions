"use client";

import { useRouter, usePathname } from "next/navigation";
import { BiPlus } from "react-icons/bi";
import ReactSearchBox from "react-search-box";

export default function Controls({ data }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex justify-between flex-wrap">
      <div className="w-[20rem] max-sm:w-full ">
      <ReactSearchBox
          inputBackgroundColor = "#000000"
          inputFontColor = "white"
          placeholder="Search" 
          data={data}
          onSelect={(record) => console.log(record)}
          onChange={(value) => console.log(value)}
          /> 

      </div>

      {!pathname.includes("invoice") && (

        <button
          onClick={() => router.push(pathname + "/create")}
          className="flex w-fit h-fit text-black bg-purple-500 rounded-2xl pr-3 pl-1 gap-2 py-1"
        >
          <BiPlus className="self-center" />
          NEW
        </button>
      )}
    </div>
  );
}
