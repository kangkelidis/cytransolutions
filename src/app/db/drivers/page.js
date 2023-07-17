import DbPage from "../components/DbPage";

export default function Drivers() {
    const titles = [
        {"Id": "_id"},
        {"Name": "name"},
        {"Address": "address"},
        {"Contact": "tel"},
        {"Charges": null},
        {"Notes": "notes"},
        {"Actions": null},
      ];
  return (
    <DbPage page={"driver"} titles={titles}/>

  );
}
