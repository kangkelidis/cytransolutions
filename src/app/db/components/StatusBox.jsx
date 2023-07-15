export default function StatusBox({ status }) {
    
    return (
        <div className={`${status === "open" ? "bg-open" : status === "closed" ? "bg-closed" : status === "issued" ? "bg-issued" : "bg-paid"}
        capitalize rounded-lg text-center pb-1`}>
            {status}
        </div>
    )
}