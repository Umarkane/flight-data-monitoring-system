import {BaseApiService} from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class CountriesService extends BaseApiService {
    constructor() {
        super()
    }

    getAll () {
        const url = `${baseUrl}/countries/`;
        return this.sendGetRequest(url)
    }

    create (data) {
        const url = `${baseUrl}/countries/`;
        return this.sendPostRequest(url, data)
    }

    getById (id) {
        const url = `${baseUrl}/countries/${id}`;
        return this.sendGetRequest(url)
    }

    update (data) {
        const url = `${baseUrl}/countries/${data.id}/`;
        return this.sendPutRequest(url, data)
    }

    delete (id) {
        const url = `${baseUrl}/countries/${id}`;
        return this.sendDeleteRequest(url)
    }
}

export const countriesService = new CountriesService()