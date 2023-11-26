<template>
	<div class="home__body">
		<div class="home__body__head">
			<span>Technician Users</span>
			<button
				class="flex-align-center"
				@click="onCreate"
			>
				<img
					src="../../assets/icons/add.svg"
					alt=""
				> Add new user
			</button>
		</div>
		<div class="home__body__users">
			<fdm-table>
				<template slot="head">
					<tr>
						<th class="id">
							ID
						</th>
						<th>Name Surname</th>
						<th>Username</th>
						<!--						<th>Password</th>-->
						<th>Email</th>
						<th />
						<th />
					</tr>
				</template>
				<template slot="body">
					<tr
						v-for="(item, i) in users"
						:key="item.id"
					>
						<td class="id">
							{{ i + 1 }}
						</td>
						<td>{{ item.first_name }} {{ item.last_name }}</td>
						<td>{{ item.username }}</td>
						<!--						<td>{{ item.password }}</td>-->
						<td>{{ item.email }}</td>
						<td>
							<img
								class="pointer"
								src="../../assets/icons/edit.svg"
								alt=""
								@click="onEdit(item)"
							>
						</td>
						<td>
							<img
								class="pointer"
								src="../../assets/icons/delete.svg"
								alt=""
								@click="onDelete(item.id)"
							>
						</td>
					</tr>
				</template>
			</fdm-table>
		</div>
		<technician-create
			v-if="isCreate"
			:edit-user="user"
			:is-edit="isEdit"
			@close="isCreate = false"
			@fetch="fetchUsers"
		/>
		<modal-delete
			v-if="isDelete"
			@close="isDelete = false"
			@delete="deleteUser"
		/>
	</div>
</template>

<script>
import FdmTable from '@/components/FdmTable'
import TechnicianCreate from '../../components/admin/TechnicianCreate'
import ModalDelete from '../../components/ModalDelete'
import { usersService } from '../../_services/users.service'
import { roleService } from '../../_services/role.service'
import { mapActions } from 'vuex'
export default {
	name: 'Home',
	components: {
		ModalDelete,
		TechnicianCreate,
		FdmTable,
	},
	data () {
		return {
			user: {},
			users: [],
			isCreate: false,
			isEdit: false,
			deleteId: 0,
			isDelete: false,
			roles: [],
			role: {}
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	mounted () {
		this.fetchRoles()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchRoles () {
			roleService.getAll().then(res => {
				this.roles = res
				this.role = this.roles.find(i => i.code === 'ROLE_TECHNICIAN')
				this.fetchUsers()
			}).catch(err => {
				console.log(err)
			})
		},
		fetchUsers () {
			usersService.getAll(this.role.id,this.userProfile.user.airline[0]).then(res => {
				this.users = res
			}).catch(err => {
				console.log(err)
			})
		},
		onCreate () {
			this.isCreate = true
			this.isEdit = false
		},
		onEdit (item) {
			this.isCreate = true
			this.isEdit = true
			this.user = item
		},
		onDelete (id) {
			this.isDelete = true
			this.deleteId = id
		},
		deleteUser () {
			this.setLoading(true)
			usersService.delete(this.deleteId).then(_ => {
				this.setLoading(false)
				this.$toastr.s(this.$t('successMessageDelete'))
				this.isDelete = false
				this.fetchUsers()
			}).catch(err => {
				console.log(err)
				this.setLoading(false)
				this.$toastr.e(err)
			})
		}
	},
}
</script>
<style lang="scss">
	.home {
		&__body {
			&__users {
				margin-top: 16px;
				margin-bottom: 40px;
			}
		}
	}
</style>
