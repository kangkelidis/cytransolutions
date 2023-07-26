"use client";

import React from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import { useRouter } from "next/navigation";

export default function DatePicker() {
  const [date, setDate] = React.useState(new Date());
  const router = useRouter();

  React.useEffect(() => {
    router.push(`/calendar?d=${date.toLocaleDateString()}`);
  }, [date]);

  return (
    <div>


      <Flatpickr
        options={{
          altInput: true,
          altFormat: "d-m-y",
          enableTime: false,
        }}
        className="w-[6rem] text-center py-1 cursor-default  text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
        value={date}
        data-enable-time
        onChange={(newVal) => {
          setDate(new Date(newVal));
        }}
      />

    </div>
  );
}
