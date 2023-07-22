import { changeSingleStateValue } from "../../../../../utils/utils";
import React from "react";
import { confirmAlert } from "react-confirm-alert";

export default function ChangeStatus({
  invoice,
  setInvoice,
  handleSubmit,
  id,
}) {
  const statusArr = ["open", "closed", "issued", "paid"];
  const [currentStateIndex, setCurrentStateIndex] = React.useState(
    statusArr.indexOf(invoice.status)
  );

  async function handleClick(event) {
    const value = event.target.innerHTML;
    // allow only one step at a time
    const indx = statusArr.indexOf(value);
    if (Math.abs(indx - currentStateIndex) !== 1) return;
    if (currentStateIndex === 0) {
      if (!invoice.date) {
        confirmAlert({
          title: "No date defined",
          message: "Do you want to use today's Date?",
          buttons: [
            {
              label: "Cancel",
              onClick: () => {},
            },
            {
              label: "Yes, use today's date.",
              onClick: async () => {
                changeSingleStateValue(setInvoice, "status", "closed");
                changeSingleStateValue(setInvoice, "date", new Date());
                await fetch(`/api/invoice?id=${invoice._id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    ...invoice,
                    status: "closed",
                    date: new Date(),
                  }),
                });
              },
            },
          ],
        });
      }
    }
    let date = invoice.date;
    if (currentStateIndex === 1 && value === "open") {
      changeSingleStateValue(setInvoice, "date", null);
      date = null;
    }


    setCurrentStateIndex(indx);
    changeSingleStateValue(setInvoice, "status", value);
    await handleSubmit(event, id, value, date);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 capitalize">
        {statusArr.map((item, indx) => (
          <div
            onClick={async (event) => await handleClick(event)}
            className={` rounded-lg p-2 w-16 text-center text-sm 
                ${
                  Math.abs(indx - currentStateIndex) === 1
                    ? "!bg-purple-400 hover:!bg-opacity-100 !bg-opacity-40 !opacity-100 cursor-pointer"
                    : ""
                }
                ${
                  indx === currentStateIndex
                    ? `cursor-default 
                    ${
                      item === "open"
                        ? "bg-open"
                        : item === "closed"
                        ? "bg-closed"
                        : item === "issued"
                        ? "bg-issued"
                        : "bg-paid"
                    }`
                    : "bg-gray-500 opacity-50 cursor-not-allowed"
                }
                `}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {statusArr.map((_, i) => {
          if (i <= currentStateIndex)
            return <div className="w-16 h-[0.1rem] bg-white"></div>;
        })}
      </div>
    </div>
  );
}
