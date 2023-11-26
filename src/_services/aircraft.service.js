import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class AircraftService extends BaseApiService {
	constructor () {
		super()
	}

	getAll (airline='') {
		const query = this.queryFilter(
			{ title: 'airline', value: airline }
		)
		const url = `${baseUrl}/aircrafts${query}`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/aircrafts/`
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/aircrafts/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/aircrafts/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/aircrafts/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const aircraftService = new AircraftService()