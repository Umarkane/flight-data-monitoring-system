<template>
	<fdm-modal
		:auto-height="true"
		@close="$emit('close')"
	>
		<div
			slot="content"
			class="create"
		>
			<div class="create__head">
				{{ isEdit ? 'Edit trigger' : 'Add new trigger' }}
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
							v-model="trigger.title"
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
import { triggerService } from '../../_services/trigger.service'
import { mapActions } from 'vuex'

export default {
	name: 'TriggerCreate',
	components: { FdmModal },
	props: {
		isEdit: { type: Boolean, default: false },
		editTrigger: { type: Object, default: () => ({}) },
	},
	data () {
		return {
			trigger: {},
		}
	},
	mounted () {
		if (this.isEdit) this.trigger = { ...this.editTrigger }
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		onSubmit () {
			this.$validator.validate().then(valid => {
				if (valid) {
					if (this.isEdit) {
						triggerService
							.update(this.trigger)
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
						triggerService
							.create(this.trigger)
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
