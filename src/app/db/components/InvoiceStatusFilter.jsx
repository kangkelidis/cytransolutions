import Select from "react-select";
import React from "react";

export default function InvoiceStatusFilter({ filters, setFilters}) {
  
  const options = [
    {value: "open", label: "open"},
    {value: "closed", label: "closed"},
    {value: "issued", label: "issued"},
    {value: "paid", label: "paid"},
]

  const [selectedOptions, setSelectedOptions] = React.useState(findSelectedOptions())

  function findSelectedOptions() {
    if (filters.inv_status && filters.inv_status.value) {
      if (Array.isArray(filters.inv_status.value)) {
        return {value: "open", label: "open"}
      } else {
        return filters.inv_status.value.split("-").map(i => {return {value: i, label: i}})
      }
    } else {
      return null
    }
  }

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
        let string = ""
        values.map(val => {string = string + "-"+ val.value})
        string = string.slice(1)
        setFilters(prev => {
            return {
            ...prev,
            inv_status: {value: string},
        }})
        setSelectedOptions(values)
    }


    return (
        <div>
            {filters.invoice.value === 'true' && 
                <div className="flex">
                <label className="flex border-[0.5px] border-r-0 rounded-r-none rounded-md px-3 py-1 w-[8rem] capitalize bg-slate-900"
                    htmlFor="status"
                    >
                    Invoice Status
                    </label>
                    <Select 
                    id="status"
                    styles={selectStyles}
                    isMulti
                    defaultValue={options[0]}
                    value={selectedOptions}
                    options={options}
                    onChange={(newVals) => handleChange(newVals)}
                    />
                </div>
            }
        </div>
    )
}