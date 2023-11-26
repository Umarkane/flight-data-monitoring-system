<template>
	<fdm-modal @close="$emit('close')">
		<div
			slot="content"
			class="create"
		>
			<div class="create__head">
				{{ isEdit ? 'Edit aircraft model trigger' : 'Add new aircraft model trigger' }}
			</div>
			<div class="create__body">
				<form
					class="form"
					@submit.prevent="onSubmit"
				>
					<div
						class="form__row"
						:class="{ error: errors.has('aircraft_model') }"
					>
						<label for="aircraft_model">Aircraft model</label>
						<select
							id="aircraft_model"
							v-model="aircraftModelTrigger.aircraft_model"
							v-validate="'required'"
							name="aircraft_model"
						>
							<option
								v-for="model in aircraftModels"
								:key="model.id"
								:value="model.id"
							>
								{{ model.title }}
							</option>
						</select>
					</div>
					<div
						class="form__row"
						:class="{ error: errors.has('trigger') }"
					>
						<label for="trigger">Trigger</label>
						<select
							id="trigger"
							v-model="aircraftModelTrigger.trigger"
							v-validate="'required'"
							name="trigger"
						>
							<option
								v-for="trigger in triggers"
								:key="trigger.id"
								:value="trigger.id"
							>
								{{ trigger.title }}
							</option>
						</select>
					</div>
					<div
						class="form__row"
						:class="{ error: errors.has('low') }"
					>
						<label for="low">Low</label>
						<input
							id="low"
							v-model="aircraftModelTrigger.low"
							v-validate="'required'"
							type="text"
							name="low"
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
						:class="{ error: errors.has('medium') }"
					>
						<label for="medium">Medium</label>
						<input
							id="medium"
							v-model="aircraftModelTrigger.medium"
							v-validate="'required'"
							type="text"
							name="medium"
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
						:class="{ error: errors.has('high') }"
					>
						<label for="high">High</label>
						<input
							id="high"
							v-model="aircraftModelTrigger.high"
							v-validate="'required'"
							type="text"
							name="high"
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
						:class="{ error: errors.has('csv_position') }"
					>
						<label for="csv_position">CSV position</label>
						<input
							id="csv_position"
							v-model="aircraftModelTrigger.csv_position"
							v-validate="'required'"
							type="number"
							name="csv_position"
						>
						<template v-if="errors.length">
							<img
								src="../../assets/icons/error.svg"
								alt=""
							>
							<span>Required field</span>
						</template>
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
import { aircraftModelTriggerService } from '../../_services/aircraft-model-trigger.service'
import { mapActions } from 'vuex'
import { aircraftModelService } from '../../_services/aircraft-model.service'
import { triggerService } from '../../_services/trigger.service'

export default {
	name: 'AircraftModelTriggerCreate',
	components: { FdmModal },
	props: {
		isEdit: { type: Boolean, default: false },
		editModel: { type: Object, default: () => ({}) },
	},
	data () {
		return {
			aircraftModelTrigger: {},
			aircraftModels: [],
			triggers: []
		}
	},
	mounted () {
		if (this.isEdit) this.aircraftModelTrigger = { ...this.editModel }
		this.fetchData()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchData () {
			this.setLoading(true)
			aircraftModelService.getAll().then(res => {
				this.aircraftModels = res
				return triggerService.getAll()
			}).then(res => {
				this.triggers = res
				this.setLoading(false)
			}).catch(err => {
				console.log(err)
				this.setLoading(false)
				this.$toastr.e(err)
			})
		},
		onSubmit () {
			this.$validator.validate().then(valid => {
				if (valid) {
					if (this.isEdit) {
						aircraftModelTriggerService
							.update(this.aircraftModelTrigger)
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
						aircraftModelTriggerService
							.create(this.aircraftModelTrigger)
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

<style lang="scss">
	.checkbox {
		width: auto;
	}
</style>
