<template>
	<div class="analytics">
		<div class="flex items-center justify-between mx-8 text-white">
			<div>
				<h2 class="text-4xl">
					Event Summary
				</h2>
			</div>
			<div class="flex gap-8">
				<div>
					<label for="aircratf">Aircraft Type</label>
					<multiselect
						v-model="value2"	
						:options="aircrafts"
						label="modelTitle"
						track-by="modelCode"
						:select-label="''"
						:deselect-label="''"
						:limit="1"
						class="w-40"
						:multiple="true"
						:close-on-select="false"
					/>
				</div>
				<div>
					<label for="aircratf_reg">Aircraft Registration</label>
					<multiselect
						v-model="reg"
						class="w-40"	
						label="reg_number"
						:options="aircrafts"
						:select-label="''"
						:deselect-label="''"
						:limit="1"
						:multiple="true"
						:close-on-select="false"
					/>
				</div>
				<div class="flex gap-4">
					<div class="analytics__select">
						<label for="date">Date</label>
						<multiselect
							v-model="value"	
							:options="dateOptions"
							:select-label="''"
							:deselect-label="''"
							:limit="1"
							:multiple="false"
							:close-on-select="true"
						/>
					</div>
					<div class="">
						<div class="h-6 text-sm">
							<i class="far fa-calendar-alt" />
							15.02.2020 - 15.02.2021
						</div>
						<div class="flex gap-4">
							<input
								type="text"
								class="rounded-md analytics__input"
								value="6"
							>   
							<multiselect
								v-model="date2"	
								:select-label="''"
								:deselect-label="''"
								:options="date2Options"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex gap-5 m-8 text-white">
			<div>
				<div class="flex gap-4">
					<div class="flex flex-col items-center justify-center w-48 h-24 border">
						<p class="text-4xl">
							{{ flights.length }}
						</p>
						<p class="text-gray-400">
							Flights
						</p>
					</div>
					<div class="flex flex-col items-center justify-center w-48 h-24 border">
						<p class="text-4xl">
							{{ events.length }}
						</p>
						<p class="text-gray-400">
							Events
						</p>
					</div>
				</div>
				<div class="flex gap-4 mt-5">
					<div class="flex flex-col items-center justify-center w-40 h-48 border">
						<p class="text-4xl">
							{{ averageStats.n_events_per_100_flights }}
						</p>
						<p class="text-gray-400">
							Events per 100 Flts
						</p>
					</div>
					<div class="flex flex-col items-center justify-center w-56 h-48 border">
						<div class="text-gray-400">
							Events by Aircraft Type
						</div>
						<vue-apex-charts
							v-if="!isLoading"
							type="donut"
							:options="aircraftType.chartOptions"
							:series="aircraftType.series"
						/>
					</div>
				</div>
				<div
					class="relative flex flex-col items-center justify-center mt-5 border h-96 chartContainer"
					style="width: 25rem"
				>
					<div class="absolute text-sm text-gray-400 left-1 top-1">
						Watch List
					</div>
					<vue-apex-charts
						v-if="!isLoading"
						type="bar"
						height="100%"
						width="100%"
						:options="flightByMonth.chartOptions"
						:series="flightByMonth.series"
					/>
				</div>
			</div>
			<div class="border w-96">
				<div class="mt-5 h-80">
					<vue-apex-charts
						type="pie"
						height="100%"
						width="100%"
						:options="pieCenter.chartOptions"
						:series="pieCenter.series"
					/>
				</div>
				<div class="mt-5 h-80 chartContainer">
					<vue-apex-charts
						type="bar"
						height="100%"
						width="100%"
						:options="columnCenter.chartOptions"
						:series="columnCenter.series"
					/>
				</div>
			</div>
			<div class="flex-1">
				<div class="border h-96">
					<vue-apex-charts
						v-if="!isLoading"
						type="line"
						height="100%"
						width="100%"
						:options="multipleChart.chartOptions"
						:series="multipleChart.series"
					/>
				</div>
				<div class="border h-72 mt-9" />
			</div>
		</div>
	</div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import { eventService } from '../../_services/event.service'
import { flightService } from '../../_services/flight.service'
import { otherService } from '../../_services/other.service'
import { aircraftService } from '../../_services/aircraft.service'
import { aircraftModelService } from '../../_services/aircraft-model.service'
import moment from 'moment'

