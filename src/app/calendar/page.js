import ResizableDiv from "./components/ResizableDiv";
import NewRideBtn from "../components/NewRideBtn";
import DatePicker from "./components/DatePicker";
import RidesPerDriver from "./components/RidesPerDriver";

const RideApi = await import("@/pages/api/ride");

export const revalidate = 0

export default async function Calendar({ searchParams }) {
  var dateToDisplay = searchParams?.d
  async function fetchResults() {
    const response = await RideApi.getTodaysRidesInfo(dateToDisplay);
    return JSON.parse(response);
  }


  const results = await fetchResults();
  results.forEach((res) => {
      res.color =  res.driver.color
      res.driver = res.driver.name;
      if (res.client) res.client = res.client.name;
  });

  const groupedByDriver = results.reduce((acc, obj) => {
    let key = obj.driver;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});

  function CalendarBoard() {
    const now = new Date();
    const displayedDate = new Date(dateToDisplay)
    const showRedLine = now.getFullYear() === displayedDate.getFullYear() && now.getMonth() === displayedDate.getMonth() && now.getDate() === displayedDate.getDate()
    return (
      <div className="z-0 absolute flex flex-col text-xs gap-0 w-[calc(100%-16px)] pr-4 -mt-[30px] pb-[60px]">        
        {new Array(24).fill().map((_, i) => {
          return (
            <div className="flex items-end gap-2 h-[60px] select-none">
              <h4 className="inline -mb-[0.4rem]">
                {String(i).padStart(2, "0")}:00
              </h4>
              <hr className="inline-block w-full border-gray-500 border-dotted" />
            </div>
          );
        })}
        <div hidden={!showRedLine}>
          <h4
            className="absolute -mt-[0.4rem] text-red-400 font-bold bg-slate-800 px-[0.5px] rounded-sm"
            style={{ top: now.getUTCHours() * 60  + now.getMinutes()  +240}}
          >
            {now.toLocaleTimeString("en-UK", {timeZone: "Europe/Athens" , timeStyle: "short" })}
          </h4>
          <hr
            className="border-solid border-red-500 border-2 absolute w-[calc(100%-50px)]"
            style={{ top: now.getUTCHours() * 60  + now.getMinutes()  +240, left: 35 }}
          ></hr>
        </div>
      </div>
    );
  }

  return (
    <main>
      <h1>Calendar</h1>
        <NewRideBtn date={dateToDisplay} />
        <DatePicker />
      <div className="bg-gray-600 h-[calc(100%-150px)] w-[calc(100%-10%)] p-4 absolute overflow-scroll no-scrollbar rounded-lg shadow-lg m-5 ">
        <CalendarBoard />

          <RidesPerDriver  groupedByDriver={groupedByDriver}/>

      </div>
    </main>
  );
}
