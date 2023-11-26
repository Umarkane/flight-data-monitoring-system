import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class RoleNavbarService extends BaseApiService {
	constructor () {
		super()
	}

	getAll (roleId='') {
		const url = `${baseUrl}/role-navbars${roleId ? '?role='+roleId : ''}`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/role-navbars/`
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/role-navbars/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/role-navbars/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/role-navbars/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const roleNavbarService = new RoleNavbarService()