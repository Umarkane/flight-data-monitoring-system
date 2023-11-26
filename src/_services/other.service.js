import { BaseApiService } from '@/_services/baseApi.service'

const baseUrl = process.env.VUE_APP_BASE_URL

class OtherService extends BaseApiService {
	constructor () {
		super()
	}

	topEvents (aircraft='', start_date='', end_date='') {
		const query = this.queryFilter(
			{ title: 'aircraft', value: aircraft },
			{ title: 'start_date', value: start_date },
			{ title: 'end_date', value: end_date }
		)
		const url = `${baseUrl}/topevents${query}`
		return this.sendGetRequest(url)
	}

	getParameters () {
		const url = `${baseUrl}/parameters`
		return this.sendGetRequest(url)
	}

	getParameterById (parameter_id='', flight_id='') {
		const query = this.queryFilter(
			{ title: 'parameter_id', value: parameter_id },
			{ title: 'flight_id', value: flight_id },
		)
		const url = `${baseUrl}/graph-data${query}`
		return this.sendGetRequest(url)
	}

	flightsByMonth (aircraft='', start_date='', end_date='') {
		const query = this.queryFilter(
			{ title: 'aircraft', value: aircraft },
			{ title: 'start_date', value: start_date },
			{ title: 'end_date', value: end_date }
		)
		const url = `${baseUrl}/flightsbymonth${query}`
		return this.sendGetRequest(url)
	}

	eventParameters (parameter_id='', flight_id='') {
		const query = this.queryFilter(
			{ title: 'parameter_id', value: parameter_id },
			{ title: 'flight_id', value: flight_id },
		)
		const url = `${baseUrl}/events_parameters${query}`
		return this.sendGetRequest(url)
	}

	averageStats (aircraft='', start_date='', end_date='') {
		const query = this.queryFilter(
			{ title: 'aircraft', value: aircraft },
			{ title: 'start_date', value: start_date },
			{ title: 'end_date', value: end_date }
		)
		const url = `${baseUrl}/averagestats${query}`
		return this.sendGetRequest(url)
	}

	topHighEvents (aircraft='', start_date='', end_date='') {
		const query = this.queryFilter(
			{ title: 'aircraft', value: aircraft },
			{ title: 'start_date', value: start_date },
			{ title: 'end_date', value: end_date }
		)
		const url = `${baseUrl}/top10hevents${query}`
		return this.sendGetRequest(url)
	}

	getFileCoordinates (flight_id='') {
		const query = this.queryFilter(
			{ title: 'flight_id', value: flight_id }
		)
		const url = `${baseUrl}/coordinates${query}`
		return this.sendGetRequest(url)
	}

	getAirlineReport (airline_id='', start_date='', end_date='') {
		const query = this.queryFilter(
			{ title: 'airline_id', value: airline_id },
			{ title: 'start_date', value: start_date },
			{ title: 'end_date', value: end_date }
		)
		const url = `${baseUrl}/report${query}`
		return this.sendGetRequest(url)
	}
}

export const otherService = new OtherService()
