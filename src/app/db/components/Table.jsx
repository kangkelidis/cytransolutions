import Row from "./Row";
import Pagination from "./Pagination";
import Controls from "./Controls";
import { usePathname } from "next/navigation";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

export default function Table({
  titles,
  data,
  type,
  pageNo,
  setPageNo,
  numOfEntries,
  limit,
  setLimit,
  pages,
  ridesInInvoice,
  searchData,
  sortBy,
  setSortBy,
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
  setReload
}) {
  const pathName = usePathname();

  return (
    <div className="h-[calc(100%-80px)]">
      {!ridesInInvoice && (
        <div>
          <h1 className="font-bold text-2xl capitalize">
            {pathName.split("/db/")[1] + " Overview"}
          </h1>
          <div className="mt-3 h-fit">
            <Controls data={searchData} filters={filters} setFilters={setFilters} searchTerm={searchData} setSearchTerm={setSearchTerm}/>
          </div>
        </div>
      )}

      <div className="no-scrollbar overflow-x-scroll mt-4 h-5/6 rounded-md">
        <table className="w-full">
          <thead className="">
            <tr className="border-b-[1px] border-solid">
              {titles.map((title, i) => (
                <th key={i} 
                onClick={() => {
                  if (ridesInInvoice || !Object.values(title)[0] ) return
                  if(Object.values(title) !== null) setSortBy(prev => {
                    return {
                      col: Object.values(title)[0], 
                      rev: !prev.rev
                    }
                  })}}
                className={`text-left px-4 ${ridesInInvoice || !Object.values(title)[0] ? "cursor-default" : "cursor-pointer"} `}>
                  <div className="flex">
                    {Object.keys(title)}
                    {(sortBy.col === Object.values(title)[0] && !ridesInInvoice) ? (sortBy.rev ? <AiFillCaretDown /> :  <AiFillCaretUp />) : ""}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, key) => (
              <Row
                key={key}
                entry={entry}
                type={type}
                border={key !== data.length - 1}
                ridesInInvoice={ridesInInvoice}
                setReload={setReload}
              />
            ))}
          </tbody>
        </table>
      </div>

      {pages && (
        <Pagination
          pageNo={pageNo}
          setPageNo={setPageNo}
          numOfEntries={numOfEntries}
          limit={limit}
          setLimit={setLimit}
          pages={pages}
        />
      )}
    </div>
  );
}
