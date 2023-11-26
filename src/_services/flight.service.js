import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class FlightService extends BaseApiService {
	constructor () {
		super()
	}

	getAll (routeId='', startDate='', endDate='', aircraft_id) {
		const query = this.queryFilter(
			{ title: 'route_id', value: routeId },
			{ title: 'start_date', value: startDate },
			{ title: 'end_date', value: endDate },
			{ title: 'aircraft_id', value: aircraft_id },
		)
		const url = `${baseUrl}/flights/${query}`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/flights/`
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/flights/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/flights/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/flights/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const flightService = new FlightService()