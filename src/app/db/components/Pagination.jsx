"use client";

import React from "react";

export default function Pagination({
  pageNo,
  setPageNo,
  numOfEntries,
  limit,
  setLimit,
  pages,
}) {
  const maxPageTabs = 5;
  const [firstPageTab, setFirstPageTab] = React.useState(0);
  const [lastPageTab, setLastPageTab] = React.useState(maxPageTabs);

  return (
    <div className="flex max-md:flex-col max-md:gap-3 p-2 mt-4 justify-between ">
      <div className="flex max-h-7 ">
        <a
          onClick={() => {
            if (pageNo === 0) return;
            setFirstPageTab((prev) =>
              pageNo - 1 < firstPageTab ? prev - maxPageTabs : prev
            );
            setLastPageTab((prev) =>
              pageNo - 1 < firstPageTab ? prev - maxPageTabs : prev
            );
            setPageNo((prev) => prev - 1);
          }}
          className={`px-2 text-center rounded-md transition-colors duration-300 transform
        ${
          pageNo == 0
            ? "cursor-not-allowed text-gray-500"
            : "cursor-pointer bg-white text-black hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
        }
    `}
        >
          {"<"}
        </a>

        {pages.slice(firstPageTab, lastPageTab).map((i) => {
          return (
            <a
              key={i}
              onClick={() => setPageNo(i - 1)}
              className={`${
                i - 1 === pageNo
                  ? "bg-blue-600 dark:bg-blue-500"
                  : "hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
              } dark:text-white inline-flex items-center justify-center px-4 py-1 text-gray-700 transition-colors duration-300 transform rounded-lg`}
            >
              {i}
            </a>
          );
        })}

        <a
          onClick={() => {
            if (pageNo === pages.length - 1) return;
            setFirstPageTab((prev) =>
              pageNo + 2 > lastPageTab ? prev + maxPageTabs : prev
            );
            setLastPageTab((prev) =>
              pageNo + 2 > lastPageTab ? prev + maxPageTabs : prev
            );
            setPageNo((prev) => prev + 1);
          }}
          className={`px-2 text-center rounded-md transition-colors duration-300 transform
        ${
          pageNo == pages.length - 1
            ? "cursor-not-allowed text-gray-500"
            : "cursor-pointer bg-white text-black hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200"
        }
    `}
        >
          {">"}
        </a>
      </div>

      <div className="flex flex-row gap-4">
        <div>
          <select
            onChange={(e) => setLimit(e.target.value)}
            className="text-black p-1 rounded-md text-xxs"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <span className="text-gray-500 dark:text-gray-400">
          Showing {pageNo * limit + 1} -{" "}
          {Math.min(numOfEntries, pageNo * limit + limit)} of {numOfEntries}{" "}
          records
        </span>
      </div>
    </div>
  );
}
