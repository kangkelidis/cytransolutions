"use client";

import { MdModeEditOutline } from "react-icons/md";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function InvoiceRow({
  _id,
  code,
  clientName,
  status,
  date,
  total,
  notes,
}) {
    console.log(clientName);
  const router = useRouter();

  function handleEdit() {
    router.push(`/db/invoices/id=${_id}`);
  }

  const tdClass = "align-top px-3 pt-1 pb-2 border-b-2";

  return (
    <tr className="bg-gray-800 hover:bg-gray-700">
      <td className={tdClass}>
        <span
          onClick={handleEdit}
          className="font-bold underline cursor-pointer"
        >
          {code}
        </span>
      </td>

      <td className={tdClass}>
        <span className="font-bold">{clientName}</span>
      </td>

      <td className={tdClass}>
        <span className="font-bold">{date}</span>
      </td>
      <td className={tdClass}>
        <span className="font-bold">{total}</span>
      </td>
      <td className={tdClass}>
        <span className="font-bold">{status}</span>
      </td>


      <td className={tdClass}>
        <div className=" text-xs px-2 w-32 h-16">{notes}</div>
      </td>

      <td className={tdClass}>
        <button onClick={handleEdit} className="flex gap-2">
          <MdModeEditOutline />
          Edit
        </button>
        <button className="flex gap-2">
          <BsFillPlusCircleFill />
          Ride
        </button>
      </td>
    </tr>
  );
}
