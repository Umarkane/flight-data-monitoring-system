<template>
	<div class="navbar home__body">
		<div class="home__body__head">
			<span>Navbars</span>
			<button @click="onCreate" class="flex-align-center">
				<img src="../../assets/icons/add.svg" alt="" /> Add new navbar
			</button>
		</div>
		<div class="home__body__main">
			<fdm-table>
				<template slot="head">
					<tr>
						<th class="id">ID</th>
						<th>Title</th>
						<th>Code</th>
						<th>Href</th>
						<th>Icon</th>
						<th></th>
						<th></th>
					</tr>
				</template>
				<template slot="body">
					<tr v-for="(item, index) in navbars" :key="item.id">
						<td class="id">{{ index + 1 }}</td>
						<td>{{ item.title }}</td>
						<td>{{ item.code }}</td>
						<td>{{ item.href }}</td>
						<td>{{ item.icon }}</td>
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
		<navbar-create
			v-if="isCreate"
			:isEdit="isEdit"
			:edit-navbar="navbar"
			@close="isCreate = false"
			@fetch="fetchNavbars"
		></navbar-create>

		<modal-delete v-if="isDelete" @close="isDelete = false" @delete="deleteNavbar">
		</modal-delete>
	</div>
</template>

<script>
import FdmTable from '../../components/FdmTable.vue';
import { navbarService } from '@/_services/navbar.service';
import ModalDelete from '../../components/ModalDelete.vue';
import {mapActions} from "vuex";
import NavbarCreate from "../../components/super-admin/NavbarCreate";

export default {
	components: {NavbarCreate, FdmTable, ModalDelete },
	name: 'Navbar',
	data() {
		return {
			isCreate: false,
			navbars: [],
			navbar: {},
			isEdit: false,
			isDelete: false,
			deleteId: 0,
		};
	},
	mounted() {
		this.fetchNavbars();
	},
	methods: {
		...mapActions('loader', ['setLoading']),
		fetchNavbars() {
			this.setLoading(true)
			navbarService
				.getAll()
				.then((res) => {
					this.setLoading(false)
					this.navbars = res;
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
			this.navbar = item;
		},
		onDelete(id) {
			this.isDelete = true;
			this.deleteId = id;
		},
		deleteNavbar() {
			this.setLoading(true)
			navbarService
				.delete(this.deleteId)
				.then(() => {
					this.setLoading(false)
					this.fetchNavbars();
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
