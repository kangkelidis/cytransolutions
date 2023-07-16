import Row from "./Row";
import Pagination from "./Pagination";
import Controls from "./Controls";
import { usePathname } from "next/navigation";

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
  noTitle,
  searchData,
  sortBy,
  setSortBy,
}) {
  const pathName = usePathname();

  return (
    <div className="h-[calc(100%-80px)]">
      {!noTitle && (
        <div>
          <h1 className="font-bold text-2xl capitalize">
            {pathName.split("/db/")[1] + " Overview"}
          </h1>
          <div className="mt-3 h-20">
            <Controls data={searchData}/>
          </div>
        </div>
      )}

      <div className="no-scrollbar overflow-x-scroll h-5/6 rounded-md">
        <table className="w-full">
          <thead className="">
            <tr className="border-b-[0.5px]">
              {titles.map((title, i) => (
                <th key={i} 
                onClick={() => {
                  if(Object.values(title) !== null) setSortBy(Object.values(title))}}
                className="text-left px-4 cursor-pointer">
                  {Object.keys(title)}
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
