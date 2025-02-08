"use client";

import { MdModeEditOutline } from "react-icons/md";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import DateDisplay from "../../components/DateDisplay";
import StatusBox from "../../components/StatusBox";
import { toCurrency } from "../../../../../utils/utils";
import { savePDF } from "../../../../../utils/savePDF"

export default function InvoiceRow({
  entry: { _id, code, client, status, date, inv_total, total, notes },
  tdClass,
  trClass,
  tdId,
  selection,
  setSelection,
}) {
  const router = useRouter();

  function handleEdit() {
    router.push(`/db/invoices/id=${_id}`);
  }

  function handleSelectionClicked() {
      const indx = selection.indexOf(_id)
      if (indx === -1) {
        setSelection(prev => {
          return [
            ...prev,
            _id
          ]
        })
      } else {
        let newSelection = selection.slice()
        newSelection.splice(indx, 1)
        setSelection(newSelection)
      }

  }

  return (
    <tr className={trClass + `${selection.indexOf(_id) !== -1 && "bg-purple-800 hover:bg-purple-700 "}`}>
      <td className={tdClass}>
        <input 
        type="checkbox"
        checked={selection.indexOf(_id) !== -1}
        onChange={handleSelectionClicked}
/>
      </td>

      <td className={tdClass}>
        <span onClick={handleEdit} className={tdId}>
          {code}
        </span>
      </td>

      <td className={tdClass}>
        <span className="font-bold">{client?.name}</span>
      </td>

      <td className={tdClass}>{date ? <DateDisplay date={date} /> : "-"}</td>
      <td className={tdClass}>
        <span className="font-bold">{inv_total ? toCurrency(inv_total) : toCurrency(total)}</span>
      </td>
      <td className={tdClass}>
        <StatusBox status={status} />
      </td>

      <td className={tdClass}>{notes}</td>

      <td className={tdClass}>
        <button onClick={handleEdit} className="flex gap-2">
          <MdModeEditOutline />
          Edit
        </button>
        <button 
        onClick={() => {
          savePDF(_id)
          router.refresh()
        }}
        className="flex gap-2">
          <BsFillPlusCircleFill />
          Save PDF
        </button>
        <button className="flex gap-2">
          <BsFillPlusCircleFill />
          Send Email
        </button>
      </td>
    </tr>
  );
}
