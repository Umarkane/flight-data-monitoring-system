<template>
	<fdm-modal @close="$emit('close')">
		<div
			slot="content"
			class="create"
		>
			<div class="create__head">
				{{ isEdit ? 'Edit airline' : 'Add new airline' }}
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
							v-model="airline.title"
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
						:class="{ error: errors.has('country') }"
					>
						<label for="country">Country</label>
						<select
							id="country"
							v-model="airline.country"
							v-validate="'required'"
							name="country"
						>
							<option
								v-for="country in countries"
								:key="country.id"
								:value="country.id"
							>
								{{ country.title }}
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
import { airlinesService } from '@/_services/airlines.service'
import { countriesService } from '../../_services/countries.service'
import { mapActions } from 'vuex'

export default {
	name: 'AirlineCreate',
	components: { FdmModal },
	props: {
		isEdit: { type: Boolean, default: false },
		editAirline: { type: Object, default: () => ({}) },
	},
	data () {
		return {
			airline: {},
			countries: []
		}
	},
	mounted () {
		if (this.isEdit) this.airline = { ...this.editAirline }
		this.fetchCountries()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchCountries () {
			this.setLoading(true)
			countriesService.getAll().then(res => {
				this.countries = res
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
						airlinesService
							.update(this.airline)
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
						airlinesService
							.create(this.airline)
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
