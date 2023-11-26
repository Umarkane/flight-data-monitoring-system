<template>
	<fdm-modal @close="$emit('close')">
		<div slot="content" class="create">
			<div class="create__head">{{ isEdit ? 'Edit navbar' : 'Add new navber' }}</div>
			<div class="create__body">
				<form class="form" @submit.prevent="onSubmit">
					<div class="form__row" :class="{ error: errors.has('title') }">
						<label for="title">Title</label>
						<input
							type="text"
							name="title"
							v-validate="'required'"
							id="title"
							v-model="navbar.title"
						/>
						<template v-if="errors.length">
							<img src="../../assets/icons/error.svg" alt="" />
							<span>Required field</span>
						</template>
					</div>
					<div class="form__row" :class="{ error: errors.has('code') }">
						<label for="code">Code</label>
						<input
							name="code"
							v-validate="'required'"
							type="text"
							id="code"
							v-model="navbar.code"
						/>
						<template v-if="errors.length">
							<img src="../../assets/icons/error.svg" alt="" />
							<span>Required field</span>
						</template>
					</div>
					<div class="form__row" :class="{ error: errors.has('href') }">
						<label for="href">Href</label>
						<input
							name="href"
							v-validate="'required'"
							type="text"
							id="href"
							v-model="navbar.href"
						/>
						<template v-if="errors.length">
							<img src="../../assets/icons/error.svg" alt="" />
							<span>Required field</span>
						</template>
					</div>
					<div class="form__row" :class="{ error: errors.has('icon') }">
						<label for="code">Icon</label>
						<input
							name="icon"
							v-validate="'required'"
							type="text"
							id="icon"
							v-model="navbar.icon"
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
import { navbarService } from '@/_services/navbar.service';
import {mapActions} from "vuex";

export default {
	name: 'NavbarCreate',
	components: {FdmModal },
	props: {
		isEdit: { type: Boolean, default: false },
		editNavbar: { type: Object, default: () => ({}) },
	},
	data() {
		return {
			navbar: {}
		};
	},
	mounted() {
		if (this.isEdit) this.navbar = {...this.editNavbar};
	},
	methods: {
		...mapActions('loader', ['setLoading']),
		onSubmit() {
			this.$validator.validate().then((valid) => {
				if (valid) {
					if (this.isEdit) {
						navbarService
							.update(this.navbar)
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
						navbarService
							.create(this.navbar)
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
