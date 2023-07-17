"use client";

import { useRouter, usePathname } from "next/navigation";
import { BiPlus } from "react-icons/bi";
import { AiFillFilter } from "react-icons/ai";
import ReactSearchBox from "react-search-box";
import React from "react";
import { changeSingleStateValue } from "../../../../utils/utils";

export default function Controls({ data, filters, setFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const modelName = pathname.split("/db/")[1].slice(0, -1);

  const [showFilters, setShowFilters] = React.useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    const res = await fetch(
      `/api/${modelName}?query=${event.target.children[0].value}`
    );
  }

  // const filtersItems = filters.map((filter, i) => {

  //   return (
  //     <div className="flex gap-2">
  //       <label className="flex gap-3 border-[0.5px] rounded-md pr-3 pl-1 py-1 w-[10rem]">
  //         {Object.keys(filter)}
  //       </label>
  //       <input 
  //       type="date"
  //       value={Object.values(filter)[0].value}
  //       onChange={(newVal) => changeSingleStateValue(setFilters, filter, {active: true, value: newVal})}
  //       ></input>
  //     </div>
  //   );
  // });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between flex-wrap">
        <form onSubmit={handleSearch} className="w-[20rem] max-sm:w-full">
          <input
            placeholder="Search"
            className="rounded-md bg-black border-[0.5px] h-[2rem] p-4 text-white"
            type="text"
          ></input>
        </form>

        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex gap-3  border-[0.5px] rounded-md pr-3 pl-1 py-1"
        >
          <AiFillFilter />
          <span>Filter</span>
        </button>

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
      {showFilters &&
       <div className="flex flex-col gap-2">
        {/* {filtersItems} */}
        </div>
        }
    </div>
  );
}

// TODO: use it in the forms
// <ReactSearchBox
// inputBackgroundColor = "#000000"
// inputFontColor = "white"
// placeholder="Search"
// data={data}
// onSelect={(record) => console.log(record)}
// onChange={(value) => console.log(value)}
// />
