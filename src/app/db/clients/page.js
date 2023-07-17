import DbPage from "../components/DbPage";

export default function Clients() {

  const titles = [
    {"Id": "_id" },
    {"Name": "name"},
    {"Address": "address"},
    {"Contact": null},
    // TODO: add this to client?
    {"Charges": null},
    {"Notes": "notes"},
    {"Actions": null},
  ];
  return (
    <DbPage page={"client"} titles={titles}/>
  );
}
