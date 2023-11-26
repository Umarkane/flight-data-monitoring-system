<template>
	<div>
		<fmd-table>
			<template slot="head">
				<tr>
					<th>Flight Number</th>
					<th>Liftoff</th>
					<th>Touchdown</th>
					<th>Departure Airport</th>
					<th>Departure Runway</th>
					<th>Arrival Airport</th>
					<th>Arrival Runway</th>
					<th>Comment</th>
					<th />
				</tr>
			</template>
			<template slot="body">
				<tr class="filter">
					<td>
						<input type="text">
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input type="text">
						<img
							src="../../assets/icons/calendar.svg"
							alt=""
						>
					</td>
					<td>
						<input type="text"><img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input type="text"><img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input type="text"><img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input type="text"><img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input type="text"><img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input type="text"><img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td />
				</tr>
				<tr
					v-for="item in flights"
					:key="item.id"
				>
					<td>{{ item.flight_no }}</td>
					<td />
					<td />
					<td>{{ item.dep_airport }}</td>
					<td />
					<td>{{ item.arr_airport }}</td>
					<td />
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
		<data-insight-detail
			v-if="isShowDetail"
			:event-id="flight.event"
			:flight-id="flight.id"
			:default-menu="3"
			:aircraft-id="flight.aircraft"
			:file-id="flight.file_id"
			@close="isShowDetail = false"
		/>
	</div>
</template>

<script>
import FmdTable from '../FdmTable'
import { flightService } from '../../_services/flight.service'
import DataInsightDetail from './DataInsightDetail'
export default {
	name: 'DataInsightFlight',
	components: { DataInsightDetail, FmdTable },
	data () {
		return {
			flights: [],
			flight: {},
			isShowDetail: false
		}
	},
	mounted () {
		this.fetchFlight()
	},
	methods: {
		fetchFlight () {
			flightService.getAll().then(res => {
				this.flights = res
			}).catch(err => {
				console.log(err)
			})
		},
		onDetail (item) {
			this.flight = item
			this.isShowDetail = true
		}
	}
}
</script>

<style scoped>

</style>