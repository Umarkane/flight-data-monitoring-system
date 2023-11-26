<template>
	<fdm-modal @close="$emit('close')">
		<div
			slot="content"
			class="create"
		>
			<div class="create__head">
				{{ isEdit ? 'Edit route' : 'Add new route' }}
			</div>
			<div class="create__body">
				<form
					class="form"
					@submit.prevent="onSubmit"
				>
					<div
						class="form__row"
						:class="{ error: errors.has('airline') }"
					>
						<label for="airline">Airline</label>
						<select
							id="airline"
							v-model="route.airline"
							v-validate="'required'"
							name="airline"
						>
							<option
								v-for="airline in airlines"
								:key="airline.id"
								:value="airline.id"
							>
								{{ airline.title }}
							</option>
						</select>
					</div>
					<div
						class="form__row"
						:class="{ error: errors.has('fromAirport') }"
					>
						<label for="fromAirport">Airport(from)</label>
						<select
							id="fromAirport"
							v-model="route.from_airport"
							v-validate="'required'"
							name="fromAirport"
						>
							<option
								v-for="item in airports"
								:key="item.id"
								:value="item.id"
							>
								{{ item.title }}
							</option>
						</select>
					</div>
					<div
						class="form__row"
						:class="{ error: errors.has('toAirport') }"
					>
						<label for="toAirport">Airport(to)</label>
						<select
							id="toAirport"
							v-model="route.to_airport"
							v-validate="'required'"
							name="toAirport"
						>
							<option
								v-for="item in airports"
								:key="item.id"
								:value="item.id"
							>
								{{ item.title }}
							</option>
						</select>
					</div>
					<div class="form__submit flex-justify-between">
						<button type="submit">
							ADD
						</button>
						<button
							type="reset"
							class="black"
							@click="$emit('close')"
						>
							DECLINE
						</button>
					</div>
				</form>
			</div>
		</div>
	</fdm-modal>
</template>

<script>
import FdmModal from '../FdmModal.vue'
import { airlinesService } from '../../_services/airlines.service'
import { mapActions } from 'vuex'
import { airportService } from '../../_services/airport.service'
import { routeService } from '../../_services/route.service'

export default {
	name: 'RouteCreate',
	components: { FdmModal },
	props: {
		isEdit: { type: Boolean, default: false },
		editRoute: { type: Object, default: () => ({}) },
	},
	data () {
		return {
			airports: [],
			airlines: [],
			route: {}
		}
	},
	mounted () {
		if (this.isEdit) this.route = { ...this.editRoute }
		this.fetchAirlines()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchAirlines () {
			this.setLoading(true)
			airlinesService.getAll().then(res => {
				this.airlines = res
				return airportService.getAll()
			}).then(res => {
				this.airports = res
				this.setLoading(false)
			}).catch(err => {
				this.setLoading(false)
				console.log(err)
				this.$toastr.e(err)
			})
		},
		onSubmit () {
			this.$validator.validate().then(valid => {
				if (valid) {
					if (this.isEdit) {
						routeService
							.update(this.route)
							.then(() => {
								this.$toastr.s(this.$t('successMessageEdit'))
								this.$emit('fetch')
								this.$emit('close')
							})
							.catch(err => {
								this.$toastr.e(err)
								console.log(err)
							})
					} else {
						routeService
							.create(this.route)
							.then(() => {
								this.$emit('fetch')
								this.$emit('close')
								this.$toastr.s(this.$t('successMessageCreate'))
							})
							.catch(err => {
								console.log(err)
								this.$toastr.e(err)
							})
					}
				}
			})
		},
	},
}
</script>

<style></style>
