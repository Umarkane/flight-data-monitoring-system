import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class FlightCommentService extends BaseApiService {
	constructor () {
		super()
	}

	getAll (userId) {
		const query = this.queryFilter(
			{ title: 'user_id', value: userId }
		)
		const url = `${baseUrl}/flight-comments/${query}`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/flight-comments/`
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/flight-comments/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/flight-comments/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/flight-comments/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const flightCommentService = new FlightCommentService()