<template>
	<fdm-modal @close="$emit('close')">
		<div
			slot="content"
			class="create"
		>
			<div class="create__head">
				{{ isEdit ? 'Edit role' : 'Add new role' }}
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
							v-model="role.title"
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
						:class="{ error: errors.has('code') }"
					>
						<label for="code">Code</label>
						<input
							id="code"
							v-model="role.code"
							v-validate="'required'"
							type="text"
							name="code"
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
						:class="{ error: errors.has('permission') }"
					>
						<label for="permission">Permission</label>
						<fdm-select
							id="permission"
							:is-multiple="true"
							:has-error="isPermissionEmpty"
							:options="permissions"
							:multiple-selected-ids="permissionIds"
							@multipleSelect="onPermission"
						/>
					</div>
					<div
						class="form__row"
						:class="{ error: errors.has('sidebar') }"
					>
						<label for="sidebar">Navbar</label>
						<fdm-select
							id="sidebar"
							:options="sidebars"
							:has-error="isSidebarEmpty"
							:multiple-selected-ids="sidebarIds"
							:is-multiple="true"
							@multipleSelect="onSidebars"
						/>
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
import { roleService } from '@/_services/role.service'
import { permissionService } from '../../_services/permission.service'
import { rolePermissionService } from '../../_services/role-permission.service'
import { roleNavbarService } from '../../_services/role-navbar.service'
import { navbarService } from '../../_services/navbar.service'
import FdmSelect from '../FdmSelect'
import { mapActions } from 'vuex'

export default {
	name: 'RoleCreate',
	components: { FdmSelect, FdmModal },
	props: {
		isEdit: { type: Boolean, default: false },
		editRole: { type: Object, default: () => ({}) },
		rolePermissions: { type: Array, default: () => ([]) },
		roleSidebars: { type: Array, default: () => ([]) },
	},
	data () {
		return {
			role: {},
			permissions: [],
			sidebars: [],
			permissionIds: [],
			sidebarIds: [],
			isPermissionEmpty: false,
			isSidebarEmpty: false
		}
	},
	mounted () {
		if (this.isEdit) {
			this.role = { ...this.editRole }
			this.sidebarIds = this.roleSidebars.map(i => i.navbar)
			this.permissionIds = this.rolePermissions.map(i => i.permission)
		}
		this.fetchData()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchData () {
			this.setLoading(true)
			permissionService.getAll().then(res => {
				this.permissions = res
				return navbarService.getAll()
			}).then(res => {
				this.sidebars = res
				this.setLoading(false)
			}).catch(err => {
				this.setLoading(false)
				console.log(err)
			})
		},
		onSubmit () {
			this.$validator.validate().then(valid => {
				if (valid && this.sidebarIds.length && this.sidebarIds.length) {
					if (this.isEdit) {
						roleService
							.update(this.role)
							.then(async res => {
								const deleteRolePermissions = this.rolePermissions.filter(i => !this.permissionIds.includes(i.permission)).map(i => i.id)
								const createRolePermissions = this.permissionIds.filter(i => !this.rolePermissions.map(j => j.permission).includes(i))
								for (const permissionId of deleteRolePermissions) {
									await rolePermissionService.delete(permissionId)
								}
								for (const permissionId of createRolePermissions) {
									const data = { role: res.id, permission: permissionId }
									await rolePermissionService.create(data)
								}
								const deleteRoleSidebars = this.roleSidebars.filter(i => !this.sidebarIds.includes(i.navbar)).map(i => i.id)
								const createRoleSidebars = this.sidebarIds.filter(i => !this.roleSidebars.map(j => j.navbar).includes(i))
								for (const sidebarId of deleteRoleSidebars) {
									await roleNavbarService.delete(sidebarId)
								}
								for (const sidebarId of createRoleSidebars) {
									const data = { role: res.id, navbar: sidebarId }
									await roleNavbarService.create(data)
								}
							}).then(() => {
								this.$toastr.s(this.$t('successMessageEdit'))
								this.$emit('fetch')
								this.$emit('close')
							})
							.catch(err => {
								this.$toastr.e(err)
								console.log(err)
							})
					} else {
						roleService
							.create(this.role)
							.then(async res => {
								for (const permissionId of this.permissionIds) {
									const data = { role: res.id, permission: permissionId }
									await rolePermissionService.create(data)
								}
								for (const sidebarId of this.sidebarIds) {
									const data = { role: res.id, navbar: sidebarId }
									await roleNavbarService.create(data)
								}
							})
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
		onPermission (ids) {
			this.permissionIds = ids
			this.isPermissionEmpty = !this.permissionIds.length
		},
		onSidebars (ids) {
			this.sidebarIds = ids
			this.isSidebarEmpty = !this.sidebarIds.length
		}
	},
}
</script>

<style></style>
