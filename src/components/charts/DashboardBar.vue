<template>
	<vue-apex-charts
		v-if="isShow"
		type="bar"
		height="350"
		:options="chartOptions"
		:series="series"
	/>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import { otherService } from '../../_services/other.service'
import { mapActions } from 'vuex'
export default {
	name: 'DashboardBar',
	components: { VueApexCharts },
	data () {
		return {
			isShow: false,
			series: [ {
				name: 'Low',
				data: [ 44, 55, 57, 56, 61 ]
			}, {
				name: 'Medium',
				data: [ 76, 85, 101, 98, 87 ]
			}, {
				name: 'High',
				data: [ 35, 41, 36, 26, 45 ]
			} ],
			chartOptions: {
				chart: {
					type: 'bar',
					height: 350,
					background: 'inherit',
					toolbar: {
						show: false
					}
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '55%',
						endingShape: 'rounded'
					},
				},
				grid: {
					borderColor: '#33393F',
					strokeDashArray: 0,
					position: 'back',
					row: {
						colors: [ '#22262A' ], // takes an array which will be repeated on columns
						opacity: 0.5
					},
				},
				dataLabels: {
					enabled: false,
				},
				stroke: {
					show: true,
					width: 2,
					colors: [ 'transparent' ]
				},
				colors: [ '#53E914', '#F4FB04', '#EF3007' ],
				xaxis: {
					categories: [ 'Feb', 'Mar', 'Apr', 'May', 'Jun' ],
				},
				fill: {
					opacity: 1,
					colors: [ '#53E914', '#F4FB04', '#EF3007' ]
				},
				theme: {
					mode: 'dark',
					palette: 'palette5'
				},
				tooltip: {
					y: {
						formatter: function (val) {
							return val
						}
					}
				}
			}
		}
	},
	computed: {
		currentAircraft () {
			return this.$store.getters['aircraft/currentAircraft']
		},
		calendar () {
			return this.$store.getters['other/calendar']
		}
	},
	watch: {
		currentAircraft (value) {
			this.isShow = false
			if (value.id !== 'all') this.fetchData(value.id, this.calendar.start, this.calendar.end)
			else this.fetchData('', this.calendar.start, this.calendar.end)
		},
		calendar (value) {
			this.isShow = false
			const aircraft = this.currentAircraft.id === 'all' ? '' : this.currentAircraft.id
			this.fetchData(aircraft, value.start, value.end)
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchData (aircraft = '', start = '', end = '') {
			this.setLoading(true)
			otherService.topEvents(aircraft, start, end).then(res => {
				this.chartOptions.xaxis.categories = res.map(i => i.title)
				this.series[0].data = res.map(i => i.low)
				this.series[1].data = res.map(i => i.medium)
				this.series[2].data = res.map(i => i.high)
				this.isShow = true
				this.setLoading(false)
			}).catch(err => {
				console.log(err)
				this.setLoading(false)
			})
		}
	}
}
</script>

<style scoped>

</style>