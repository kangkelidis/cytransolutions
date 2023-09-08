import axios from 'axios'

const baseUrl = '/api/ride'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getFiltered = async (filters) => {
    const response = await axios.get(
        `${baseUrl}?from=${filters.from}&till=${filters.till}&driverId=${filters.driver}&clientId=${filters.client}`
    )
    return response.data

}

export default { getAll, getFiltered }