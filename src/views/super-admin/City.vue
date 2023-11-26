<template>
	<div class="city home__body">
		<div class="home__body__head">
			<span>Cities</span>
			<button @click="onCreate" class="flex-align-center">
				<img src="../../assets/icons/add.svg" alt="" /> Add new city
			</button>
		</div>
		<div class="home__body__main">
			<fdm-table>
				<template slot="head">
					<tr>
						<th class="id">ID</th>
						<th>Title</th>
						<th>Short title</th>
						<th></th>
						<th></th>
					</tr>
				</template>
				<template slot="body">
					<tr v-for="(item, index) in cities" :key="item.id">
						<td class="id">{{ index + 1 }}</td>
						<td>{{ item.title }}</td>
						<td>{{ item.short_title }}</td>
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
		<city-create
			v-if="isCreate"
			:isEdit="isEdit"
			:editCity="city"
			@close="isCreate = false"
			@fetch="fetchCity"
		></city-create>

		<modal-delete v-if="isDelete" @close="isDelete = false" @delete="deleteCity">
		</modal-delete>
	</div>
</template>

<script>
import FdmTable from '../../components/FdmTable.vue';
import { cityService } from '@/_services/city.service';
import ModalDelete from '../../components/ModalDelete.vue';
import {mapActions} from "vuex";
import CityCreate from "../../components/super-admin/CityCreate";

export default {
	components: {CityCreate, FdmTable, ModalDelete },
	name: 'City',
	data() {
		return {
			isCreate: false,
			cities: [],
			city: {},
			isEdit: false,
			isDelete: false,
			deleteId: 0,
		};
	},
	mounted() {
		this.fetchCity();
	},
	methods: {
		...mapActions('loader', ['setLoading']),
		fetchCity() {
			this.setLoading(true)
			cityService
				.getAll()
				.then((res) => {
					this.setLoading(false)
					this.cities = res;
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
			this.city = item;
		},
		onDelete(id) {
			this.isDelete = true;
			this.deleteId = id;
		},
		deleteCity() {
			this.setLoading(true)
			cityService
				.delete(this.deleteId)
				.then(() => {
					this.setLoading(false)
					this.fetchCity();
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
