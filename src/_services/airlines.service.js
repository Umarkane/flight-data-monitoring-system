import {BaseApiService} from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class AirlinesService extends BaseApiService {
	constructor() {
		super()
	}

	getAll () {
		const url = `${baseUrl}/airlines`;
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/airlines/`;
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/airlines/${id}`;
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/airlines/${data.id}/`;
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/airlines/${id}`;
		return this.sendDeleteRequest(url)
	}
}

export const airlinesService = new AirlinesService()