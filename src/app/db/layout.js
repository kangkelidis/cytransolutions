export default function DatabaseLayout({ children }) {
  return (
    <main className="w-full h-full ">
      <div
        className="bg-black rounded-md p-8 m-5 shadow-lg h-fit max-md:p-3 max-md:m-0"
      >
        {children}
      </div>
    </main>
  );
}
