import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class TriggerService extends BaseApiService {
	constructor () {
		super()
	}

	getAll () {
		const url = `${baseUrl}/triggers/`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/triggers/`
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/triggers/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/triggers/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/triggers/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const triggerService = new TriggerService()