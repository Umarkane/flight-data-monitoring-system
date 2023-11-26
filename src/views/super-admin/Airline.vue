<template>
	<div class="country home__body">
		<div class="home__body__head">
			<span>Airline</span>
			<button @click="onCreate" class="flex-align-center">
				<img src="../../assets/icons/add.svg" alt="" /> Add new airline
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
					<tr v-for="(item, index) in airlines" :key="item.id">
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
		<airline-create
			v-if="isCreate"
			:isEdit="isEdit"
			:edit-airline="airline"
			@close="isCreate = false"
			@fetch="fetchAirlines"
		></airline-create>

		<modal-delete v-if="isDelete" @close="isDelete = false" @delete="deleteAirline">
		</modal-delete>
	</div>
</template>

<script>
	import FdmTable from '../../components/FdmTable.vue';
	import { airlinesService } from '@/_services/airlines.service';
	import ModalDelete from '../../components/ModalDelete.vue';
	import {mapActions} from "vuex";
	import AirlineCreate from "../../components/super-admin/AirlinesCreate";

	export default {
		components: {AirlineCreate, FdmTable, ModalDelete },
		name: 'Country',
		data() {
			return {
				isCreate: false,
				airlines: [],
				airline: {},
				isEdit: false,
				isDelete: false,
				deleteId: 0,
			};
		},
		mounted() {
			this.fetchAirlines();
		},
		methods: {
			...mapActions('loader', ['setLoading']),
			fetchAirlines() {
				this.setLoading(true)
				airlinesService
					.getAll()
					.then((res) => {
						this.setLoading(false)
						this.airlines = res;
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
				this.airline = item;
			},
			onDelete(id) {
				this.isDelete = true;
				this.deleteId = id;
			},
			deleteAirline() {
				this.setLoading(true)
				airlinesService
					.delete(this.deleteId)
					.then(() => {
						this.setLoading(false)
						this.fetchAirlines();
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
