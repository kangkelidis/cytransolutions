'use client'

import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi'
import { changeSingleStateValue, toCurrency } from '../../../../utils/utils'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/dark.css'
import React from 'react'
import SelectUsingDB from './SelectUsingDB'
import RidesList from './RidesList'
import PrintReport from '@/app/dashboard/components/PrintReport'

export default function IncomeDisplay() {
	const today = new Date()
	const firstOfCurrentMonth = new Date()
	firstOfCurrentMonth.setDate(1)
	const lastOfCurrentMonth = new Date(firstOfCurrentMonth)
	lastOfCurrentMonth.setMonth(firstOfCurrentMonth.getMonth() + 1)
	lastOfCurrentMonth.setDate(0)
	lastOfCurrentMonth.setHours(23, 59, 59, 99)

	const [date, setDate] = React.useState({
		from: firstOfCurrentMonth,
		till: lastOfCurrentMonth,
	})
	const [driverId, setDriverId] = React.useState()
	const [clientId, setClientId] = React.useState()

	const [totals, setTotals] = React.useState()

	const [selectedBtn, setSelectedBtn] = React.useState()

	function TotalsBox() {
		return (
			<div className='bg-gray-900 '>
				<div className='flex flex-col px-5'>
					<span className='text-sm'>Total:</span>
					<div className=' bg-green-600 px-4 text-2xl font-bold rounded-lg'>
						<span>{totals && toCurrency(totals.total)}</span>
					</div>
				</div>
				<div className='text-xs px-5 mt-1'>
					<span>
						Credit: <span>{totals && toCurrency(totals.credit)} </span>
					</span>
					<span>
						{' '}
						- <span>{totals && totals.count}</span> rides
					</span>
				</div>
			</div>
		)
	}

	function DateControl({ display, month, year }) {
		function handleArrowClicked(sign) {
			setSelectedBtn(null)
			setDate((prev) => {
				let newFromDate = new Date(prev.from)
				newFromDate.setFullYear(
					newFromDate.getFullYear() + sign * year,
					newFromDate.getMonth() + sign * month,
					newFromDate.getDate()
				)
				let newTillDate = new Date(newFromDate)
				newTillDate.setMonth(newFromDate.getMonth() + 1)
				newTillDate.setDate(0)
				newTillDate.setHours(23, 59, 59, 99)

				return { from: newFromDate, till: newTillDate }
			})
		}

		return (
			<div className='flex flex-row items-center gap-1 select-none max-md:justify-center'>
				<BiSolidLeftArrow
					onClick={() => handleArrowClicked(-1)}
					className='cursor-pointer hover:text-purple-500'
				/>
				<div className='py-1 border-[0.5px] rounded-md w-[5.5rem] text-center cursor-default bg-gray-900'>
					<span>{display}</span>
				</div>
				<BiSolidRightArrow
					onClick={() => handleArrowClicked(1)}
					className='cursor-pointer hover:text-purple-500'
				/>
			</div>
		)
	}

	function DateControls() {
		return (
			<div className='flex flex-row w-full gap-6 text-xl bg-slate-800 p-4 py-[17.6px] max-md:flex-col '>
				<DateControl
					display={`
            ${date.from.toLocaleDateString('en-UK', { month: 'short' })}${
						date.from.getMonth() !== date.till.getMonth()
							? '-' + date.till.toLocaleDateString('en-UK', { month: 'short' })
							: ''
					}`}
					month={1}
					year={0}
				/>
				<DateControl
					display={`
          ${date.from.toLocaleDateString('en-UK', {
						year:
							date.from.getFullYear() !== date.till.getFullYear()
								? '2-digit'
								: 'numeric',
					})}${
						date.from.getFullYear() !== date.till.getFullYear()
							? '-' + date.till.toLocaleDateString('en-UK', { year: '2-digit' })
							: ''
					}`}
					month={0}
					year={1}
				/>
			</div>
		)
	}

	function OtherFilters() {
		function DatePicker({ display }) {
			return (
				<div className='flex items-center justify-between gap-2'>
					<label className='capitalize'>{display}:</label>
					<Flatpickr
						options={{
							altInput: true,
							altFormat: 'd-m-y',
							enableTime: false,
						}}
						className='w-[6rem] text-center py-1 cursor-default  text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring'
						value={date[display]}
						data-enable-time
						onChange={(newVal) => {
							setSelectedBtn(null)
							changeSingleStateValue(setDate, display, new Date(newVal))
						}}
					/>
				</div>
			)
		}

		function DriverSelect() {
			return (
				<div>
					<div>
						<label>Driver</label>
						<SelectUsingDB
							name={'driver'}
							selectedData={driverId}
							setSelectedData={setDriverId}
						/>
					</div>
					<div>
						<label>Client</label>
						<SelectUsingDB
							name={'client'}
							selectedData={clientId}
							setSelectedData={setClientId}
						/>
					</div>
				</div>
			)
		}

		return (
			<div className='flex flex-col gap-4 p-4'>
				<div className='flex flex-row gap-4 max-md:flex-col'>
					<DatePicker display={'from'} />
					<DatePicker display={'till'} />
				</div>

				<div>
					<DriverSelect />
				</div>
			</div>
		)
	}

	function ListOfRides() {
		return (
			<div className='w-full max-h-[15rem] overflow-scroll no-scrollbar'>
				<RidesList
					filters={{
						from: date.from,
						till: date.till,
						driver: driverId ? driverId.value : undefined,
						client: clientId ? clientId.value : undefined,
					}}
					totals={totals}
					setTotals={setTotals}
				/>
			</div>
		)
	}

	function Title() {
		return (
			<div className='flex flex-row justify-between items-center px-4 '>
				<h1 className='text-2xl font-bold py-4'>Income Overview</h1>
				<div className=' leading-5'>
					{clientId && (
						<h2>
							<span className='text-gray-400 mr-10'>Client:</span>{' '}
							{clientId.label}
						</h2>
					)}
					{driverId && (
						<h2>
							<span className='text-gray-400 mr-10'>Driver:</span>{' '}
							{driverId.label}
						</h2>
					)}
				</div>
			</div>
		)
	}

	function ControlsBox() {
		return (
			<div className='flex flex-col p-4 gap-3'>
				<PrintReport />
				<button
					className={`${
						selectedBtn === 'month' && 'bg-slate-900'
					} border-[0.5px] rounded-md py-1 shadow-lg hover:bg-slate-900 hover:border-slate-900 focus:bg-slate-900 focus:border-slate-900 focus:outline-none`}
					onClick={() => {
						setSelectedBtn('month')
						setDate({ from: firstOfCurrentMonth, till: today })
					}}
				>
					This Month
				</button>
				<button
					className={`${
						selectedBtn === 'year' && 'bg-slate-900'
					} border-[0.5px] rounded-md py-1 shadow-lg hover:bg-slate-900 hover:border-slate-900 focus:bg-slate-900 focus:border-slate-900 focus:outline-none`}
					onClick={() => {
						setSelectedBtn('year')
						setDate({
							from: new Date('01/01/' + today.getFullYear()),
							till: today,
						})
					}}
				>
					This Year
				</button>
				<button
					className={`${
						selectedBtn === 'all' && 'bg-slate-900'
					} border-[0.5px] rounded-md py-1 shadow-lg hover:bg-slate-900 hover:border-slate-900 focus:bg-slate-900 focus:border-slate-900 focus:outline-none`}
					onClick={() => {
						setSelectedBtn('all')
						setDate({
							from: new Date('01/01/2010'),
							till: today,
						})
					}}
				>
					All Time
				</button>
			</div>
		)
	}

	return (
		<div className='flex flex-col max-w-[31rem] bg-slate-700 rounded-lg'>
			<Title />
			<div className='flex flex-row'>
				<div className='flex flex-col bg-slate-600 max-md:w-[60%] w-[70%]'>
					<DateControls />
					<OtherFilters />
				</div>
				<div className='w-full'>
					<TotalsBox />
					<ControlsBox />
				</div>
			</div>
			<ListOfRides />
		</div>
	)
}
