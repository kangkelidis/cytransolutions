"use client";

import React from "react";
import { toCurrency } from "../../../../utils/utils";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function ResizableDiv({ rideInfo }) {
  const router = useRouter();
  const date = new Date(rideInfo.date);

  const [height, setHeight] = React.useState(
    rideInfo.duration ? rideInfo.duration : 60
  );
  const [position, setPosition] = React.useState(
    date.getHours() * 60 + date.getMinutes()
  );
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [editable, setEditable] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const [user, setUser] = React.useState();

  async function fetchUser() {
    const session = await getSession();
    setUser(session.user);
  }
  React.useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  function handleResize(mouseDownEvent) {
    if (!editable) return;
    const startHeight = height;
    const startPosition = mouseDownEvent.pageY;

    function onMouseMove(mouseMoveEvent) {
      let newY = startHeight - startPosition + mouseMoveEvent.pageY;
      newY = Math.round(newY / 5) * 5;
      newY < 10 ? (newY = 10) : newY;
      newY + position > 1380 ? (newY = 1380 - position) : newY;

      setHeight(newY);
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
    }
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  }

  function handleMove(mouseDownEvent) {
    if (!editable) return;
    const startPosition = position;
    const startMousePos = mouseDownEvent.pageY;

    function onMouseMove(mouseMoveEvent) {
      let newPosition = startPosition - startMousePos + mouseMoveEvent.pageY;
      newPosition = Math.round(newPosition / 5) * 5;
      newPosition < 0 ? (newPosition = 0) : newPosition;
      newPosition + height > 1380 ? (newPosition = 1380 - height) : newPosition;
      setPosition(newPosition);
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
    }
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  }

  function handleClick(e) {
    e.preventDefault();
    if (user.role === "driver" && rideInfo.driver !== user.name) {
      alert("Not your ride. Cannot edit.")
      return
    }
    setShowEditDialog((prev) => !prev);
  }

  async function updateDB(data) {
    await fetch(`/api/ride?id=${rideInfo._id}`, {
      method: "PUT",
      body: JSON.stringify({ ...data }),
    });
  }

  function EditDialog() {
    return (
      <div
        className="absolute z-50 bg-gray-500 flex flex-col w-[100px] justify-between rounded-b-lg p-1 text-sm"
        style={{ top: position + height + 4 }}
      >
        {!editable ? (
          <button
            className={`border-[0.5px] px-2 rounded-md bg-slate-700 hover:bg-purple-500}`}
            onClick={() => {
              if (user.role === "driver" && rideInfo.driver !== user.name) {
                alert("Not your ride. Cannot edit.")
                return
              }
              if (rideInfo.invoice && rideInfo.invoice.status != "open") {
                console.log(rideInfo);
                alert("Invoice is not OPEN")
                return
              } 
              setEditable(true)}
            }
              >
            Edit
          </button>
        ) : (
          <button
            className="border-[0.5px] px-2 rounded-md bg-slate-700 hover:bg-purple-500"
            onClick={() => {
              setEditable(false);
              setShowEditDialog(false);
              const fromDate = new Date();
              fromDate.setHours(position / 60);
              fromDate.setMinutes(position % 60);
              updateDB({ date: fromDate, duration: height });
            }}
          >
            OK
          </button>
        )}
        <button
          className="border-[0.5px] px-2 rounded-md bg-slate-700 hover:bg-purple-500"
          onClick={() => router.push("/db/rides/id=" + rideInfo._id)}
        >
          View
        </button>
        <button
          className="border-[0.5px] px-2 rounded-md bg-slate-700 hover:bg-red-500"
          onClick={() => {
            setEditable(false);
            setShowEditDialog(false);
            setHeight(rideInfo.duration ? rideInfo.duration : 60);
            setPosition(date.getHours() * 60 + date.getMinutes());
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  const tempDate = new Date(rideInfo.date);
  tempDate.setHours(position / 60);
  tempDate.setMinutes(position % 60);

  return (
    <>

    <div
      className=""
      onContextMenu={handleClick}
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <div
        className=" text-sm absolute bg-slate-900 rounded-t-lg w-[100px] pl-2 "
        style={{ top: position - 20 }}
      >
        {rideInfo &&
          tempDate.toLocaleTimeString("en-UK", {
            timeStyle: "short",
          })}
      </div>

      <div
        className="flex flex-col absolute"
        style={{ top: position }}
        onMouseDown={handleMove}
      >
        <div
          className={`bg-black w-[100px] bg-opacity-50 flex text-xxs flex-col justify-between text-center gap-1 
          overflow-scroll no-scrollbar select-none rounded-b-md ${
            editable ? "cursor-move" : "cursor-help"
          }
            ${editable && "!border-[5px] !border-green-600 !border-solid "}
           ${(rideInfo.invoice && rideInfo.invoice.status != "open" ||
           (user.role === "driver" && rideInfo.driver !== user.name))  ? "hover:!border-red-500 opacity-70 hover:border-[3px] !border-solid" : "hover:border-blue-600 hover:border-[3px] border-dashed"}`}
          style={{ height: height, backgroundColor: rideInfo.color }}
        >
          <span>{rideInfo && rideInfo.from}</span>

          {showInfo && !(user.role === "driver" && rideInfo.driver !== user.name) && (
            <div className="absolute z-50 left-[100px] bg-black rounded-md px-2 flex flex-col">
              <span className="  ">{rideInfo && rideInfo.driver}</span>
              <span>
                {String(Math.floor(height / 60)) + "h" + (height % 60) + "m"}
              </span>
              <span>{toCurrency(rideInfo.total, true)}</span>
            </div>
          )}
          <span>{rideInfo && rideInfo.client}</span>

          <span>{rideInfo && rideInfo.to}</span>
        </div>
      </div>

      {editable && (
        <button
          className="bg-white w-[100px] h-1 absolute z-40  cursor-ns-resize"
          style={{ top: position + height }}
          onMouseDown={handleResize}
        ></button>
      )}

      {showEditDialog && <EditDialog />}
    </div>
    </>
  );
}
