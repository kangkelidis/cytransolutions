"use client";

import React from "react";
import Table from "./Table";
import { useSession } from "next-auth/react";

export default function DbPAge({ page, titles, filters, setFilters, sortBy, setSortBy }) {
  const [dbData, setDbData] = React.useState([]);
  const [numOfEntries, setNumOfEntries] = React.useState(0);
  const [pageNo, setPageNo] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [pages, setPages] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [reload, setReload] = React.useState(false);
  const [selection, setSelection] = React.useState([]);
  const { data: session } = useSession();

  let diverName;
  React.useEffect(() => {
    setIsLoading(true);
    if (!session) return;
    const role = session.user.role;
    diverName = role === "driver" ? session.user.name : "";

    fetchData();
  }, [sortBy, pageNo, limit, filters, searchTerm, reload, session]);

  function buildQuery() {
    let query = "";
    query += Object.keys(filters)
      .filter((key) => filters[key].value !== undefined)
      .map((key) => `&${key}=${filters[key].value}`);
    query = query.replaceAll(",", "");
    return query;
  }

  async function fetchData() {
    let f = buildQuery();
    const response = await fetch(
      `/api/${page}?page=${pageNo}&limit=${limit}&sort=${sortBy.col}&rev=${sortBy.rev}&term=${searchTerm}&driver=${diverName}` +
        f,
      {
        method: "GET",
      }
    );
    const data = await response.json();

    setDbData(data.body.data);
    setNumOfEntries(data.body.total);
    findAndSetPages(data.body.total);

    setIsLoading(false);
  }

  function findAndSetPages(total) {
    const arr = Array(Math.ceil(total / limit));
    for (let index = 0; index < arr.length; index++) {
      arr[index] = index + 1;
    }
    setPages(arr);
  }

  const restrictedPages = ["invoice", "driver"];
  return (
    <>
      {session &&
      session.user.role === "driver" &&
      restrictedPages.indexOf(page) !== -1 ? (
        <></>
      ) : (
        <Table
          titles={titles}
          data={dbData}
          type={page}
          setSortBy={setSortBy}
          sortBy={sortBy}
          pageNo={pageNo}
          setPageNo={setPageNo}
          limit={limit}
          pages={pages}
          numOfEntries={numOfEntries}
          setLimit={setLimit}
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setReload={setReload}
          isLoading={isLoading}
          selection={selection}
          setSelection={setSelection}
          dbData={dbData}
        />
      )}
    </>
  );
}
