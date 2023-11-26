<template>
	<fdm-modal @close="$emit('close')">
		<div slot="content" class="create">
			<div class="create__head">{{ isEdit ? 'Edit permission' : 'Add new permission' }}</div>
			<div class="create__body">
				<form class="form" @submit.prevent="onSubmit">
					<div class="form__row" :class="{ error: errors.has('title') }">
						<label for="title">Title</label>
						<input
							type="text"
							name="title"
							v-validate="'required'"
							id="title"
							v-model="permission.title"
						/>
						<template v-if="errors.length">
							<img src="../../assets/icons/error.svg" alt="" />
							<span>Required field</span>
						</template>
					</div>
					<div class="form__row" :class="{ error: errors.has('code') }">
						<label for="code">Code</label>
						<input
							type="text"
							name="code"
							v-validate="'required'"
							id="code"
							v-model="permission.code"
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
	import { permissionService } from '@/_services/permission.service';

	export default {
		name: 'PermissionCreate',
		components: { FdmModal },
		props: {
			isEdit: { type: Boolean, default: false },
			editPermission: { type: Object, default: () => ({}) },
		},
		data() {
			return {
				permission: {},
			};
		},
		mounted() {
			if (this.isEdit) this.permission = {...this.editPermission};
		},
		methods: {
			onSubmit() {
				this.$validator.validate().then((valid) => {
					if (valid) {
						if (this.isEdit) {
							permissionService
								.update(this.permission)
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
							permissionService
								.create(this.permission)
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
