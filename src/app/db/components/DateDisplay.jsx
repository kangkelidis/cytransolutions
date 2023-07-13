export default function DateDisplay( props ) {
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const date = new Date(props.date)
    return (
        <div className="flex flex-col">
            <div className="flex flex-col w-12 bg-gray-200 text-black text-center rounded-md text-xs tracking-wide leading-3 mb-1 ">
                <span className="font-bold pt-1">{month[date.getMonth()]}</span>
                <span className="text-lg -my-1 font-black">{date.getDay()}</span>
                <span className="font-medium bg-gray-400 rounded-b-md py-1">{date.getFullYear()}</span>
            </div>
                <span className="bg-black text-sm p-1h w-12 text-center rounded-md">{date.getHours()} : {date.getMinutes()}</span>
        </div>
    )
}