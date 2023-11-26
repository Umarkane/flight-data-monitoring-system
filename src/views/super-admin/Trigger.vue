<template>
	<div class="country home__body">
		<div class="home__body__head">
			<span>Trigger</span>
			<button
				class="flex-align-center"
				@click="onCreate"
			>
				<img
					src="../../assets/icons/add.svg"
					alt=""
				> Add new trigger
			</button>
		</div>
		<div class="home__body__main">
			<fdm-table>
				<template slot="head">
					<tr>
						<th class="id">
							ID
						</th>
						<th>Title</th>
						<th />
						<th />
					</tr>
				</template>
				<template slot="body">
					<tr
						v-for="(item, index) in triggers"
						:key="item.id"
					>
						<td class="id">
							{{ index + 1 }}
						</td>
						<td>{{ item.title }}</td>
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
		<trigger-create
			v-if="isCreate"
			:is-edit="isEdit"
			:edit-trigger="trigger"
			@close="isCreate = false"
			@fetch="fetchTrigger"
		/>

		<modal-delete
			v-if="isDelete"
			@close="isDelete = false"
			@delete="deleteTrigger"
		/>
	</div>
</template>

<script>
import FdmTable from '../../components/FdmTable.vue'
import ModalDelete from '../../components/ModalDelete.vue'
import { mapActions } from 'vuex'
import TriggerCreate from '../../components/super-admin/TriggerCreate'
import { triggerService } from '../../_services/trigger.service'

export default {
	name: 'Trigger',
	components: { TriggerCreate, FdmTable, ModalDelete },
	data () {
		return {
			isCreate: false,
			triggers: [],
			trigger: {},
			isEdit: false,
			isDelete: false,
			deleteId: 0,
		}
	},
	mounted () {
		this.fetchTrigger()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchTrigger () {
			this.setLoading(true)
			triggerService
				.getAll()
				.then(res => {
					this.setLoading(false)
					this.triggers = res
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
			this.trigger = item
		},
		onDelete (id) {
			this.isDelete = true
			this.deleteId = id
		},
		deleteTrigger () {
			this.setLoading(true)
			triggerService
				.delete(this.deleteId)
				.then(() => {
					this.setLoading(false)
					this.fetchTrigger()
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
