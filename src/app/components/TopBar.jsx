import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { signOut } from "next-auth/react";
import Image from "next/image";


export default function TopBar({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="bg-gray-900 w-screen h-10 sticky flex gap-4 justify-between">
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
      <h1>CYTRANSOLUTIONS</h1>
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
  );
}
