import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class FileCommentService extends BaseApiService {
	constructor () {
		super()
	}

	getAll (userId) {
		const query = this.queryFilter(
			{ title: 'user_id', value: userId }
		)
		const url = `${baseUrl}/file-comments/${query}`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/file-comments/`
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/file-comments/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/file-comments/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/file-comments/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const fileCommentService = new FileCommentService()