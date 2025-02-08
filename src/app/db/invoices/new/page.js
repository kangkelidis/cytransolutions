"use client";

import React from "react";
import { useRouter } from "next/navigation";
import CustomInvoiceForm from "../components/CustomInvoiceForm";

export default function NewInvoice() {
  const router = useRouter();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create Custom Invoice</h2>
      <CustomInvoiceForm onClose={() => router.back()} />
    </div>
  );
}