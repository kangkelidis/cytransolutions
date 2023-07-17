
export default function DatabaseLayout({ children }) {
  return (
    <main className="w-full h-[calc(100%-0px)] ">
      <div
        className="
      bg-black rounded-md p-8 m-5
      shadow-lg h-[calc(100%-20px)] 
      no-scrollbar overflow-y-scroll
      max-md:p-3 max-md:m-0 
      x"
      >
        {children}
      </div>
    </main>
  );
}
