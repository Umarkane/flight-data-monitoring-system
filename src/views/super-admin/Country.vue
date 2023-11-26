<template>
	<div class="country home__body">
		<div class="home__body__head">
			<span>Countries</span>
			<button @click="onCreate" class="flex-align-center">
				<img src="../../assets/icons/add.svg" alt="" /> Add new country
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
					<tr v-for="(item, index) in countries" :key="item.id">
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
		<country-create
			v-if="isCreate"
			:isEdit="isEdit"
			:editCountry="country"
			@close="isCreate = false"
			@fetch="fetchCountries"
		></country-create>

		<modal-delete v-if="isDelete" @close="isDelete = false" @delete="deleteCountry">
		</modal-delete>
	</div>
</template>

<script>
	import FdmTable from '../../components/FdmTable.vue';
	import CountryCreate from '../../components/super-admin/CountryCreate.vue';
	import { countriesService } from '@/_services/countries.service';
	import ModalDelete from '../../components/ModalDelete.vue';
	import {mapActions} from "vuex";

	export default {
		components: {FdmTable, CountryCreate, ModalDelete },
		name: 'Country',
		data() {
			return {
				isCreate: false,
				countries: [],
				country: {},
				isEdit: false,
				isDelete: false,
				deleteId: 0,
			};
		},
		mounted() {
			this.fetchCountries();
		},
		methods: {
			...mapActions('loader', ['setLoading']),
			fetchCountries() {
				this.setLoading(true)
				countriesService
					.getAll()
					.then((res) => {
						this.setLoading(false)
						this.countries = res;
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
				this.country = item;
			},
			onDelete(id) {
				this.isDelete = true;
				this.deleteId = id;
			},
			deleteCountry() {
				this.setLoading(true)
				countriesService
					.delete(this.deleteId)
					.then(() => {
						this.setLoading(false)
						this.fetchCountries();
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
