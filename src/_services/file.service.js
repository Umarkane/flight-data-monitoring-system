import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class FileService extends BaseApiService {
	constructor () {
		super()
	}

	getAll (userId='') {
		const query = this.queryFilter(
			{ title: 'user_id', value: userId },
		)
		const url = `${baseUrl}/files/${query}`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/files/`
		const formData = new FormData()
		Object.keys(data).forEach(i => {
			formData.append(i, data[i])
		})
		return this.sendPostRequest(url, formData)
	}

	getById (id) {
		const url = `${baseUrl}/files/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/files/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/files/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const fileService = new FileService()