<template>
	<div class="country home__body">
		<div class="home__body__head">
			<span>Aircraft model</span>
			<button @click="onCreate" class="flex-align-center">
				<img src="../../assets/icons/add.svg" alt="" /> Add new aircraft model
			</button>
		</div>
		<div class="home__body__main">
			<fdm-table>
				<template slot="head">
					<tr>
						<th class="id">ID</th>
						<th>Title</th>
						<th>Code</th>
						<th></th>
						<th></th>
					</tr>
				</template>
				<template slot="body">
					<tr v-for="(item, index) in models" :key="item.id">
						<td class="id">{{ index + 1 }}</td>
						<td>{{ item.title }}</td>
						<td>{{ item.code }}</td>
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
		<aircraft-model-create
			v-if="isCreate"
			:isEdit="isEdit"
			:edit-model="model"
			@close="isCreate = false"
			@fetch="fetchModels"
		></aircraft-model-create>

		<modal-delete v-if="isDelete" @close="isDelete = false" @delete="deleteModel">
		</modal-delete>
	</div>
</template>

<script>
	import FdmTable from '../../components/FdmTable.vue';
	import { aircraftModelService } from "../../_services/aircraft-model.service";
	import ModalDelete from '../../components/ModalDelete.vue';
	import {mapActions} from "vuex";
	import AircraftModelCreate from "../../components/super-admin/AircraftModelCreate";

	export default {
		components: {AircraftModelCreate, FdmTable, ModalDelete },
		name: 'Country',
		data() {
			return {
				isCreate: false,
				models: [],
				model: {},
				isEdit: false,
				isDelete: false,
				deleteId: 0,
			};
		},
		mounted() {
			this.fetchModels();
		},
		methods: {
			...mapActions('loader', ['setLoading']),
			fetchModels() {
				this.setLoading(true)
				aircraftModelService
					.getAll()
					.then((res) => {
						this.setLoading(false)
						this.models = res;
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
				this.model = item;
			},
			onDelete(id) {
				this.isDelete = true;
				this.deleteId = id;
			},
			deleteModel() {
				this.setLoading(true)
				aircraftModelService
					.delete(this.deleteId)
					.then(() => {
						this.setLoading(false)
						this.fetchModels();
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
