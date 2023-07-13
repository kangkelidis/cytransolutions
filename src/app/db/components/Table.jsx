import Row from "./Row"

export default function Table({ titles, data, type }) {
  return (
    <table>
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
          <Row key={key} entry={entry} type={type} border={key !== data.length -1} />
        ))}
      </tbody>
    </table>
  );
}
