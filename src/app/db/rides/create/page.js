import RideForm from "@/app/db/rides/components/RideForm";

export default function Create() {
  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
        <h1 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">Add Ride</h1>
        <RideForm />
    </div>
  );
}
