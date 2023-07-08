'use client'

import { MdModeEditOutline } from "react-icons/md";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

export default function DriverRow({
  id,
  _id,
  name,
  address,
  tel,
  email,
  invoice,
  total,
  notes,
}) {

  const router = useRouter();

  function handleEdit() {
    router.push(`/db/drivers/id=${_id}`)
  }

  const tdClass = "align-top px-3 pt-1 pb-2 border-b-2"

  return (
    <tr className="bg-gray-800 hover:bg-gray-700">
      <td className={tdClass}>
        <span onClick={handleEdit} className="font-bold underline cursor-pointer">{id}</span>
      </td>

      <td className={tdClass}>
        <span className="font-bold">{name}</span>
      </td>

      <td className={tdClass}>
        <span>{address}</span>
      </td>

      <td className={tdClass}>
        <div className="flex flex-col">
          <small className="text-xs">Tel</small>
          <span>{tel}</span>
        </div>
        <div className="flex flex-col">
          <small className="text-xs">Email</small>
          <span>{email}</span>
        </div>
      </td>

      <td className={tdClass}>
        <div className="flex flex-col">
          <small className="text-xs w-24">Open Invoice</small>
          <span className=" bg-green-400 bg-opacity-50 rounded-md text-center text-black font-bold">
            {invoice}98
          </span>
        </div>
        <div className="flex flex-col">
          <small className="text-xs w-24">Total</small>
          <span className=" bg-emerald-800 bg-opacity-50 rounded-md text-center text-black font-bold">
            {total}78
          </span>
        </div>
      </td>

      <td className={tdClass}>
        <div className=" text-xs px-2 w-32 h-16">
          {notes}
        </div>
      </td>

      <td className={tdClass}>
        <button 
        onClick={handleEdit}
        className="flex gap-2">
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
