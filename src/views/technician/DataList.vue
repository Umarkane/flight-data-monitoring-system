<template>
	<div class="data-list">
		<div class="data-list__head">
			<div>Data Lists</div>
			<div class="data-list__buttons">
				<button class="data-list__button active">
					FILES <img
						src="../../assets/icons/file.svg"
						alt=""
					>
				</button>
				<button class="data-list__button">
					FLIGHTS <img
						src="../../assets/icons/flight.svg"
						alt=""
					>
				</button>
				<button class="data-list__button">
					EVENTS <img
						src="../../assets/icons/event.svg"
						alt=""
					>
				</button>
			</div>
		</div>
		<div class="data-list__body">
			<fdm-table>
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
							<input type="text">
							<img
								src="../../assets/icons/search-mini.svg"
								alt=""
							>
						</td>
						<td>
							<input type="text">
							<img
								src="../../assets/icons/calendar.svg"
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
							<input type="text"><img
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
						<td />
					</tr>
					<tr
						v-for="item in files"
						:key="item.file_name"
					>
						<td>{{ item.file_name.join(', ') }}</td>
						<td>Graphic Design</td>
						<td>0777114676</td>
						<td>tr56177ytu</td>
						<td>comments</td>
						<td>
							<button class="detail">
								Details
							</button>
						</td>
					</tr>
				</template>
			</fdm-table>
		</div>
	</div>
</template>

<script>
import FdmTable from '../../components/FdmTable.vue'
import { fileService } from '../../_services/file.service'
import { mapActions } from 'vuex'

export default {
	name: 'DataList',
	components: { FdmTable },
	data () {
		return {
			files: []
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
		}
	}
}
</script>

<style lang="scss">
	.data-list {
		margin: 0 40px;
		&__head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 20px;
			line-height: 27px;
			letter-spacing: 0.2px;

			color: #ffffff;
		}

		&__button {
			background: #2a3546;
			height: 36px;
			padding: 0 10px;
			font-size: 14px;
			line-height: 19px;
			color: #ffffff;
			border: none;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 4px;
			min-width: 116px;
			cursor: pointer;

			img {
				margin-left: 15px;
			}

			&.active {
				background: rgba($color: #298bfe, $alpha: 0.4);
			}
		}

		&__buttons {
			display: flex;
			gap: 49px;
		}

		&__body {
			margin-top: 18px;
			margin-bottom: 30px;
		}
	}
</style>
