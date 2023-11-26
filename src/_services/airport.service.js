import {BaseApiService} from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class AirportService extends BaseApiService {
	constructor() {
		super()
	}

	getAll () {
		const url = `${baseUrl}/airports`;
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/airports/`;
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/airports/${id}`;
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/airports/${data.id}/`;
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/airports/${id}`;
		return this.sendDeleteRequest(url)
	}
}

export const airportService = new AirportService()