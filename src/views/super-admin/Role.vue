<template>
	<div class="country home__body">
		<div class="home__body__head">
			<span>Role</span>
			<button
				class="flex-align-center"
				@click="onCreate"
			>
				<img
					src="../../assets/icons/add.svg"
					alt=""
				> Add new role
			</button>
		</div>
		<div class="home__body__main">
			<fdm-table>
				<template slot="head">
					<tr>
						<th class="id">
							ID
						</th>
						<th>Title</th>
						<th />
						<th />
					</tr>
				</template>
				<template slot="body">
					<tr
						v-for="(item, index) in roles"
						:key="item.id"
					>
						<td class="id">
							{{ index + 1 }}
						</td>
						<td>{{ item.title }}</td>
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
		<role-create
			v-if="isCreate"
			:is-edit="isEdit"
			:edit-role="role"
			:role-permissions="rolePermissions"
			:role-sidebars="roleSidebars"
			@close="isCreate = false"
			@fetch="fetchRoles"
		/>

		<modal-delete
			v-if="isDelete"
			@close="isDelete = false"
			@delete="deleteRole"
		/>
	</div>
</template>

<script>
import FdmTable from '../../components/FdmTable.vue'
import { roleService } from '@/_services/role.service'
import ModalDelete from '../../components/ModalDelete.vue'
import { mapActions } from 'vuex'
import RoleCreate from '../../components/super-admin/RoleCreate'
import { rolePermissionService } from '../../_services/role-permission.service'
import { roleNavbarService } from '../../_services/role-navbar.service'

export default {
	name: 'Country',
	components: { RoleCreate, FdmTable, ModalDelete },
	data () {
		return {
			isCreate: false,
			roles: [],
			role: {},
			isEdit: false,
			isDelete: false,
			deleteId: 0,
			rolePermissions: [],
			roleSidebars: [],
		}
	},
	mounted () {
		this.fetchRoles()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchRoles () {
			this.setLoading(true)
			roleService
				.getAll()
				.then(res => {
					this.setLoading(false)
					this.roles = res
				})
				.catch(err => {
					this.setLoading(false)
					console.log(err)
				})
		},
		onCreate () {
			this.isEdit = false
			this.isCreate = true
		},
		onEdit (item) {
			this.fetchNavPermissions(item.id)
			this.role = item
		},
		onDelete (id) {
			this.isDelete = true
			this.deleteId = id
		},
		fetchNavPermissions (roleId) {
			this.setLoading(true)
			roleNavbarService.getAll(roleId).then(res => {
				this.roleSidebars = res
				return rolePermissionService.getAll(roleId)
			}).then(res => {
				this.rolePermissions = res
				this.isCreate = true
				this.isEdit = true
				this.setLoading(false)
			}).catch(err => {
				this.setLoading(false)
				this.$toastr.e(err)
				console.log(err)
			})
		},
		deleteRole () {
			this.setLoading(true)
			roleService
				.delete(this.deleteId)
				.then(() => {
					this.setLoading(false)
					this.fetchRoles()
					this.isDelete = false
					this.$toastr.s(this.$t('successMessageDelete'))
				})
				.catch(err => {
					this.setLoading(false)
					this.$toastr.e(err)
					console.log(err)
				})
		},
	},
}
</script>

<style></style>
