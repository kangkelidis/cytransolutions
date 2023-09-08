'use client'

import IncomeDisplay from '../db/components/IncomeDisplay'
import NewRideBtn from '../components/NewRideBtn'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import ridesReducer from './reducers/ridesReducer'
import filtersReducer from './reducers/filtersReducer'

const Dashboard = () => {

  const store = configureStore({
    reducer: {
      rides: ridesReducer,
      filters: filtersReducer,
    }
  })

	return (
    <Provider store={store} >
			<main>
				<h1>DASHBOARD</h1>
				<NewRideBtn />
				<div className='p-4'>
					<IncomeDisplay />
				</div>
			</main>
    </Provider>
	)
}

export default Dashboard
