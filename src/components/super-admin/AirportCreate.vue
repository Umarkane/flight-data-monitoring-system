<template>
	<fdm-modal @close="$emit('close')">
		<div
			slot="content"
			class="create"
		>
			<div class="create__head">
				{{ isEdit ? 'Edit airport' : 'Add new airport' }}
			</div>
			<div class="create__body">
				<form
					class="form"
					@submit.prevent="onSubmit"
				>
					<div
						class="form__row"
						:class="{ error: errors.has('title') }"
					>
						<label for="title">Title</label>
						<input
							id="title"
							v-model="airport.title"
							v-validate="'required'"
							type="text"
							name="title"
						>
						<template v-if="errors.length">
							<img
								src="../../assets/icons/error.svg"
								alt=""
							>
							<span>Required field</span>
						</template>
					</div>
					<div
						class="form__row"
						:class="{ error: errors.has('code') }"
					>
						<label for="code">Code</label>
						<input
							id="code"
							v-model="airport.code"
							v-validate="'required'"
							type="text"
							name="code"
						>
						<template v-if="errors.length">
							<img
								src="../../assets/icons/error.svg"
								alt=""
							>
							<span>Required field</span>
						</template>
					</div>
					<div
						class="form__row"
						:class="{ error: errors.has('city') }"
					>
						<label for="city">City</label>
						<select
							id="city"
							v-model="airport.city"
							v-validate="'required'"
							name="city"
						>
							<option
								v-for="city in cities"
								:key="city.id"
								:value="city.id"
							>
								{{ city.title }}
							</option>
						</select>
					</div>
					<div class="form__submit flex-justify-between">
						<button type="submit">
							ADD
						</button>
						<button
							type="cancel"
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
import { airportService } from '../../_services/airport.service'
import { cityService } from '../../_services/city.service'
import { mapActions } from 'vuex'

export default {
	name: 'AirportCreate',
	components: { FdmModal },
	props: {
		isEdit: { type: Boolean, default: false },
		editAirport: { type: Object, default: () => ({}) },
	},
	data () {
		return {
			airport: {},
			cities: []
		}
	},
	mounted () {
		if (this.isEdit) this.airport = { ...this.editAirport }
		this.fetchCities()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchCities () {
			this.setLoading(true)
			cityService.getAll().then(res => {
				this.cities = res
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
						airportService
							.update(this.airport)
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
						airportService
							.create(this.airport)
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
