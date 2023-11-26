<template>
	<fdm-modal @close="$emit('close')">
		<div slot="content" class="create">
			<div class="create__head">{{ isEdit ? 'Edit country' : 'Add new country' }}</div>
			<div class="create__body">
				<form class="form" @submit.prevent="onSubmit">
					<div class="form__row" :class="{ error: errors.has('title') }">
						<label for="title">Title</label>
						<input
							type="text"
							name="title"
							v-validate="'required'"
							id="title"
							v-model="country.title"
						/>
						<template v-if="errors.length">
							<img src="../../assets/icons/error.svg" alt="" />
							<span>Required field</span>
						</template>
					</div>
					<div class="form__row" :class="{ error: errors.has('short') }">
						<label for="shortTitle">Short title</label>
						<input
							name="short"
							v-validate="'required'"
							type="text"
							id="shortTitle"
							v-model="country.short_title"
						/>
						<template v-if="errors.length">
							<img src="../../assets/icons/error.svg" alt="" />
							<span>Required field</span>
						</template>
					</div>
					<div class="form__submit flex-justify-between">
						<button type="submit">ADD</button>
						<button type="cancel" class="black" @click="$emit('close')">
							DECLINE
						</button>
					</div>
				</form>
			</div>
		</div>
	</fdm-modal>
</template>

<script>
	import FdmModal from '../FdmModal.vue';
	import { countriesService } from '@/_services/countries.service';

	export default {
		name: 'CountryCreate',
		components: { FdmModal },
		props: {
			isEdit: { type: Boolean, default: false },
			editCountry: { type: Object, default: () => ({}) },
		},
		data() {
			return {
				country: {},
			};
		},
		mounted() {
			if (this.isEdit) this.country = {...this.editCountry};
		},
		methods: {
			onSubmit() {
				this.$validator.validate().then((valid) => {
					if (valid) {
						if (this.isEdit) {
							countriesService
								.update(this.country)
								.then(() => {
									this.$toastr.s(this.$t('successMessageEdit'))
									this.$emit('fetch');
									this.$emit('close');
								})
								.catch((err) => {
									this.$toastr.e(err)
									console.log(err);
								});
						} else {
							countriesService
								.create(this.country)
								.then(() => {
									this.$emit('fetch');
									this.$emit('close');
									this.$toastr.s(this.$t('successMessageCreate'))
								})
								.catch((err) => {
									console.log(err);
									this.$toastr.e(err)
								});
						}
					}
				});
			},
		},
	};
</script>

<style></style>
