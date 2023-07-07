import { MdModeEditOutline } from "react-icons/md";
import { BsFillPlusCircleFill } from "react-icons/bs";

export default function Card({
  id,
  name,
  address,
  tel,
  email,
  invoice,
  total,
  notes,
}) {
  return (
    <div className="flex gap-4 items-center justify-around w-full min-w-min h-fit bg-gray-800 my-1 mx-6 p-2">
      <div className="flex flex-col w-1/2 px-2 ">
        <small className="text-xs">Client</small>
        <span className="font-bold">{name}</span>
      </div>

      <div className="flex flex-col w-1/2 px-2 ">
        <small className="text-xs">Address</small>
        <span>{address}</span>
      </div>

      <div>
        <div className="flex flex-col">
          <small className="text-xs">Tel</small>
          <span>+35799717117</span>
        </div>
        <div className="flex flex-col">
          <small className="text-xs">Email</small>
          <span>{email}</span>
        </div>
      </div>

      <div className="flex flex-col w-2/5 px-2">
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
      </div>

      <div className="flex flex-col w-3/5 px-2">
        <div className="bg-white text-black text-xs px-2 rounded w-32 h-16">
          Notes:
          {notes}
        </div>
      </div>
      <div className="flex flex-col text-sm gap-2 w-2/5 px-2">
        <button className="flex gap-2">
          <MdModeEditOutline />
          Edit
        </button>
        <button className="flex gap-2">
          <BsFillPlusCircleFill />
          Ride
        </button>
      </div>
    </div>
  );
}
