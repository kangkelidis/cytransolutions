import Row from "./Row";
import Pagination from "./Pagination";
import Controls from "./Controls";

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
}) {
  return (
    <div className="">

    <div className="mt-2 mb-6">
      <Controls />
    </div>

    <div className="no-scrollbar overflow-x-scroll">
      <table className="w-full">
        <thead>
          <tr className="border-b-[0.5px]">
            {titles.map((title, i) => (
              <th key={i} className="text-left px-4 ">
                {title}
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

      <Pagination
        pageNo={pageNo}
        setPageNo={setPageNo}
        numOfEntries={numOfEntries}
        limit={limit}
        setLimit={setLimit}
        pages={pages}
      />
    </div>
  );
}
