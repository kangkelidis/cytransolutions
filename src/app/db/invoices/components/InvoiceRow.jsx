"use client";

import { MdModeEditOutline } from "react-icons/md";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import DateDisplay from "../../components/DateDisplay";
import StatusBox from "../../components/StatusBox";
import {  toCurrency } from "../../../../../utils/utils";


export default function InvoiceRow({
  entry: {
    _id,
    code,
    client: { name: clientName },
    status,
    date,
    total,
    notes,
  },
  tdClass,
  trClass,
  tdId,
}) {
  const router = useRouter();

  function handleEdit() {
    router.push(`/db/invoices/id=${_id}`);
  }

  return (
    <tr className={trClass}>
      <td className={tdClass}>
        <span onClick={handleEdit} className={tdId}>
          {code}
        </span>
      </td>

      <td className={tdClass}>
        <span className="font-bold">{clientName}</span>
      </td>

      <td className={tdClass}>
        {date ? <DateDisplay date={date} /> : "-"}
      </td>
      <td className={tdClass}>
        <span className="font-bold">{toCurrency(total)}</span>
      </td>
      <td className={tdClass}>
        <StatusBox status={status}/>
      </td>

      <td className={tdClass}>{notes}</td>

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
