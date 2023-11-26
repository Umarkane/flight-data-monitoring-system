<template>
	<fdm-modal @close="$emit('close')">
		<div
			slot="content"
			class="create"
		>
			<div class="create__head">
				{{ isEdit ? 'Edit technician' : 'Add new technician' }}
			</div>
			<div class="create__body">
				<form
					class="form"
					@submit.prevent="onSubmit"
				>
					<div class="flex-gap">
						<div
							class="form__row"
							:class="{ error: errors.has('lastname') }"
						>
							<label for="lastname">Surname</label>
							<input
								id="lastname"
								v-model="user.last_name"
								v-validate="'required'"
								type="text"
								name="lastname"
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
							:class="{ error: errors.has('firstname') }"
						>
							<label for="firstname">Name</label>
							<input
								id="firstname"
								v-model="user.first_name"
								v-validate="'required'"
								type="text"
								name="firstname"
							>
							<template v-if="errors.length">
								<img
									src="../../assets/icons/error.svg"
									alt=""
								>
								<span>Required field</span>
							</template>
						</div>
					</div>
					<div class="flex-gap">
						<div
							class="form__row"
							:class="{ error: errors.has('username') }"
						>
							<label for="username">Username</label>
							<input
								id="username"
								v-model="user.username"
								v-validate="'required'"
								type="text"
								name="username"
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
							:class="{ error: errors.has('email') }"
						>
							<label for="email">Email</label>
							<input
								id="email"
								v-model="user.email"
								v-validate="'required'"
								type="email"
								name="email"
							>
							<template v-if="errors.length">
								<img
									src="../../assets/icons/error.svg"
									alt=""
								>
								<span>Required field</span>
							</template>
						</div>
					</div>
					<div class="flex-gap">
						<div
							class="form__row"
							:class="{ error: errors.has('password') }"
						>
							<label for="password">Password</label>
							<input
								id="password"
								v-model="user.password"
								v-validate="{'required' : !isEdit}"
								type="password"
								name="password"
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
							:class="{ error: errors.has('avatar') }"
						>
							<label for="avatar">Avatar</label>
							
							<input
								style="opacity: 0"
								id="avatar"
								v-validate="{ 'required' : false }"
								type="file"
								name="avatar"
								@change="onFileSelect"
							>
							<div class="form__row__file flex-center">{{ avatar.name || 'Choose image' | crop }}</div>
							<template v-if="errors.length">
								<img
									src="../../assets/icons/error.svg"
									alt=""
								>
								<span>Required field</span>
							</template>
						</div>
					</div>
					
					<div class="form__submit flex-justify-center flex-gap">
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
import { roleService } from '../../_services/role.service'
import { userService } from '../../_services/user.service'
import { usersService } from '../../_services/users.service'

export default {
	name: 'TechnicianCreate',
	components: { FdmModal },
	props: {
		isEdit: { type: Boolean, default: false },
		editUser: { type: Object, default: () => ({}) },
	},
	data () {
		return {
			user: {},
			airlines: [],
			avatar: {},
			roles: []
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	mounted () {
		if (this.isEdit) this.user = { ...this.editUser }
		this.fetchAirlines()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchAirlines () {
			this.setLoading(true)
			airlinesService.getAll().then(res => {
				this.airlines = res
				return roleService.getAll()
			}).then(res => {
				this.roles = res
				this.setLoading(false)
			}).catch(err => {
				this.setLoading(false)
				console.log(err)
				this.$toastr.e(err)
			})
		},
		onFileSelect (event) {
			this.avatar = event.target.files[0]
		},
		onSubmit () {
			this.$validator.validate().then(valid => {
				if (valid) {
					this.user.airline = this.userProfile.user.airline[0]
					this.user.avatar = this.avatar
					if (this.isEdit) {
						usersService
							.update(this.user)
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
						const roleTechnician = this.roles.find(i => i.code === 'ROLE_TECHNICIAN')
						if (roleTechnician) this.user.role = roleTechnician.id
						else {
							this.$toastr.e('Please add ROLE_TECHNICIAN')
							return
						}
						userService
							.register(this.user)
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
