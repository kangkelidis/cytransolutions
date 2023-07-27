"use client";

import { useRouter, usePathname } from "next/navigation";
import { BiPlus } from "react-icons/bi";
import { AiFillFilter } from "react-icons/ai";
import React from "react";
import InvoiceStatusFilter from "./InvoiceStatusFilter";
import { savePDF } from "../../../../utils/savePDF";
export default function Controls({
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
  selection,
  setSelection,
  dbData,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const modelName = pathname.split("/db/")[1].slice(0, -1);

  const [showFilters, setShowFilters] = React.useState(false);
  const [numOfFilters, setNumOfFilters] = React.useState(0);
  const [selectedDateRange, setSelectedDateRange] = React.useState();

  const [showSavePdfsInfo, setSavePdfsInfo] = React.useState(false);

  const searchRef = React.useRef();

  async function handleSearch(event) {
    event.preventDefault();
    const res = await fetch(
      `/api/${modelName}?query=${event.target.children[0].value}`
    );
  }

  React.useEffect(() => {
    setNumOfFilters(
      Object.values(filters).reduce((acc, val) => {
        if (val.value !== undefined && val.type !== "hidden") return acc + 1;
        return acc;
      }, 0)
    );
  }, [filters]);

  function handleResetFilters() {
    setFilters((prev) => {
      return Object.keys(prev).reduce((acc, key) => {
        acc[key] = {
          value: prev[key].type === "hidden" ? prev[key].value : undefined,
          type: prev[key].type,
        };
        return acc;
      }, {});
    });
    setSearchTerm(undefined);
    searchRef.current.value = null;
    setSelectedDateRange(null);
  }

  function ResetFilters() {
    return (
      <button
        onClick={handleResetFilters}
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
          <select
            multiple
            value={value}
            onChange={onChange}
            className={className}
          >
            {options.map((option) => (
              <option value={option}>{option}</option>
            ))}
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

  let filtersItems = Object.keys(filters).map((key, i) => {
    if (key === "inv_status") return null;
    if (filters[key].type === "hidden") return;
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

  function DateControls() {
    const today = new Date();
    today.setHours(0,0,0,0)
    const tomorrow = new Date();
    tomorrow.setHours(23,59,59,999)
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    startOfWeek.setHours(0,0,0,0)
    const endOfWeek = new Date();
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(23,59,59,999)
    const startOfMOnth = new Date();
    startOfMOnth.setDate(1);
    startOfWeek.setHours(0,0,0,0)
    const endOfMonth = new Date();
    endOfMonth.setDate(31);
    endOfWeek.setHours(23,59,59,999)

    return (
      <div className="flex gap-3">
        <button
          className={`bg-blue-900 px-4 py-2 rounded-lg ${
            selectedDateRange === "day" ? "!bg-purple-500" : ""
          }`}
          onClick={() => {
            if (selectedDateRange === "day") {
              handleResetFilters();
              return;
            }
            setSelectedDateRange("day");
            setFilters((prev) => {
              return {
                ...prev,
                from: { value: today, type: "date" },
                till: { value: tomorrow, type: "date" },
              };
            });
          }}
        >
          Today
        </button>
        <button
          className={`bg-blue-900 px-4 py-2 rounded-lg ${
            selectedDateRange === "week" ? "!bg-purple-500" : ""
          }`}
          onClick={() => {
            if (selectedDateRange === "week") {
              handleResetFilters();
              return;
            }
            setSelectedDateRange("week");
            setFilters((prev) => {
              return {
                ...prev,
                from: { value: startOfWeek.toLocaleDateString(), type: "date" },
                till: { value: endOfWeek.toLocaleDateString(), type: "date" },
              };
            });
          }}
        >
          Week
        </button>
        <button
          onClick={() => {
            if (selectedDateRange === "month") {
              handleResetFilters();
              return;
            }
            setSelectedDateRange("month");
            setFilters((prev) => {
              return {
                ...prev,
                from: {
                  value: startOfMOnth,
                  type: "date",
                },
                till: { value: endOfMonth, type: "date" },
              };
            });
          }}
          className={`bg-blue-900 px-4 py-2 rounded-lg ${
            selectedDateRange === "month" ? "!bg-purple-500" : ""
          }`}
        >
          Month
        </button>
      </div>
    );
  }

  function SelectToggle() {
    return (
      <div>
        <button
          className={`flex gap-3 border-[0.5px] rounded-md pr-3 pl-1 py-1 w-[7rem] ${
            selection.length !== 0 && ""
          }`}
          onClick={() => {
            const ids = dbData.map((data) => data._id);
            selection.length === 0 ? setSelection(ids) : setSelection([]);
          }}
        >
          {selection.length === 0 ? "Select All" : "Deselect All"}
        </button>
        {selection.length > 0 && (
          <div
            onMouseEnter={() => setSavePdfsInfo(true)}
            onMouseLeave={() => setSavePdfsInfo(false)}
          >
            <button
              className={`border-[0.5px] rounded-md px-3 py-1 w-[7rem]`}
              onClick={() => {
                selection.map((sel) => {
                  savePDF(sel, true);
                });
              }}
            >
              Save PDFs
            </button>
            <div
              className={`${!showSavePdfsInfo && "hidden"} w-[9rem] absolute bg-purple-500 rounded-md text-center`}
            >
              Save PDFs for selected invoices. Closes all open invoices, with
              todays date.
            </div>
          </div>
        )}
      </div>
    );
  }

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

        <div className="flex">
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

          <ResetFilters />
        </div>

        {(pathname.includes("rides") || pathname.includes("drivers") || pathname.includes("clients")) && (
          <div className="flex gap-10">
            <button
              onClick={() => router.push(pathname + "/create")}
              className="flex w-fit h-fit text-black bg-purple-500 rounded-2xl pr-3 pl-1 gap-2 py-1"
            >
              <BiPlus className="self-center" />
              NEW
            </button>
            {pathname.includes("rides") &&
            <DateControls />
            }
          </div>
        ) }
        
        { pathname.includes("invoices") && (
          <SelectToggle />
        )}
      </div>
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 py-10 justify-center">
          {filtersItems}
          {(pathname.includes("invoices") || pathname.includes("rides")) && <InvoiceStatusFilter filters={filters} setFilters={setFilters} />}
        </div>
      )}
    </div>
  );
}
