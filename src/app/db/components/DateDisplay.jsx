export default function DateDisplay( props ) {
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const date = new Date(props.date)
    const hour = date.getHours();
    return (
        <div className="flex flex-col text-xs">
            <div className={`flex flex-col w-10 ${hour < 6 || hour > 22 ? "bg-orange-300" : "bg-gray-200"} text-black text-center rounded-md tracking-wide leading-3 mb-1`}>
                <span className="font-bold">{month[date.getMonth()]}</span>
                <span className="text-lg -my-1 font-black">{date.getDate()}</span>
                <span className={`font-medium bg-gray-400 rounded-b-md`}>{date.getFullYear()}</span>
            </div>
                <span className="bg-black w-10 text-center rounded-md">{hour} : {date.getMinutes()}</span>
        </div>
    )
}