export default function StatusBox({ status }) {
    return (
        <div className={`${"bg-" + status} capitalize rounded-lg text-center pb-1`}>
            {status}
        </div>
    )
}