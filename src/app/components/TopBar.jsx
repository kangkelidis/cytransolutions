import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

export default function TopBar({ sidebarOpen, setSidebarOpen }) {
    return (
        <div className="bg-gray-900 w-screen h-10 sticky">

        <button className="m-2"
        onClick={() => setSidebarOpen((prev) => !prev)}>
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
      </div>
    )
}