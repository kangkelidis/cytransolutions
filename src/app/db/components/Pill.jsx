export default function Pill( {label, value }) {
    return (
        <div className="flex justify-between 
         w-full bg-gray-800 rounded-md ">
            <label className=" w-1/3 pl-2 py-1">
                {label}
            </label>

            <span className="w-2/3 pr-2 py-1 text-right tracking-wide font-bold bg-gray-500 rounded-md">
                {value}
            </span>
        </div>
    )
}