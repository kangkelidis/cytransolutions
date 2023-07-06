'use client'

import { jsPDF } from "jspdf";

async function handleDownloadPDF() {
    const doc = new jsPDF();

    doc.text("Hello world!", 10, 10);
    // create a temp pdf
    doc.save(`a4.pdf`);
}


const Dashboard = () => {

    return (
        <>
            <h1>DASHBOARD</h1>
            <a 
            onClick={handleDownloadPDF}
            >
                DOWNLOAD
            </a>

            <button
            onClick={() => {
                
            }}
            >
                create Client
            </button>
        </>
    )
}

export default Dashboard