export default {
	name: 'Analytics',
	components: { VueApexCharts },
	data () {
		return {
			value: null,
			value1: '',
			value2: '',
			reg: '',
			date: '',
			date2: '',
			typeOptions: [ 'Select all', 'options' ],
			dateOptions: [ 'Next', 'Last', 'This' ],
			regOptions: [ 'Select all', 'registration' ],
			date2Options: [ 'Day', 'Week', 'Month', 'Year' ],
			options: [ 'sdad' ],
			aircraftType: {
				series: [],
				chartOptions: {
					chart: {
						type: 'donut',
						foreColor: '#9ca3af'
					},
					// title: {
					// 	text: 'Events by Aircraft Type'
					// },
					labels: [],
					// fill: {
					// 	colors: [ '' ]
					// },
					legend: {
						position: 'bottom'
					},
					dataLabels: {
						enabled: false
					},
					stroke: {
						show: false
					},
					responsive: [ {
						breakpoint: 480,
						options: {
							chart: {
								width: 200
							},
							legend: {
								show: false
							}
						}
					} ]
				},
			},
			flightByMonth: {
				series: [ {
					name: 'Net Profit',
					data: []
				} ],
				chartOptions: {
					chart: {
						type: 'bar',
						height: 350,
						toolbar: { show: false },
						foreColor: '#fff'
					},
					legend: {
						show: true,
						position: 'right'
					},
					fill: {
						colors: [ '#05B8AA' ]
					},
					plotOptions: {
						bar: {
							horizontal: false,
							columnWidth: '55%',
							endingShape: 'rounded'
						},
					},
					
					dataLabels: {
						enabled: false
					},
					stroke: {
						show: true,
						width: 2,
						colors: [ 'transparent' ]
					},
					xaxis: {
						categories: [],
					},
					yaxis: {
						title: {
							text: 'Event Rate'
						}
					},
					tooltip: {
						colors: [ '#000' ],
						custom: function ({ series, seriesIndex, dataPointIndex, w }) {
							console.log(series, w)
							return '<div class="tooltip">' +
								'<div> <span> Year</span><span class="desc"> 2019</span>' + '</div>' +
								'<div> <span>EventName</span><span class="desc"> Hight Rate of Descent</span>' + '</div>' +
								'<div> <span>Event Rate</span><span class="desc"> 1.75</span>' + '</div>' +
								'</div>'
						},
						fixed: {
							enabled: true
						}
						// y: {
						// 	formatter: function (val, a) {
						// 		return val
						// 	}
						// }
					}
				},
			},
			pieCenter: {
				series: [ 44, 55, 13, 43, 22 ],
				chartOptions: {
					chart: {
						width: 380,
						type: 'pie',
					},
					labels: [ 'Takeoff', 'Climb', 'Cruise' , 'Descent', 'Approach', 'Landing'  ],
					legend: { show: false },
					stroke: {
						colors: [ 'transparent' ] 
					}, 
					dataLabels: {
						enabled: true,
						textAnchor: 'start',
						formatter: function (val, opt) {
							return opt.w.globals.labels[opt.seriesIndex]
						},
						offsetX: 0,
						style: {
							fontSize: '12px',
							fontWeight: 'normal',
							colors: [ '#fff' ],
						},
						background: {
							enabled: false,
							foreColor: '#fff',
							borderRadius: 2,
							padding: 4,
							opacity: 0.9,
							borderWidth: 0,
						},
					},
					responsive: [ {
						breakpoint: 480,
						options: {
							chart: {
								width: 200
							},
							legend: {
								position: 'bottom'
							}
						}
					} ]
				},
			},
			columnCenter: {
				series: [ {
					name: 'Low',
					data: [ 44, 55, 41, 67, 22, 43 ]
				}, {
					name: 'Medium',
					data: [ 13, 23, 20, 8, 13, 27 ]
				}, {
					name: 'High',
					data: [ 11, 17, 15, 15, 21, 14 ]
				} ],
				chartOptions: {
					chart: {
						type: 'bar',
						height: 350,
						stacked: true,
						foreColor: '#fff',  
						toolbar: {
							show: true,
							tools: {
								download: false,
								selection: true,
								zoom: false,
								zoomin: true,
								zoomout: true,
								pan: true,
								reset: true | '<img src="/static/icons/reset.png" width="20">',
								customIcons: []
							},
						},
						zoom: {
							enabled: true
						}
					},
					responsive: [ {
						breakpoint: 480,
						options: {
							// legend: {
							// 	position: 'bottom',
							// 	offsetX: -10,
							// 	offsetY: 0
							// }
						}
					} ],
					dataLabels: {
						enabled: false
					},
					plotOptions: {
						bar: {
							borderRadius: 8,
							horizontal: false,
						},
					},
					xaxis: {
						categories: [ 'Takeoff', 'Climb', 'Cruise' , 'Descent', 'Approach', 'Landing' 
						],
					},
					legend: {
						position: 'top',
						horizontalAlign: 'left',
						offsetY: 20
					},
					fill: {
						opacity: 1
					}
				},
			},
			multipleChart: {
				series: [ {
					name: 'Low',
					type: 'column',
					data: []
				},{
					name: 'Medium',
					type: 'column',
					data: []
				},{
					name: 'High',
					type: 'column',
					data: []
				}, {
					name: 'Total flight',
					type: 'line',
					data: []
				},{
					name: 'Total events',
					type: 'line',
					data: []
				} ],
				chartOptions: {
					chart: {
						height: 350,
						type: 'line',
						foreColor: '#fff',
						stacked: true,
						toolbar: { show: false },
					},
					stroke: {
						width: [ 2,2,2,2,2 ]
					},
					title: {
						text: 'Event summary'
					},
					tooltip: {
						style: {
							color: '#000'
						}
					},
					dataLabels: {
						enabled: false,
						// enabledOnSeries: [ 1 ]
					},
					labels: [ 2019, 2020, 2021 ],
					xaxis: {
						categories: [ 2019, 2020, 2021 ],
					},
					yaxis: [ {
						title: {
							text: 'Total flight (per 100 flights)',
						},
            
					}, {
						opposite: true,
						title: {
							text: 'Total events  and total flights'
						}
					} ]
				},
          
			},
			events: [],
			flights: [],
			averageStats: {},
			aircrafts: [],
			isLoading: false
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData () {
			this.isLoading = true
			eventService.getAll().then(async res => {
				this.events = res
				this.flights = await flightService.getAll()
				const d = await otherService.averageStats()
				this.averageStats = d && d[0]
				this.aircrafts = await aircraftService.getAll(this.userProfile.user.airline[0])
				for (const i of this.aircrafts) {
					const model = await aircraftModelService.getById(i.aircraft_model)
					i.modelTitle = model.title
					i.modelCode = model.code
				}
				this.aircraftType.series = this.aircrafts.map(i => this.events.filter(j => j.aircraft_id === i.id).length)
				this.aircraftType.chartOptions.labels = this.aircrafts.map(i => i.modelCode)
				const levels = [ 'L','M','H' ]
				this.multipleChart.chartOptions.labels.forEach((k, ki) => {
					this.multipleChart.series[ki].data = levels.map((i,index) => {
						return this.events.filter(j => {
							return moment(j.event_date, 'YYYY-MM-DD').year() === k && j.event_severity === levels[index]
						}).length
					})
				})
				this.multipleChart.series[3].data = this.multipleChart.chartOptions.labels.map((i,index) => {
					return this.flights.filter(j => moment(j.arrival_time).year() === i).length
				})
				this.multipleChart.series[4].data = this.multipleChart.chartOptions.labels.map((i,index) => {
					return this.events.filter(j => moment(j.event_date, 'YYYY-MM-DD').year() === i).length
				})
				console.log(this.multipleChart)
				const a = await otherService.flightsByMonth()
				this.flightByMonth.series[0].data = a.map(i => i.flights)
				this.flightByMonth.chartOptions.xaxis.categories = a.map(i => i.month.substr(0,3))
				this.isLoading = false
			}).catch(err => {
				console.log(err)
				this.isLoading = false
			})
		},

	}
}
</script>

<style lang="scss">
.chartContainer .apexcharts-tooltip {
  color: #000000;
}
.apexcharts-tooltip {
    background: #f3f3f3;
    color: #000000;
  }

.tooltip {
	padding: 15px;
	background: rgba(0,0,0, 0.7);
	border: none;
	outline: none;
	border-radius: 0;

	div {
		display: flex;
		span {
			width: 80px;
			text-align: right;
			white-space: pre-wrap;
			color: #b1a7a6;

			&.desc {
				width: 200px;
				margin-left: 10px;
				text-align: left;
				color: #f5f3f4;
			}
		}
		&.text {
			color: #ffffff;
		}
	}
}

.chartContainer .apexcharts-tooltip .apexcharts-tooltip-series-group.active {
  background: #ffffff !important;
  color: #000000;
}
    .multiselect__tags {
		background: transparent;
		border-color:rgb(118, 118, 118);
        min-height: 43px;
		input {
			background: transparent;
		}

		.multiselect__single {
			background: transparent;
			color: white;
		}
	}
    .analytics {
        &__select {
            width: 180px;

            &.input {
                width: 80px;
            }
        }
        &__input {
            height: 43px;
            width: 80px;
            background: transparent;
            border: 0.5px solid rgb(118, 118, 118);
            color: white;
            padding: 0 10px;
        }
    }
</style>