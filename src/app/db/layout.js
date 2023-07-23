'use client'

import { createContext, useContext, useState } from 'react';

export const FiltersContext = createContext();

export default function DatabaseLayout({ children }) {
  const [filters, setFilters] = useState({
    from: { value: undefined, type: "date" },
    till: { value: undefined, type: "date" },
    invoice: { value: "true", type: "hidden" },
    inv_status: { value: ["open"], type: "hidden" },
  });


  return (
    <main className="w-full h-full ">
      <div
        className="bg-black rounded-md p-8 m-5 shadow-lg h-fit max-md:p-3 max-md:m-0"
      >
        <FiltersContext.Provider value={{ filters, setFilters }}>

        {children}
        </FiltersContext.Provider>
      </div>
    </main>
  );
}
