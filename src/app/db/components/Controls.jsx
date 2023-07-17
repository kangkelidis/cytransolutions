"use client";

import { useRouter, usePathname } from "next/navigation";
import { BiPlus } from "react-icons/bi";
import { AiFillFilter } from "react-icons/ai";
import ReactSearchBox from "react-search-box";
import React from "react";

export default function Controls({ filters, setFilters, searchTerm, setSearchTerm }) {
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

  function Input({ type, value, onChange, className }) {
    if (type === "select") {
      return (
        <select value={value} onChange={onChange} className={className}>
          <option value={undefined}>Show All</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      );
    } else {
      return (
      <div>
        <input
          placeholder=""
          className={className}
          type={type}
          value={value}
          onChange={onChange}
        ></input>
        <button onClick={null}>x</button>
      </div>
      )
    }
  }

  const filtersItems = Object.keys(filters).map((key,i) => {
    return (
      <div className="flex gap-2" key={i}>
        <label className="flex gap-3 border-[0.5px] rounded-md px-3 py-1 w-[10rem] capitalize">
          {key}
        </label>
        <Input
          className="text-black"
          type={filters[key].type}
          value={filters[key].value}
          onChange={(event) => {
            let newVal =
              event.target.value == "Show All" ? undefined : event.target.value;
            setFilters((prev) => {
              return {
                ...prev,
                [key]: { value: newVal, type: prev[key].type },
              };
            });
          }}
        />
      </div>
    );
  });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between flex-wrap">
        <form onSubmit={handleSearch} className="w-[20rem] max-sm:w-full">
          <input
            placeholder="Search"
            className="rounded-md bg-black border-[0.5px] h-[2rem] p-4 text-white"
            type="text"
            value={searchTerm}
            onChange={(event) => {setSearchTerm(event.target.value)}}
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
      {showFilters && <div className="flex flex-col gap-2">{filtersItems}</div>}
    </div>
  );
}