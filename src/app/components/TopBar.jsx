import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function TopBar({ sidebarOpen, setSidebarOpen }) {
  const { data: session } = useSession();

  return (
    <div className="bg-gray-900 w-[calc(100%)] h-[50px] sticky flex justify-between ">
      <div
        className={`flex flex-row ${sidebarOpen ? "gap-[7.2rem]" : "gap-5"}`}
      >
        <button className="m-2" onClick={() => setSidebarOpen((prev) => !prev)}>
          {sidebarOpen ? (
            <MdClose style={{ width: "32px", height: "32px" }} />
          ) : (
            <FiMenu
              style={{
                width: "32px",
                height: "32px",
              }}
            />
          )}
        </button>
        <h1 className="text-xl font-bold p-4 max-md:hidden">CYTRANSOLUTIONS</h1>
      </div>

      <div className="flex flex-row">
        <div className="h-full">
          <h4 className=" py-4">{session && session.user.name}</h4>
        </div>
        <div className=" mt-auto mb-5 cursor-pointer w-[10rem]">
          <a
            className={`flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`}
            onClick={(evt) => {
              evt.preventDefault();
              signOut();
            }}
          >
            <Image
              src={"/icons/logout.svg"}
              width={24}
              height={24}
              alt={"logout-icon"}
            />

            <span className={`ml-2 text-sm font-medium capitalize`}>
              Logout
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
