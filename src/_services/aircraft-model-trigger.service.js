import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class AircraftModelTriggerService extends BaseApiService {
	constructor () {
		super()
	}

	getAll () {
		const url = `${baseUrl}/aircraft-model-triggers/`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/aircraft-model-triggers/`
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/aircraft-model-triggers/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/aircraft-model-triggers/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/aircraft-model-triggers/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const aircraftModelTriggerService = new AircraftModelTriggerService()