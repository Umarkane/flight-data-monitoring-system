import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class NavbarService extends BaseApiService {
	constructor () {
		super()
	}

	getAll (role) {
		const url = `${baseUrl}/navbars/${role ? '?role='+role : ''}`
		return this.sendGetRequest(url)
	}

	create (data) {
		const url = `${baseUrl}/navbars/`
		return this.sendPostRequest(url, data)
	}

	getById (id) {
		const url = `${baseUrl}/navbars/${id}`
		return this.sendGetRequest(url)
	}

	update (data) {
		const url = `${baseUrl}/navbars/${data.id}/`
		return this.sendPutRequest(url, data)
	}

	delete (id) {
		const url = `${baseUrl}/navbars/${id}`
		return this.sendDeleteRequest(url)
	}
}

export const navbarService = new NavbarService()