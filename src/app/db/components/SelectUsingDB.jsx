"use client";

import React from "react";
import Select from "react-select";
import { getSession } from "next-auth/react";


export default function SelectUsingDB({ name, selectedData, setSelectedData }) {
  const [data, setData] = React.useState([]);
  // .value = _id
  // const [selectedData, setSelectedData] = React.useState()

  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "#202937",
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

  React.useEffect(() => {
    const id = fetchData();
  }, []);

  async function fetchUser() {
    const session = await getSession()
    return session.user
  }

  async function fetchData() {
    const user = await fetchUser();
    let response;
    if (name === "driver" && user.role === "driver") {
      response = await fetch(`/api/driver?name=${user.name}`, {
        method: "GET",
      });
      const data = await response.json();
      setData([data.body.data]);
      return data.body.data._id
    } else {
      response = await fetch(`/api/${name}`, {
        method: "GET",
      });
      const data = await response.json();
      setData(data.body.data);
    }
  }

  return (
    <Select
      required
      isClearable
      isDisabled={data.length === 1}
      id={name}
      captureMenuScroll
      closeMenuOnScroll
      blurInputOnSelect
      placeholder={"All"}
      options={
        data.length > 0 &&
        data.map((d) => ({
          value: d._id,
          label: d.name,
        }))
      }
      styles={selectStyles}
      value={data.length === 1 && name === "driver" ? 
        {value: data[0]._id, label: data[0].name} 
        : selectedData}
      onChange={(newVal) => {
        setSelectedData(newVal)
      }}
    />
  );
}
