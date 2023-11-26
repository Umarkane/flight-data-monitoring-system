import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class RouteService extends BaseApiService {
	constructor () {
		super()
	}

	getAll (aircraft_id = '', airline_id, startDate, endDate) {
		const query = this.queryFilter(
			{ title: 'aircraft_id', value: aircraft_id },
			{ title: 'airline_id', value: airline_id },
			{ title: 'start_date', value: startDate },
			{ title: 'end_date', value: endDate }
		)
		const url = `${baseUrl}/routes${query}`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/routes/`
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/routes/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/routes/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/routes/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const routeService = new RouteService()
