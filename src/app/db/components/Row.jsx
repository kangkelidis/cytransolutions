import RideRow from "../rides/components/RideRow";
import InvoiceRow from "../invoices/components/InvoiceRow";
import DriverRow from "../drivers/components/DriverRow";
import ClientRow from "../clients/components/ClientRow";

export default function Row({ entry, type, border }) {
  const tdClass = `align-top px-4 pt-2 pb-2 ${border && "border-b-[0.5px]"}`;
  const trClass = "bg-gray-800 hover:bg-gray-700";
  const tdId = "font-bold text-purple-400 cursor-pointer hover:text-white hover:underline whitespace-nowrap"

  switch (type) {
    // RIDE
    case "rides":
      return <RideRow entry={entry} tdClass={tdClass} trClass={trClass} tdId={tdId}/>;
    case "invoices":
        return <InvoiceRow entry={entry} tdClass={tdClass} trClass={trClass} tdId={tdId}/>;
    case "drivers":
        return <DriverRow entry={entry} tdClass={tdClass} trClass={trClass} tdId={tdId}/>;
    case "clients":
        return <ClientRow entry={entry} tdClass={tdClass} trClass={trClass} tdId={tdId}/>;

  }
}
