"use client";

import { useRouter, usePathname } from "next/navigation";
import { BiPlus } from "react-icons/bi";

export default function Controls() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      {!pathname.includes("invoice") && (
        <button
          onClick={() => router.push(pathname + "/create")}
          className="flex w-fit h-fit text-black bg-purple-500 rounded-2xl pr-3 pl-1 gap-2 py-1"
        >
          <BiPlus className="self-center" />
          NEW
        </button>
      )}
    </div>
  );
}
