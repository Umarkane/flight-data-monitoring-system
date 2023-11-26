<template>
	<fdm-modal @close="$emit('close')">
		<div
			slot="content"
			class="create"
		>
			<div class="create__head flex-justify-between flex-align-center">
				<span>My Profile</span>
				<div
					v-if="user.avatar"
					:style="`background-image: url(${user.avatar})`"
					alt=""
					class="avatar"
				></div>
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
									src="../assets/icons/error.svg"
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
									src="../assets/icons/error.svg"
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
									src="../assets/icons/error.svg"
									alt=""
								>
								<span>Required field</span>
							</template>
						</div>
						<div
							class="form__row"
							:class="{ error: errors.has('password') }"
						>
							<label for="password">Password</label>
							<input
								id="password"
								v-model="user.password"
								v-validate="{ 'required' : false }"
								type="password"
								name="password"
							>
							<template v-if="errors.length">
								<img
									src="../assets/icons/error.svg"
									alt=""
								>
								<span>Required field</span>
							</template>
						</div>
					</div>
					<div class="flex-gap">
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
									src="../assets/icons/error.svg"
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
								type="file"
								name="avatar"
								@change="onFileSelect"
							>
							<div class="form__row__file flex-center">{{ avatar.name || 'Choose image' | crop }}</div>
							<template v-if="errors.length">
								<img
									src="../assets/icons/error.svg"
									alt=""
								>
								<span>Required field</span>
							</template>
						</div>
					</div>
					<div class="form__submit flex-center gap-20 mt20">
						<button type="submit">
							SAVE
						</button>
						<button
							type="reset"
							class="black"
							@click="$emit('close')"
						>
							CLOSE
						</button>
					</div>
				</form>
			</div>
		</div>
	</fdm-modal>
</template>

<script>
import FdmModal from './FdmModal'
import { mapActions } from 'vuex'
import { usersService } from '../_services/users.service'
export default {
	name: 'Profile',
	components: { FdmModal },
	data () {
		return {
			user: {},
			avatar: {}
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	mounted () {
		const val = this.userProfile.user
		this.user = {
			first_name: val.first_name,
			last_name: val.last_name,
			username: val.username,
			email: val.email,
			id: val.id,
			avatar: val.avatar
		}
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		onFileSelect (event) {
			this.avatar = event.target.files[0]
		},
		onSubmit () {
			this.$validator.validate().then(valid => {
				if (valid) {
					this.setLoading(true)
					this.user.avatar = this.avatar
					usersService.update(this.user).then(res => {
						const data = {
							token: this.userProfile.token,
							user: res
						}
						this.user.avatar = res.avatar
						this.$store.commit('account/SET_USER', data)
						this.setLoading(false)
						this.$toastr.s(this.$t('successMessageEdit'))
					}).catch(err => {
						console.log(err)
						this.setLoading(false)
						this.$toastr.e(err)
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>

</style>