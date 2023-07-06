import {BiPlus} from "react-icons/bi"
import ReactSearchBox from "react-search-box";


export default function Title({ title, tabs, data }) {
    console.log(data);
    return (
        <div className="m-4">
            <h1 className=" text-2xl font-bold">{title}</h1>

            <div className="bg-gray-900 rounded h-14 w-full">
                {tabs && tabs.map(tab => <p>{tab}</p>)}
            </div>
  
            <div className="my-3 flex justify-between ">
                <button className="flex w-fit h-fit text-black bg-purple-500 rounded-2xl pr-3 pl-1 gap-2 py-1">
                <BiPlus className="self-center" />NEW
                </button>

                <ReactSearchBox
                placeholder="Search" 
                data={data}
                leftIcon={<>🔍</>}
                onSelect={(record) => console.log(record)}
                onChange={(value) => console.log(value)}
                />

            </div>
        </div>
    )
}