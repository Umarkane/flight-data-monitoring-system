<template>
	<div>
		<fmd-table>
			<template slot="head">
				<tr>
					<th>File Name</th>
					<th>Upload Date</th>
					<th>File Size (MB)</th>
					<th>Data Quality (%)</th>
					<th>Comments</th>
					<th />
				</tr>
			</template>
			<template slot="body">
				<tr class="filter">
					<td>
						<input
							v-model="name"
							type="text"
						>
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="date"
							type="date"
						>
						<!-- <img
							src="../../assets/icons/calendar.svg"
							alt=""
						> -->
					</td>
					<td>
						<input
							v-model="size"
							type="text"
						>
						<img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input
							v-model="quality"
							type="text"
						><img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<input type="text"><img
							src="../../assets/icons/search-mini.svg"
							alt=""
						>
					</td>
					<td>
						<button
							class="detail red"
							@click="onClear"
						>
							Clear
						</button>
					</td>
				</tr>
				<tr
					v-for="(item, i) in filteredFiles"
					:key="i"
				>
					<td>
						{{ item.file_name }}
					</td>
					<td>{{ item.created_at }}</td>
					<td>{{ item.file_size.toFixed(2) }}</td>
					<td class="pl20">
						98
					</td>
					<td>{{ item.comment }}</td>
					<td>
						<button
							class="detail"
							@click="onDetail(item)"
						>
							Details
						</button>
					</td>
				</tr>
			</template>
		</fmd-table>
		<data-insight-detail
			v-if="isShowDetail"
			:file-id="file.id"
			:default-menu="2"
			:aircraft-id="file.aircraft"
			:flight-id="file.flight"
			@close="isShowDetail = false"
		/>
	</div>
</template>

<script>
import FmdTable from '../FdmTable'
import { fileService } from '../../_services/file.service'
import { mapActions } from 'vuex'
import DataInsightDetail from './DataInsightDetail'
import moment from 'moment'
// import Pagination from '../elements/Pagination'
export default {
	name: 'DataInsightFile',
	components: { DataInsightDetail, FmdTable },
	data () {
		return {
			files: [],
			isShowDetail: false,
			file: {},
			name: '',
			date: '',
			size: '',
			quality: '',
			comment: ''
		}
	},
	computed: {
		filteredFiles () {
			let data = this.files
			if (this.name) data = this.files.filter(i => i.file_name && i.file_name.toLowerCase().includes(this.name.toLowerCase()))
			if (this.date) data = this.files.filter(i => i.created_at && moment(i.created_at).format('YYYY-MM-DD') === this.date)
			if (this.size) data = this.files.filter(i => i.file_size && i.file_size.toString().toLowerCase().includes(this.size.toLowerCase()))
			// if (this.quality) data = this.files.filter(i => i.file_size && i.file_size.toLowerCase().includes(this.size.toLowerCase()))
			return data
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchData () {
			this.setLoading(true)
			fileService.getAll().then(res => {
				this.files = res
				this.setLoading(false)
			}).catch(err => {
				this.setLoading(false)
				console.log(err)
			})
		},
		onPageChange (num) {
			console.log(num)
		},
		onDetail (item ){
			this.file = item
			this.isShowDetail = true
		},
		onClear () {
			this.name = ''
			this.date = ''
			this.size = ''
			this.quality = ''
		}
	}
}
</script>

<style scoped>

</style>