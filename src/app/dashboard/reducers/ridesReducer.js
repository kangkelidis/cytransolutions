import { createSlice } from '@reduxjs/toolkit'
import ridesService from '../services/rides'

const initialState = []

const rideSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    appendRide(state, action) {
      state.push(action.payload)
    },
    setRides(state, action) {
      return action.payload
    }
  }
})

export const initializeRidesAll = () => {
  return async (dispatch) => {
    const rides = await ridesService.getAll()
    dispatch(setRides(rides))
  }
}

export const initializeRides = (filters) => {
    return async (dispatch) => {
      const rides = await ridesService.getFiltered(filters)
      dispatch(setRides(rides))
    }
  }


export const { setRides, appendRide, } = rideSlice.actions
export default rideSlice.reducer;
