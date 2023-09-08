import { useSelector } from 'react-redux'
import { printReport } from '../../../../utils/generateReportPDF'

const PrintReport = () => {
	const rides = useSelector((state) => state.rides)
	const filters = useSelector((state) => state.filters)
    
    const handlePrint = async (data) => {
        console.log("print");
        console.log('reduc ridex', rides)
        console.log('reduc filters', filters)
        
        printReport(rides, filters)
    
      }
	return (
		<button
			onClick={handlePrint}
			className='py-2.5 leading-5 text-white transition-colors duration-300 transform bg-slate-500 rounded-md hover:bg-purple-500 focus:outline-none focus:bg-purple-500'
		>
			Print Report
		</button>
	)
}

export default PrintReport
