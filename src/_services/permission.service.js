import {BaseApiService} from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class PermissionService extends BaseApiService {
	constructor() {
		super()
	}

	getAll () {
		const url = `${baseUrl}/permissions/`;
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/permissions/`;
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/permissions/${id}`;
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/permissions/${data.id}/`;
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/permissions/${id}`;
		return this.sendDeleteRequest(url)
	}
}

export const permissionService = new PermissionService()