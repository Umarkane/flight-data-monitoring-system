<template>
	<div>
		<fmd-table>
			<template slot="head">
				<tr>
					<th>Registration</th>
					<th>Event Date</th>
					<th>Event Name</th>
					<th>Duration</th>
					<th>Flight Number</th>
					<th>Departure Airport</th>
					<th>Arrival Airport</th>
					<th>Event Severity</th>
					<th>Event Status</th>
					<th>Reviewed</th>
					<th>Comments</th>
					<th />
				</tr>
			</template>
			<template slot="body">
				<tr class="filter">
					<td>
						<input
							v-model="eventModel.registration"
							type="text"
						>
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="eventModel.eventDate"
							type="date"
						>
						<img
							src="../../assets/icons/calendar.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="eventModel.eventName"
							type="text"
						><img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="eventModel.duration"
							type="text"
						>
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="eventModel.flightNumber"
							type="text"
						>
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="eventModel.depAirport"
							type="text"
						>
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="eventModel.arrAirport"
							type="text"
						>
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="eventModel.eventSeverity"
							type="text"
						>
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="eventModel.eventStatus"
							type="text"
						>
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<fdm-switch
							:value="eventModel.reviewed"
							@click="eventModel.reviewed = !eventModel.reviewed"
						/>
					</td>
					<td />
					<td>
						<button
							class="detail red"
							@click="onClear"
						>
							Clear
						</button>
					</td>
				</tr>
				<tr
					v-for="item in eventPerPage"
					:key="item.id"
				>
					<td>{{ item.registration }}</td>
					<td>{{ item.event_date }}</td>
					<td>{{ item.event_name }}</td>
					<td>{{ item.duration }}</td>
					<td />
					<td>{{ item.dep_airport }}</td>
					<td>{{ item.arr_airport }}</td>
					<td>{{ item.event_severity }}</td>
					<td>{{ item.event_status }}</td>
					<td>{{ item.is_reviewed }}</td>
					<td>comments</td>
					<td>
						<button
							class="detail"
							@click="onDetail(item)"
						>
							Details
						</button>
					</td>
				</tr>
			</template>
		</fmd-table>
		<pagination
			:total-elements="totalElements"
			@change="onPageChange"
		/>
		<data-insight-detail
			v-if="isShowDetail"
			:event-id="event.id"
			:default-menu="4"
			:flight-id="event.flight"
			:aircraft-id="event.aircraft_id"
			:file-id="Math.round(event.file_id)"
			@close="isShowDetail = false"
		/>
	</div>
</template>

<script>
import FmdTable from '../FdmTable'
import { eventService } from '../../_services/event.service'
import DataInsightDetail from './DataInsightDetail'
import { mapActions } from 'vuex'
import Pagination from '../elements/Pagination'
import moment from 'moment'
import FdmSwitch from '@/components/elements/FdmSwitch'
export default {
	name: 'DataInsightEvent',
	components: { Pagination, DataInsightDetail, FmdTable, FdmSwitch },
	data () {
		return {
			events: [],
			event: {},
			isShowDetail: false,
			currentPage: 1,
			totalElements: 0,
			eventModel: {
				registration: '',
				eventDate: '',
				eventName: '',
				duration :'',
				flightNumber: '',
				depAirport: '',
				arrAirport: '',
				eventSeverity: '',
				eventStatus: '',
				reviewed: false
			}
		}
	},
	computed: {
		eventPerPage () {
			return this.filteredEvents.slice((this.currentPage - 1) * 10, this.currentPage * 10)
		},
		filteredEvents () {
			let data = this.events
			if (this.eventModel.registration) data = this.events.filter(i => i.registration && i.registration.toLowerCase().includes(this.eventModel.registration.toLowerCase()))
			if (this.eventModel.eventDate) data = this.events.filter(i => i.event_date && moment(i.event_date).format('YYYY-MM-DD') === this.eventModel.eventDate)
			if (this.eventModel.eventName) data = this.events.filter(i => i.event_name && i.event_name.toLowerCase().includes(this.eventModel.eventName.toLowerCase()))
			if (this.eventModel.duration !== '') data = this.events.filter(i => i.duration === parseFloat(this.eventModel.duration))
			if (this.eventModel.depAirport) data = this.events.filter(i => i.dep_airport && i.dep_airport.toLowerCase().includes(this.eventModel.depAirport.toLowerCase()))
			if (this.eventModel.arrAirport) data = this.events.filter(i => i.arr_airport && i.arr_airport.toLowerCase().includes(this.eventModel.arrAirport.toLowerCase()))
			if (this.eventModel.eventSeverity) data = this.events.filter(i => i.event_severity && i.event_severity.toLowerCase().includes(this.eventModel.eventSeverity.toLowerCase()))
			if (this.eventModel.eventStatus) data = this.events.filter(i => i.event_status && i.event_status.toLowerCase().includes(this.eventModel.eventStatus.toLowerCase()))
			if (this.eventModel.reviewed !== '') data = this.events.filter(i => i.is_reviewed === this.eventModel.reviewed)
			return data
		}
	},
	mounted () {
		this.fetchEvents()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchEvents () {
			this.setLoading(true)
			eventService.getAll().then(res => {
				this.setLoading(false)
				this.events = res
				this.totalElements = Math.ceil(this.events.length / 10)
			}).catch(err => {
				this.setLoading(false)
				console.log(err)
			})
		},
		onDetail (item) {
			this.event = item
			this.isShowDetail = true
		},
		onPageChange (num) {
			this.currentPage = num
		},
		onClear () {
			this.eventModel = {
				registration: '',
				eventDate: '',
				eventName: '',
				duration :'',
				flightNumber: '',
				depAirport: '',
				arrAirport: '',
				eventSeverity: '',
				eventStatus: '',
				reviewed: false
			}
		}
	}
}
</script>

<style scoped>

</style>