<template>
	<div class="country home__body">
		<div class="home__body__head">
			<span>Airport</span>
			<button @click="onCreate" class="flex-align-center">
				<img src="../../assets/icons/add.svg" alt="" /> Add new airport
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
					<tr v-for="(item, index) in airports" :key="item.id">
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
		<airport-create
			v-if="isCreate"
			:isEdit="isEdit"
			:edit-airport="airport"
			@close="isCreate = false"
			@fetch="fetchAirport"
		></airport-create>

		<modal-delete v-if="isDelete" @close="isDelete = false" @delete="deleteAirport">
		</modal-delete>
	</div>
</template>

<script>
	import FdmTable from '../../components/FdmTable.vue';
	import { airportService } from "../../_services/airport.service";
	import ModalDelete from '../../components/ModalDelete.vue';
	import {mapActions} from "vuex";
	import AirportCreate from "../../components/super-admin/AirportCreate";

	export default {
		components: { AirportCreate, FdmTable, ModalDelete },
		name: 'Country',
		data() {
			return {
				isCreate: false,
				airports: [],
				airport: {},
				isEdit: false,
				isDelete: false,
				deleteId: 0,
			};
		},
		mounted() {
			this.fetchAirport();
		},
		methods: {
			...mapActions('loader', ['setLoading']),
			fetchAirport() {
				this.setLoading(true)
				airportService
					.getAll()
					.then((res) => {
						this.setLoading(false)
						this.airports = res;
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
				this.airport = item;
			},
			onDelete(id) {
				this.isDelete = true;
				this.deleteId = id;
			},
			deleteAirport() {
				this.setLoading(true)
				airportService
					.delete(this.deleteId)
					.then(() => {
						this.setLoading(false)
						this.fetchAirport();
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
