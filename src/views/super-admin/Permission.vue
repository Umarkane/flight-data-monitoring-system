<template>
	<div class="country home__body">
		<div class="home__body__head">
			<span>Permissions</span>
			<button @click="onCreate" class="flex-align-center">
				<img src="../../assets/icons/add.svg" alt="" /> Add new permission
			</button>
		</div>
		<div class="home__body__main">
			<fdm-table>
				<template slot="head">
					<tr>
						<th class="id">ID</th>
						<th>Title</th>
						<th></th>
						<th></th>
					</tr>
				</template>
				<template slot="body">
					<tr v-for="(item, index) in permissions" :key="item.id">
						<td class="id">{{ index + 1 }}</td>
						<td>{{ item.title }}</td>
						<td>
							<img
								@click="onEdit(item)"
								class="pointer"
								src="../../assets/icons/edit.svg"
								alt=""
							/>
						</td>
						<td>
							<img
								@click="onDelete(item.id)"
								class="pointer"
								src="../../assets/icons/delete.svg"
								alt=""
							/>
						</td>
					</tr>
				</template>
			</fdm-table>
		</div>
		<permission-create
			v-if="isCreate"
			:isEdit="isEdit"
			:editPermission="permission"
			@close="isCreate = false"
			@fetch="fetchPermissions"
		></permission-create>

		<modal-delete v-if="isDelete" @close="isDelete = false" @delete="deletePermission">
		</modal-delete>
	</div>
</template>

<script>
	import FdmTable from '../../components/FdmTable.vue';
	import { permissionService } from '@/_services/permission.service';
	import ModalDelete from '../../components/ModalDelete.vue';
	import {mapActions} from "vuex";
	import PermissionCreate from "../../components/super-admin/PermissionCreate";

	export default {
		components: {PermissionCreate, FdmTable, ModalDelete },
		name: 'Country',
		data() {
			return {
				isCreate: false,
				permissions: [],
				permission: {},
				isEdit: false,
				isDelete: false,
				deleteId: 0,
			};
		},
		mounted() {
			this.fetchPermissions();
		},
		methods: {
			...mapActions('loader', ['setLoading']),
			fetchPermissions() {
				this.setLoading(true)
				permissionService
					.getAll()
					.then((res) => {
						this.setLoading(false)
						this.permissions = res;
					})
					.catch((err) => {
						this.setLoading(false)
						console.log(err);
					});
			},
			onCreate() {
				this.isEdit = false;
				this.isCreate = true;
			},
			onEdit(item) {
				this.isCreate = true;
				this.isEdit = true;
				this.permission = item;
			},
			onDelete(id) {
				this.isDelete = true;
				this.deleteId = id;
			},
			deletePermission() {
				this.setLoading(true)
				permissionService
					.delete(this.deleteId)
					.then(() => {
						this.setLoading(false)
						this.fetchPermissions();
						this.isDelete = false;
						this.$toastr.s(this.$t('successMessageDelete'))
					})
					.catch((err) => {
						this.setLoading(false)
						this.$toastr.e(err)
						console.log(err);
					});
			},
		},
	};
</script>

<style></style>
