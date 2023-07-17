import DbPage from "../components/DbPage";

export default function Invoices() {

    const titles = [
        {"Id": "_id"},
        {"Client": "client"},
        {"Date": "date"},
        {"Total": "total"},
        {"Status": "status"},
        {"Notes": "notes"},
        {"Actions": null},
      ];
  return (
    <DbPage page={"invoice"} titles={titles}/>
  );
}
