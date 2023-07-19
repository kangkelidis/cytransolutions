"use client";

import { useRouter, usePathname } from "next/navigation";
import { BiPlus } from "react-icons/bi";
import { AiFillFilter } from "react-icons/ai";
import React from "react";

export default function Controls({
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const modelName = pathname.split("/db/")[1].slice(0, -1);

  const [showFilters, setShowFilters] = React.useState(false);
  const [numOfFilters, setNumOfFilters] = React.useState(0);

  const searchRef = React.useRef()

  async function handleSearch(event) {
    event.preventDefault();
    const res = await fetch(
      `/api/${modelName}?query=${event.target.children[0].value}`
    );
  }

  React.useEffect(() => {
    setNumOfFilters(
      Object.values(filters).reduce((acc, val) => {
        if (val.value !== undefined) return acc + 1;
        return acc;
      }, 0)
    );
  }, [filters]);

  function ResetFilters() {
    return (
      <button
        onClick={() => {
          setFilters((prev) => {
            return Object.keys(prev).reduce((acc, key) => {
              acc[key] = { value: undefined, type: prev[key].type };
              return acc;
            }, {});
          })
          setSearchTerm("")
          searchRef.current.value = ""
        }}
        className="flex gap-3 border-[0.5px] rounded-md px-3 py-1 w-[10rem] capitalize"
      >
        Clear Filters
      </button>
    );
  }

  function Input({ type, value, options, onChange, className }) {
    if (type === "select") {
      if (options) {
        return (
          <select multiple value={value} onChange={onChange} className={className}>
            {options.map(option => <option value={option}>{option}</option>)}
          </select>
        );
      } else {
        return (
          <select value={value} onChange={onChange} className={className}>
            <option value={undefined}>Show All</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        );
      }
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
        </div>
      );
    }
  }

  const filtersItems = Object.keys(filters).map((key, i) => {
    return (
      <div className="flex" key={i}>
        <label className="flex border-[0.5px] border-r-0 rounded-r-none rounded-md px-3 py-1 w-[8rem] capitalize bg-slate-900">
          {key}
        </label>
        <Input
          className="border-[0.5px] border-l-0 rounded-l-none rounded-md px-3 py-1 w-[10rem] capitalize bg-black text-white"
          type={filters[key].type}
          value={filters[key].value}
          options={filters[key].options}
          onChange={(event) => {
            let newVal =
              event.target.value == "Show All" ? undefined : event.target.value;
            setFilters((prev) => {
              return {
                ...prev,
                [key]: {
                  value: newVal,
                  type: prev[key].type,
                  options: prev[key].options,
                },
              };
            });
          }}
        />
      </div>
    );
  });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between flex-wrap gap-3">
        <form onSubmit={handleSearch} className="w-[20rem] max-md:w-full">
          <input
            placeholder="Search"
            className="rounded-md w-full bg-black border-[0.5px] h-[2rem] p-4 text-white"
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
            ref={searchRef}
          ></input>
        </form>

        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex gap-3  border-[0.5px] rounded-md pr-3 pl-1 py-1"
        >
          <AiFillFilter />
          <span>Filters</span>
          <span className="text-sm bg-purple-500 rounded-full px-[0.4rem]">
            {numOfFilters > 0 && numOfFilters}
          </span>
        </button>

        {showFilters && <ResetFilters />}

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
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 py-10 justify-center">
          {filtersItems}
        </div>
      )}
    </div>
  );
}
