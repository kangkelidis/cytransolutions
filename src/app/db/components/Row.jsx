import RideRow from "../rides/components/RideRow";
import InvoiceRow from "../invoices/components/InvoiceRow";
import DriverRow from "../drivers/components/DriverRow";
import ClientRow from "../clients/components/ClientRow";

export default function Row({ entry, setEntry, type, border, ridesInInvoice, setReload, selection, setSelection, functions }) {
  const trClass = "bg-gray-800 hover:bg-gray-700 w-full ";
  const tdClass = `align-top px-4 pt-2 pb-2 ${border && "border-b-[1px] border-solid"} h-[10] tracking-tight leading-4 `;
  const tdId = "font-bold text-purple-400 cursor-pointer hover:text-white hover:underline whitespace-nowrap"

  switch (type) {
    // RIDE
    case "ride":
      return <RideRow entry={entry} tdClass={tdClass} trClass={trClass} tdId={tdId} setReload={setReload}/>;
    case "invoice":
        return <InvoiceRow entry={entry} tdClass={tdClass} trClass={trClass} tdId={tdId} setReload={setReload} selection={selection} setSelection={setSelection}/>;
    case "driver":
        return <DriverRow entry={entry} tdClass={tdClass} trClass={trClass} tdId={tdId} setReload={setReload}/>;
    case "client":
        return <ClientRow entry={entry} tdClass={tdClass} trClass={trClass} tdId={tdId} setReload={setReload}/>;
    case "ridesInInvoice":
        return <RideRow entry={entry} invoiceView={ridesInInvoice} tdClass={tdClass} trClass={trClass} tdId={tdId} setReload={setReload}/>;

  }
}
