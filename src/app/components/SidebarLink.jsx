import Image from "next/image";
export default function SidebarLink({ name, href, onClick }) {
  return (
    <a
      className="flex items-center max-md:justify-center max-md:w-12 w-full h-12 md:px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300"
      href={href}
      onClick={() => onClick()}
    >
        <Image
        src={"/icons/" + name + ".svg"}
        width={24}
        height={24}
        alt={name + "-icon"} 
        />

      <span className="max-md:hidden ml-2 text-sm font-medium">{name}</span>
    </a>
  );
}
