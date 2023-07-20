import Select from "react-select";

export default function InvoiceStatusFilter({setFilters}) {
    
  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#000000",
      color: "white",
      borderColor: "#757575",
      borderWidth: "0.1px",
    }),
    input: (baseStyles, state) => ({
      ...baseStyles,
      color: "white",
    }),
    singleValue: (baseStyles, state) => ({
      ...baseStyles,
      color: "white",
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#202937",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? "#9C27B0" : "#202937",
      "&:hover": {
        backgroundColor: "#4a5568",
      },
    }),
  };
    function handleChange(values) {
        console.log(values);
    }
    // setFilters(prev => {
    //     return {
    //     ...prev,
    //     status: {value: undefined, type: "select", options: ["open", "closed", "paid", "issued"]},
    // }})

    return (
        <div className="flex">
        <label className="flex border-[0.5px] border-r-0 rounded-r-none rounded-md px-3 py-1 w-[8rem] capitalize bg-slate-900"
              htmlFor="status"
            >
              Client
            </label>
            <Select 
            id="status"
            styles={selectStyles}
            isMulti
            options={[
                {value: "open", label: "open"},
                {value: "closed", label: "closed"},
                {value: "issued", label: "issued"},
                {value: "paid", label: "paid"},
            ]}
            onChange={(newVals) => handleChange(newVals)}
            />
        </div>
    )
}