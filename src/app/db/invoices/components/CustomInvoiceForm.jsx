// It is not saved in the database, but it is used to create a new invoice with custom data.
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { generateInvoicePDF } from "../../../../../utils/generateInvoicePDF";
import { set } from "mongoose";

export default function NewInvoice() {
  const router = useRouter();
  return (
    <div className="p-4">
      <CustomInvoiceForm onClose={() => router.back()} />
    </div>
  );
}

function CustomInvoiceForm({ onClose }) {
  // State for invoice rows
  const [rows, setRows] = useState([{ description: "", amount: "" }]);
  const vatRate = 0.09; // 9% VAT

  // State for client type: "existing" or "custom"
  const [clientType, setClientType] = useState("existing");

  // State for selected client if using an existing client
  const [selectedClient, setSelectedClient] = useState("");

  // State for client details. Added "name" field for custom client.
  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    tel: "",
    address: "",
  });

  // Add invoice date, default to today's date (YYYY-MM-DD)
  const [invoiceDate, setInvoiceDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [nextCode, setNextCode] = useState(0);
  // New state for invoice number, not editable.
  const [invoiceCode, setinvoiceCode] = useState("");

  // New state for VAT option: whether the entered price includes VAT.
  const [pricesIncludeVat, setPricesIncludeVat] = useState(true);

  // Fetch actual clients from the API
  const [clients, setClients] = useState([]);
  useEffect(() => {
    async function fetchClients() {
      const res = await fetch("/api/client", { method: "GET" });
      const data = await res.json();
      const clients_sorted = data.body.data.sort((a, b) => a.code - b.code);
      setClients(clients_sorted);
    }
    fetchClients();
  }, []);

  // Prepare options for react-select. Only used in "existing" mode.
  const clientOptions = clients.map((client) => ({
    value: client._id,
    label: client.code + "." + client.name,
  }));

  // When an existing client is selected, update the details.
  useEffect(() => {
    if (clientType === "existing" && selectedClient) {
      const client = clients.find((c) => c._id === selectedClient);
      if (client) {
        setClientDetails({
          name: client.name,
          email: client.email,
          tel: client.tel,
          address: client.address,
        });
      }
    }
  }, [selectedClient, clients, clientType]);

    // Fetch the next available custom invoice code from the API.
    async function fetchNextCustomInvoiceCode() {
      try {
        const res = await fetch("/api/invoice?nextCustom=true");          
        const data = await res.json();          
        setNextCode(data.nextCode);
      } catch (error) {
        console.error("Error fetching custom invoice code:", error);
        setNextCode(0);
      }
    }

  // Update the invoice number whenever client type, selected client, or clients list change.
  useEffect(() => {
    fetchNextCustomInvoiceCode();
    if (clientType === "existing" && selectedClient) {
      const client = clients.find((c) => c._id === selectedClient);
      if (client) {
        setinvoiceCode(`${client.code}/${client.invoicesCreated}-c${nextCode}`);
      } else {
        setinvoiceCode("");
      }
    } else if (clientType === "custom") {
      setinvoiceCode(`c/${nextCode}`);
    } else {
      setinvoiceCode("");
    }
  }, [clientType, selectedClient, clients]);

  // Handler for switching client type
  function handleClientTypeChange(e) {
    const type = e.target.value;
    setClientType(type);
    // Reset details when switching types.
    setSelectedClient("");
    setClientDetails({
      name: "",
      email: "",
      tel: "",
      address: "",
    });
  }

  // Handler for react-select change in existing mode
  function handleClientChange(option) {
    // Clear details, they will be updated by useEffect.
    setClientDetails({ name: "", email: "", tel: "", address: "" });
    setSelectedClient(option.value);
  }

  function handleRowChange(index, field, value) {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  }

  function addRow() {
    setRows([...rows, { description: "", amount: "" }]);
  }

  function removeRow(indexToRemove) {
    setRows(rows.filter((_, index) => index !== indexToRemove));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!clientDetails.name.trim()) {
      alert("Client name is required");
      return;
    }
    const invoiceData = {
      custom: true,
      invoiceDate,
      invoiceCode,
      billTo: { selectedClient, details: clientDetails },
      items: rows,
      pricesIncludeVat,
    };
    console.log("Invoice Data:", invoiceData);
    generateInvoicePDF(invoiceData)

    const response = await fetch("/api/invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...invoiceData}),
    });
  }

  // Compute totals based on whether amounts include VAT or not.
  let subtotal, totalTax, balanceDue;
  if (pricesIncludeVat) {
    // If prices include VAT, remove the VAT portion to compute net subtotal.
    subtotal = rows.reduce(
      (acc, row) =>
        acc +
        (parseFloat(row.amount)
          ? parseFloat(row.amount) / (1 + vatRate)
          : 0),
      0
    );
    totalTax = rows.reduce(
      (acc, row) =>
        acc +
        (parseFloat(row.amount)
          ? parseFloat(row.amount) - parseFloat(row.amount) / (1 + vatRate)
          : 0),
      0
    );
    balanceDue = rows.reduce(
      (acc, row) => acc + (parseFloat(row.amount) || 0),
      0
    );
  } else {
    // If VAT is not included, add VAT on top.
    subtotal = rows.reduce(
      (acc, row) => acc + (parseFloat(row.amount) || 0),
      0
    );
    totalTax = rows.reduce(
      (acc, row) =>
        acc + (parseFloat(row.amount) > 0 ? parseFloat(row.amount) * vatRate : 0),
      0
    );
    balanceDue = subtotal + totalTax;
  }

  return (
    <div className="border border-gray-300 p-4 m-4 rounded">
      {/* Top Groups: Invoice Info and Client Info */}
      <div className="md:flex md:space-x-4">
        {/* Group 1: Invoice Date, Invoice Number, VAT Option */}
        <div className="md:w-1/2">
          <div className="mb-4 border border-gray-300 p-4 rounded">
            <label className="block font-bold mb-2">Invoice Date:</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>
          <div className="mb-4 border border-gray-300 p-4 rounded">
            <label className="block font-bold mb-2">Invoice Number:</label>
            <input
              type="text"
              value={invoiceCode}
              readOnly
              className="w-full p-1 border rounded bg-gray-200"
            />
          </div>
          <div className="mb-4 border border-gray-300 p-4 rounded">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={pricesIncludeVat}
                onChange={(e) => setPricesIncludeVat(e.target.checked)}
                className="mr-1"
              />
              Prices include VAT (9%)
            </label>
          </div>
        </div>

        {/* Group 2: Client Information */}
        <div className="md:w-1/2">
          <div className="mb-4 border border-gray-300 p-4 rounded">
            <label className="block font-bold mb-2">Bill to:</label>
            <div className="mb-2">
              <label className="mr-4">
                <input
                  type="radio"
                  name="clientType"
                  value="existing"
                  checked={clientType === "existing"}
                  onChange={handleClientTypeChange}
                  className="mr-1"
                />
                Existing Client
              </label>
              <label>
                <input
                  type="radio"
                  name="clientType"
                  value="custom"
                  checked={clientType === "custom"}
                  onChange={handleClientTypeChange}
                  className="mr-1"
                />
                Custom Client
              </label>
            </div>
            {clientType === "existing" ? (
              <Select
                className="mb-2 text-black"
                options={clientOptions}
                onChange={handleClientChange}
                isSearchable
                placeholder="Select a client..."
                value={clientOptions.find(
                  (option) => option.value === selectedClient
                )}
              />
            ) : (
              <div className="mb-2">
                <label className="block">
                  Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientDetails.name}
                  onChange={(e) =>
                    setClientDetails({
                      ...clientDetails,
                      name: e.target.value,
                    })
                  }
                  required
                  className="w-full p-1 border rounded"
                  placeholder="Enter client name"
                />
              </div>
            )}
            <div className="mb-2">
              <label className="block">Email:</label>
              <input
                type="email"
                value={clientDetails.email}
                onChange={(e) =>
                  setClientDetails({
                    ...clientDetails,
                    email: e.target.value,
                  })
                }
                className="w-full p-1 border rounded text-black"
              />
            </div>
            <div className="mb-2">
              <label className="block">Tel:</label>
              <input
                type="text"
                value={clientDetails.tel}
                onChange={(e) =>
                  setClientDetails({
                    ...clientDetails,
                    tel: e.target.value,
                  })
                }
                className="w-full p-1 border rounded text-black"
              />
            </div>
            <div className="mb-2">
              <label className="block">Address:</label>
              <textarea
                value={clientDetails.address}
                onChange={(e) =>
                  setClientDetails({
                    ...clientDetails,
                    address: e.target.value,
                  })
                }
                className="w-full p-1 border rounded text-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items Table and Totals */}
      <form onSubmit={handleSubmit}>
        <table className="min-w-full border-collapse mb-4">
          <thead>
            <tr>
              <th className="border p-2 w-12">No</th>
              <th className="border p-2">Description</th>
              <th className="border p-2 w-24">Tax</th>
              <th className="border p-2 w-24">Amount</th>
              <th className="border p-2 w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const tax =
                parseFloat(row.amount) > 0
                  ? pricesIncludeVat
                    ? (
                        parseFloat(row.amount) - 
                        parseFloat(row.amount) / (1 + vatRate)
                      ).toFixed(2)
                    : (parseFloat(row.amount) * vatRate).toFixed(2)
                  : "0.00";
              return (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">
                    <div className="overflow-x-auto">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          handleRowChange(index, "description", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                      />
                    </div>
                  </td>
                  <td className="border p-2 text-right">
                    <input
                      type="text"
                      value={tax}
                      readOnly
                      className="w-full p-1 border rounded bg-gray-200 cursor-not-allowed"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={row.amount}
                      onChange={(e) =>
                        handleRowChange(index, "amount", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      min="0"
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <button
            type="button"
            onClick={addRow}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Row
          </button>
        </table>

        {/* Totals Section */}
        <div className="mb-4 border border-gray-300 p-4 rounded">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Subtotal:</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-bold">Total Tax:</span>
            <span>{totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Balance Due:</span>
            <span>{balanceDue.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Print Invoice
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}