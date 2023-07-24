"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { changeSingleStateValue } from "../../../../../utils/utils";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { getSession } from "next-auth/react";


export default function RideForm() {
  const router = useRouter();
  
  const [editMode, setEditMode] = React.useState(false);
  const pathname = usePathname();
  const id = pathname.split("id=")[1];
  const [drivers, setDrivers] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true)
  const [data, setData] = React.useState({
    date: Date.now(),
  });
  const [locked, setLocked] = React.useState(false)

  
  React.useEffect(() => {
    setIsLoading(true)
    if (id) {
      fetchRide();
      setEditMode(true);
    }
    fetchClients();
    fetchDrivers();
    fetchLocations();
  }, []);
  
  async function fetchUser() {
    const session = await getSession()
    return session.user
  }

  async function fetchRide() {
    const response = await fetch(`/api/ride?id=${id}`, {
      method: "GET",
    });
    
    const data = await response.json();
    setLocked(!data.body.invoice ? false : data.body.invoice.status !== "open")
    setData(data.body);
  }

  async function fetchClients() {
    const response = await fetch(`/api/client`, {
      method: "GET",
    });

    const data = await response.json();
    setClients(data.body.data);
  }

  async function fetchDrivers() {
    const user = await fetchUser()
    let response
    if (user.role === "driver") {
      response = await fetch(`/api/driver?name=${user.name}`, {
        method: "GET",
      });
      const data = await response.json();
      setDrivers([data.body.data]);
      changeSingleStateValue(setData, "driver", data.body.data);
    } else {
      response = await fetch(`/api/driver`, {
        method: "GET",
      });
      const data = await response.json();
      setDrivers(data.body.data);
    }

  }

  async function fetchLocations() {
    const response = await fetch(`/api/ride?locations=true`, {
      method: "GET",
    });

    const data = await response.json();
    const locs = data.body.map((location) => ({
      value: location.name,
      label: location.name,
    }));
    setLocations(locs);

    setIsLoading(false)
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return

    setIsLoading(true)
    if (editMode) {
      await fetch(`/api/ride?id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...data }),
      });
    } else {
      await fetch("/api/ride", {
        method: "POST",
        body: JSON.stringify({ ...data }),
      });
    }

    router.back();
  }

  function validateForm() {
    if (locked) return false
    // check client and credit
    if ((data.credit && data.credit !== "0") && !data.client) {
      alert("Must define a client to have credit")
      return false
    }

    return true
  }

  async function handleDelete() {
    await fetch(`/api/ride?id=${id}`, {
      method: "DELETE",
    });
    router.push("/db/rides");
  }

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

  return (
    <div>
      <h1 className="text-2xl p-4 m-4 bg-slate-800">{editMode ? <span>Edit Ride no. <span className="text-purple-500">{data.count}</span></span> : "Add a new Ride"}</h1>
      {!isLoading &&
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col m-4 gap-4 md:grid md:grid-cols-2 ">
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="Name">
              Date*
            </label>

            <Flatpickr
              options={{
                altInput: true,
                altFormat: "d-m-y -- H:i",
                time_24hr: true,
                enableSeconds: false,
                clickOpens: !locked,
              }}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              data-enable-time
              value={data.date}
              onChange={(newVal) => {
                if (locked) {
                  alert("Ride not in open invoice.")
                  return
                }
                changeSingleStateValue(setData, "date", newVal);
              }}
            />
          </div>

          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="driver"
            >
              Driver*
            </label>
            <Select
              required
              isDisabled={drivers.length === 1 || locked}
              id="driver"
              captureMenuScroll
              closeMenuOnScroll
              blurInputOnSelect
              options={
                drivers.length > 0 &&
                drivers.map((driver) => ({
                  value: driver._id,
                  label: driver.count +". "+ driver.name,
                }))
              }
              styles={selectStyles}
              value={
                data.driver
                  ? { value: data.driver._id, label: data.driver.count +". "+ data.driver.name }
                  : drivers.length === 1 ?
                  {value: drivers[0]._id, label: drivers[0].count +". "+ drivers[0].name,} :
                    { value: null, label: "" }
              }
              onChange={(newVal) => {
                const selected = drivers.filter((driver) => {
                  return driver._id === newVal.value;
                })[0];
                changeSingleStateValue(setData, "driver", selected);
              }}
            />
          </div>

          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="client"
            >
              Client
            </label>

            <Select
              id="client"
              isDisabled={locked}
              isClearable
              captureMenuScroll
              closeMenuOnScroll
              blurInputOnSelect
              options={clients.map((client) => ({
                value: client._id,
                label: client.code +". "+ client.name,
              }))}
              styles={selectStyles}
              value={
                data.client
                  ? { value: data.client._id, label: data.client.code +". "+ data.client.name }
                  : { value: null, label: "" }
              }
              onChange={(newVal) => {
                const selected =
                  newVal === null
                    ? null
                    : clients.filter((client) => {
                        return client._id === newVal.value;
                      })[0];
                changeSingleStateValue(setData, "client", selected);
              }}
            />

          </div>

          <div>
          <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="passenger"
            >
              Passenger
            </label>
            <input
            disabled={locked}
              id="passenger"
              type="text"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              value={data.passenger}
              onChange={(newVal) =>
                changeSingleStateValue(setData, "passenger", newVal.target.value)
              }
            />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="from">
              From
            </label>
            <CreatableSelect
              isClearable
              isDisabled={locked}
              options={locations}
              styles={selectStyles}
              id="from"
              value={
                data.from
                  ? { value: data.from, label: data.from }
                  : { value: null, label: "" }
              }
              onChange={(newVal) => {
                let selected = newVal === null
                    ? undefined
                    : locations.filter((loc) => {
                        return loc.value === newVal.value;
                      })[0];
                if (selected) selected = selected.value
                changeSingleStateValue(setData, "from", selected);
              }}
              onCreateOption={(newVal) => {
                changeSingleStateValue(setData, "from", newVal);

              }}
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="to">
              To
            </label>
            <CreatableSelect
              isClearable
              isDisabled={locked}
              options={locations}
              styles={selectStyles}
              id="to"
              value={
                data.to
                  ? { value: data.to, label: data.to }
                  : { value: null, label: "" }
              }
              onChange={(newVal) => {
                let selected = newVal === null
                    ? undefined
                    : locations.filter((loc) => {
                        return loc.value === newVal.value;
                      })[0];
                if (selected) selected = selected.value
                changeSingleStateValue(setData, "to", selected);
              }}
              onCreateOption={(newVal) => {
                changeSingleStateValue(setData, "to", newVal);

              }}
            />

          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="cash">
              Cash
            </label>
            <input
            disabled={locked}
              id="cash"
              type="number"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              value={data.cash}
              onFocus={(e) => {e.target.select()}}
              onChange={(newVal) =>
                changeSingleStateValue(setData, "cash", newVal.target.value)
              }
            />
          </div>

          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="credit"
            >
              Credit
            </label>
            <input
            disabled={locked}
              id="credit"
              type="number"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              onFocus={(e) => {e.target.select()}}
              value={data.credit}
              onChange={(newVal) =>
                changeSingleStateValue(setData, "credit", newVal.target.value)
              }
            />
          </div>

          <div className="col-span-2">
            <label className="text-gray-700 dark:text-gray-200" htmlFor="notes">
              Notes
            </label>
            <textarea
            disabled={locked}
              id="notes"
              type="email"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              value={data.notes}
              onChange={(newVal) =>
                changeSingleStateValue(setData, "notes", newVal.target.value)
              }
            />
          </div>
        </div>

        <div className="flex justify-around m-4 mt-8 gap-4">
          <button
            type="button"
            className=" px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            onClick={() => {router.back()}}
          >
            Back
          </button>
          {editMode && !locked && (
            <button
              type="button"
              className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-red-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              onClick={handleDelete}
            >
              DELETE
            </button>
          )}
          <button
          disabled={locked}
            type="submit"
            className="px-8 py-2.5 leading-5 disabled:cursor-not-allowed text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            {editMode ? "Update" : "Add new Ride"}
          </button>
        </div>
      </form>
}
    </div>
  );
}
RideForm.auth = true


