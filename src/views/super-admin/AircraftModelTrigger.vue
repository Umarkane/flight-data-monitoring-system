<template>
	<div class="country home__body">
		<div class="home__body__head">
			<span>Aircraft Model Trigger</span>
			<button
				class="flex-align-center"
				@click="onCreate"
			>
				<img
					src="../../assets/icons/add.svg"
					alt=""
				> Add new aircraft model trigger
			</button>
		</div>
		<div class="home__body__main">
			<fdm-table>
				<template slot="head">
					<tr>
						<th class="id">
							ID
						</th>
						<th>Trigger</th>
						<th>Low</th>
						<th>Medium</th>
						<th>High</th>
						<th>CSV position</th>
						<th />
						<th />
					</tr>
				</template>
				<template slot="body">
					<tr
						v-for="(item, index) in aircraftModelTriggers"
						:key="item.id"
					>
						<td class="id">
							{{ index + 1 }}
						</td>
						<td>{{ item.trigger_title }}</td>
						<td>{{ item.low }}</td>
						<td>{{ item.medium }}</td>
						<td>{{ item.high }}</td>
						<td>{{ item.csv_position }}</td>
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
		<aircraft-model-trigger-create
			v-if="isCreate"
			:is-edit="isEdit"
			:edit-model="aircraftModelTrigger"
			@close="isCreate = false"
			@fetch="fetchData"
		/>

		<modal-delete
			v-if="isDelete"
			@close="isDelete = false"
			@delete="deleteModel"
		/>
	</div>
</template>

<script>
import FdmTable from '../../components/FdmTable.vue'
import { aircraftModelTriggerService } from '../../_services/aircraft-model-trigger.service'
import ModalDelete from '../../components/ModalDelete.vue'
import { mapActions } from 'vuex'
import AircraftModelTriggerCreate from '../../components/super-admin/AircraftModelTriggerCreate'

export default {
	name: 'AircraftModelTrigger',
	components: { AircraftModelTriggerCreate, FdmTable, ModalDelete },
	data () {
		return {
			isCreate: false,
			aircraftModelTriggers: [],
			aircraftModelTrigger: {},
			isEdit: false,
			isDelete: false,
			deleteId: 0,
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchData () {
			this.setLoading(true)
			aircraftModelTriggerService
				.getAll()
				.then(res => {
					this.setLoading(false)
					this.aircraftModelTriggers = res
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
			this.isCreate = true
			this.isEdit = true
			this.aircraftModelTrigger = item
		},
		onDelete (id) {
			this.isDelete = true
			this.deleteId = id
		},
		deleteModel () {
			this.setLoading(true)
			aircraftModelTriggerService
				.delete(this.deleteId)
				.then(() => {
					this.setLoading(false)
					this.fetchData()
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
