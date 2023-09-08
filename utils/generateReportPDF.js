import * as jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toCurrency } from './utils.js'

export function printReport(data, filters) {
	const rides = data.body.data
	const total = data.body.total
	const credit = data.body.credit
	const cash = total - credit

    const driver = filters.driver ? rides[0].driver.name : 'ALL'
    const client = filters.client ? rides[0].client.name : 'ALL'

	const doc = new jsPDF.jsPDF('l')

	let file = require('../public/logo.js')
	doc.addImage(file.logo, 'png', 13, 13, 17.4, 14.4)
	doc.setFont('Helvetica', 'bold')
	doc.setFontSize(11)

	doc.text('CYTRANSOLUTIONS LTD', 13, 34.8)

	doc.setFontSize(19)

	doc.text('Report', 280, 20, null, null, 'right')
	doc.setFontSize(9)
	doc.setFont('Helvetica', 'normal')
	doc.text(
		`Date range: ${new Date(filters.from).toLocaleDateString('en-UK')} - ${new Date(
			filters.till
		).toLocaleDateString('en-UK')}
        `,
		280,
		30,
		null,
		null,
		'right'
	)
    doc.text(`Client: ${client}`, 280, 40, null, null, 'right')
    doc.text(`Driver: ${driver}`, 280, 50, null, null, 'right')

	doc.setFont('Helvetica', 'normal')
	doc.setFontSize(7)

	doc.text('Amathountos 34, Shop 8,', 13, 38.2)
	doc.text('Limassol, 4532', 13, 41.2)
	doc.text('Tel: +35799667777', 13, 44.2)
	doc.text('Email: 99667777cy@gmail.com', 13, 47.2)
	doc.text('VAT no : 10361018V', 13, 50.2)

	// if (typeof doc.putTotalPages() === 'function') {
	//     str = str + 'of ' + totalPagesExp
	// }

	// doc.text(str, 13, 250)

	doc.autoTable({
		startY: 65,
		headStyles: { fillColor: [50, 50, 50] },
		margin: { left: 13, right: 13, bottom: 23 },
		rowPageBrake: 'avoid',
		styles: {
			fontSize: 9,
		},
		head: [['Id', 'Date', 'Itinerary', 'Driver', 'Client', 'Passenger', 'Notes', 'Cash', 'Credit', 'Total',]],
		body: rides.map((ride) => {
			return [
                ride.count,
				new Date(ride.date).toLocaleDateString('en-UK'),
				ride.from + ' - ' + ride.to,
                ride.driver?.name,
                ride.client?.name,
				ride.passenger,
				ride.notes,
				ride.cash == 0 ? '' : ride.cash,
                ride.credit == 0 ? '' : ride.credit,
                ride.cash + ride.credit
			]
		}),
	})

	let finalY = doc.lastAutoTable.finalY

	doc.line(13, finalY + 5, 280, finalY + 5)

	doc.setFontSize(11)
	doc.setFont('Helvetica', 'normal')
	doc.text('Cash:', 230, finalY + 10)
	doc.text(
		`${toCurrency(Number(cash))}`,
		280,
		finalY + 10,
		null,
		null,
		'right'
	)
	doc.text('Credit', 230, finalY + 15)
	doc.text(
		`${toCurrency(Number(credit))}`,
		280,
		finalY + 15,
		null,
		null,
		'right'
	)
	doc.text('Total:', 230, finalY + 20)
	doc.setFont('Helvetica', 'bold')
	doc.text(
		`${toCurrency(total)}`,
		280,
		finalY + 20,
		null,
		null,
		'right'
	)


	let pageCount = doc.internal.getNumberOfPages()
	for (let i = 0; i < pageCount; i++) {
		doc.setPage(i)
		let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber //Current Page
		doc.text(
			'page: ' + pageCurrent + ' of ' + pageCount,
			13,
			doc.internal.pageSize.height - 15
		)

		if (pageCount > pageCurrent) {
			doc.text(
				'continues to next page',
				280,
				doc.internal.pageSize.height - 15,
				null,
				null,
				'right'
			)
		}

	}

	doc.save(
		`report.pdf`
	)
}
