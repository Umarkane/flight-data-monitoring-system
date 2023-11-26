<template>
	<fdm-modal @close="$emit('close')">
		<div
			slot="content"
			class="create"
		>
			<div class="create__head">
				{{ isEdit ? 'Edit aircraft' : 'Add new aircraft' }}
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
							v-model="aircraft.title"
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
						:class="{ error: errors.has('reg_number') }"
					>
						<label for="reg_number">Registration No</label>
						<input
							id="reg_number"
							v-model="aircraft.reg_number"
							v-validate="'required'"
							type="text"
							name="reg_number"
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
						:class="{ error: errors.has('serial_no') }"
					>
						<label for="serial_no">Vin</label>
						<input
							id="serial_no"
							v-model="aircraft.serial_no"
							v-validate="'required'"
							type="text"
							name="serial_no"
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
						:class="{ error: errors.has('engine') }"
					>
						<label for="engine">Engine</label>
						<input
							id="engine"
							v-model="aircraft.engine"
							v-validate="'required'"
							type="text"
							name="engine"
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
						:class="{ error: errors.has('model') }"
					>
						<label for="model">Aircraft model</label>
						<select
							id="model"
							v-model="aircraft.aircraft_model"
							v-validate="'required'"
							name="model"
						>
							<option
								v-for="model in models"
								:key="model.id"
								:value="model.id"
							>
								{{ model.title }}
							</option>
						</select>
					</div>
					<div
						class="form__row"
						:class="{ error: errors.has('airline') }"
					>
						<label for="airline">Airline</label>
						<select
							id="airline"
							v-model="aircraft.airline"
							v-validate="'required'"
							name="airline"
						>
							<option
								v-for="item in airlines"
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
import { aircraftService } from '../../_services/aircraft.service'
import { aircraftModelService } from '../../_services/aircraft-model.service'
import { airlinesService } from '../../_services/airlines.service'
import { mapActions } from 'vuex'

export default {
	name: 'AircraftCreate',
	components: { FdmModal },
	props: {
		isEdit: { type: Boolean, default: false },
		editAircraft: { type: Object, default: () => ({}) },
	},
	data () {
		return {
			aircraft: {},
			airlines: [],
			models: []
		}
	},
	mounted () {
		if (this.isEdit) this.aircraft = { ...this.editAircraft }
		this.fetchModels()
		this.fetchAirlines()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchModels () {
			this.setLoading(true)
			aircraftModelService.getAll().then(res => {
				this.models = res
				this.setLoading(false)
			}).catch(err => {
				this.setLoading(false)
				console.log(err)
				this.$toastr.e(err)
			})
		},
		fetchAirlines () {
			this.setLoading(true)
			airlinesService.getAll().then(res => {
				this.airlines = res
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
						aircraftService
							.update(this.aircraft)
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
						aircraftService
							.create(this.aircraft)
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
