'use client'

import { BiPlus } from "react-icons/bi"
import { useRouter } from "next/navigation";

export default function NewRideBtn({ date }) {
    const router = useRouter()

    return (
        <div className="flex gap-10 items-center p-4">
        <button
          onClick={() => router.push(`db/rides/create?d=${date}`)}
          className="flex w-fit h-fit text-black bg-purple-500 rounded-2xl pr-3 pl-1 gap-2 py-1"
        >
          <BiPlus  />
          NEW Ride
        </button>
  </div>
    )
}