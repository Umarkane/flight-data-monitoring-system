<template>
	<div class="country home__body">
		<div class="home__body__head">
			<span>Route</span>
			<button
				class="flex-align-center"
				@click="onCreate"
			>
				<img
					src="../../assets/icons/add.svg"
					alt=""
				> Add new route
			</button>
		</div>
		<div class="home__body__main">
			<fdm-table>
				<template slot="head">
					<tr>
						<th class="id">
							ID
						</th>
						<th>Airline</th>
						<th>From</th>
						<th>To</th>
						<th />
						<th />
					</tr>
				</template>
				<template slot="body">
					<tr
						v-for="(item, index) in routes"
						:key="item.id"
					>
						<td class="id">
							{{ index + 1 }}
						</td>
						<td>{{ item.airline_title }}</td>
						<td>{{ item.from_airport_title }}</td>
						<td>{{ item.to_airport_title }}</td>
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
		<route-create
			v-if="isCreate"
			:is-edit="isEdit"
			:edit-route="route"
			@close="isCreate = false"
			@fetch="fetchRoutes"
		/>

		<modal-delete
			v-if="isDelete"
			@close="isDelete = false"
			@delete="deleteRoute"
		/>
	</div>
</template>

<script>
import FdmTable from '../../components/FdmTable.vue'
import ModalDelete from '../../components/ModalDelete.vue'
import { mapActions } from 'vuex'
import RouteCreate from '../../components/super-admin/RouteCreate'
import { routeService } from '../../_services/route.service'

export default {
	name: 'Country',
	components: { RouteCreate, FdmTable, ModalDelete },
	data () {
		return {
			isCreate: false,
			routes: [],
			route: {},
			isEdit: false,
			isDelete: false,
			deleteId: 0,
		}
	},
	mounted () {
		this.fetchRoutes()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchRoutes () {
			this.setLoading(true)
			routeService
				.getAll()
				.then(res => {
					this.setLoading(false)
					this.routes = res
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
			this.route = item
			this.isCreate = true
			this.isEdit = true
		},
		onDelete (id) {
			this.isDelete = true
			this.deleteId = id
		},
		deleteRoute () {
			this.setLoading(true)
			routeService
				.delete(this.deleteId)
				.then(() => {
					this.setLoading(false)
					this.fetchRoutes()
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
