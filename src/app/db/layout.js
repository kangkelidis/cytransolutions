"use client";

import { createContext, useState } from "react";

export const FiltersContext = createContext();



export default function DatabaseLayout({ children }) {
  const [filters_inv, setFilters_inv] = useState({
    from: { value: undefined, type: "date" },
    till: { value: undefined, type: "date" },
    invoice: { value: "true", type: "hidden" },
    inv_status: { value: ["open"], type: "hidden" },
  });
  
  const [filters_ride, setFilters_ride] = useState({
    from: {value: undefined, type: "date"},
    till: {value: undefined, type: "date"},
    client: {value: undefined, type: "select"},
    cash: {value: undefined, type: "select"},
    credit: {value: undefined, type: "select"},
    invoice: {value: undefined, type: "select"},
    inv_status: {value: ["open"], type: "hidden"}
  });

  const [filters_dri, setFilters_dri] = useState({

  });
  const [filters_cli, setFilters_cli] = useState({

  });
  
  const [sortBy_ride, setSortBy_ride] = useState({ col: "date", rev: true });
  const [sortBy_inv, setSortBy_inv] = useState({ col: "_id", rev: false });
  const [sortBy_dri, setSortBy_dri] = useState({ col: "_id", rev: false });
  const [sortBy_cli, setSortBy_cli] = useState({ col: "_id", rev: false });

  return (
    <main className="w-full h-full ">
      <div className="bg-black rounded-md p-8 m-5 shadow-lg h-fit max-md:p-3 max-md:m-0">
        <FiltersContext.Provider value={{ filters_inv, setFilters_inv, filters_ride, setFilters_ride, filters_dri, filters_cli, setFilters_cli, setFilters_dri, sortBy_ride, setSortBy_ride, sortBy_inv, setSortBy_inv, sortBy_dri, setSortBy_dri, sortBy_cli, setSortBy_cli }}>
          {children}
        </FiltersContext.Provider>
      </div>
    </main>
  );
}
