"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CreateInvoiceButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/db/invoices/new")}
      className="bg-purple-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Create Custom Invoice
    </button>
  );
}