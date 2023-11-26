<template>
	<div class="plot">
		<div class="plot__head">
			<div class="flex flex-col">
				<label class="text-gray-400">Aircraft</label>
				<select
					v-model="aircraftId"
					placeholder="Choose an aircraft"
					class="px-3 py-2 bg-gray-800 border rounded outline-none w-60 text-gray-400"
					@change="onAircraftSelect"
				>
					<option value="0">
						Select an aircraft
					</option>
					<option
						v-for="aircraft in aircrafts"
						:key="aircraft.id"
						:value="aircraft.id"
						:title="aircraft.title"
					>
						{{ aircraft.title }}
					</option>
				</select>
			</div>

			<div class="flex flex-col">
				<label class="text-gray-400">Start Date</label>
				<input
					class="w-44 px-3 py-2 bg-gray-800 border rounded outline-none text-gray-400"
					type="date"
					@change="onStartDateChange"
				>
			</div>
			<div class="flex flex-col">
				<label class="text-gray-400">End Date</label>
				<input
					class="w-44 px-3 py-2 bg-gray-800 border rounded outline-none text-gray-400"
					type="date"
					@change="onEndDateChange"
				>
			</div>

			<div class="flex flex-col">
				<label class="text-gray-400">Route</label>
				<select
					v-model="routeId"
					placeholder="Choose a route"
					class="px-3 py-2 bg-gray-800 border rounded outline-none w-60 text-gray-400"
					@change="onRouteSelect"
				>
					<option value="0">
						Select a route
					</option>
					<option
						v-for="route in routes"
						:key="route.id"
						:value="route.id"
						:title="route.from_airport_title + ' - ' + route.to_airport_title"
					>
						{{ route.from_airport_title }} - {{ route.to_airport_title }}
					</option>
				</select>
			</div>
			<div class="flex flex-col">
				<label class="text-gray-400">Flight</label>
				<select
					v-model="flight"
					placeholder="Choose a flight"
					class="px-3 py-2 bg-gray-800 border rounded outline-none w-60 text-gray-400"
					@change="onFlightSelect"
				>
					<option value="0">
						Select a flight
					</option>
					<option
						v-for="f in flights"
						:key="f.id"
						:value="f.id"
						:title="f.flight_no"
					>
						{{ f.flight_no }}
					</option>
				</select>
			</div>
		</div>
		<!-- <button @click="checkData">
			Check
		</button> -->
		<div class="m-4 text-xl plot__body">
			<div class="flex justify-center text-white plot__body__title">
				Flight (UAFM - UAFO)
			</div>

			<div class="flex">
				<div class="m-10 w-4/5">
					<div
						id="container"
						class="relative"
					/>
					<div
						v-if="isEventLoading"
						class="loader-container"
					>
						<div class="spinner-3" />
					</div>
				</div>

				<div
					class="w-1/5"
					style="background: #1f2327;"
				>
					<div class="w-90 ml-5 mr-5 mb-5 text-yellow-50 w-11/12">
						<label class="text-gray-400">Parameters</label>
						<!-- <multiselect
							v-model="value"
							:options="parameters"
							label="title"
							track-by="id"
							select-label=""
							deselect-label=""
							:multiple="true"
							:disabled="isEventLoading"
							:close-on-select="false"
							@select="onParameterSelect"
							@remove="onParameterRemove"
						/> -->

						<ul class="">
							<li
								v-for="(item, i) in parameters"
								:key="i"
							>
								<label
									class="flex my-1"
									:title="item.title"
								>
									<input
										class="fdm-checkbox"
										type="checkbox"
										:disabled="item.$isDisabled"
										@change="onInput($event, item)"
									>
									{{ item.title }}
								</label>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { fileService } from '../../_services/file.service'
import { otherService } from '../../_services/other.service'
import { mapActions } from 'vuex'
import Highcharts from 'highcharts'
import randomColor from 'randomcolor'
import { eventService } from '../../_services/event.service'
import { flightService } from '../../_services/flight.service'
import { aircraftService } from '../../_services/aircraft.service'
import { routeService } from '../../_services/route.service'
import moment from 'moment'

export default {
	name: 'Plot',
	components: {},
	data () {
		return {
			isShow: true,
			series: [],
			files: [],
			flights: [],
			flight: 0,
			file: '',
			event: '',
			events: [],
			calendarData: {},
			value: [],
			parameters: [],
			selectedParameters: [],
			syncExtremes: '',
			xData: [],
			aircrafts: [],
			aircraftId: 0,
			routes: [],
			routeId: 0,
			isLoading: false,
			datas: [],
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		},
		isEventLoading () {
			return this.parameters.some(i => i.isLoading)
		},
	},
	mounted () {
		this.fetchAircrafts()
		this.highChartInit()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		fetchFiles () {
			fileService
				.getAll()
				.then(res => {
					this.files = res
				})
				.catch(err => {
					console.log(err)
				})
		},

		onEndDateChange (e) {
			this.calendarData = { ...this.calendarData, endDate: e.target.value }
			if (this.calendarData.startDate && this.aircraftId) this.fetchRoutes()
		},
		onStartDateChange (e) {
			this.calendarData = { ...this.calendarData, startDate: e.target.value }
			if (this.calendarData.endDate && this.aircraftId) this.fetchRoutes()
		},

		onClose () {
			this.setCalendar({
				start: moment(
					this.calendarData.dateRange.start,
					'DD/MM/YYYY HH:mm:ss'
				).format('YYYY-MM-DD HH:mm:ss'),
				end: moment(
					this.calendarData.dateRange.end,
					'DD/MM/YYYY HH:mm:ss'
				).format('YYYY-MM-DD HH:mm:ss'),
			})
		},

		onInput (event, item) {
			if (event.target.checked) {
				this.onParameterSelect(item)
			} else {
				this.onParameterRemove(item)
			}
		},

		fetchEvents (fileId) {
			eventService
				.getAll('', fileId)
				.then(res => {
					this.events = res
				})
				.catch(err => console.log(err))
		},
		fetchFlight (routeId) {
			flightService
				.getAll(routeId, '', '', this.aircraftId)
				.then(res => {
					this.flights = res
				})
				.catch(err => {
					console.log(err)
				})
		},
		fetchAircrafts () {
			aircraftService
				.getAll(this.userProfile.user.airline[0])
				.then(res => {
					this.aircrafts = res
				})
				.catch(err => {
					console.log(err)
				})
		},
		fetchRoutes () {
			const startDate = moment(
				this.calendarData.startDate,
				'YYYY-MM-DD'
			).format('YYYY-MM-DD HH:mm:ss')
			const endDate = moment(this.calendarData.endDate, 'YYYY-MM-DD').format(
				'YYYY-MM-DD HH:mm:ss'
			)
			routeService
				.getAll(
					this.aircraftId,
					this.userProfile.user.airline[0],
					startDate,
					endDate
				)
				.then(res => {
					this.routes = res
				})
				.catch(err => {
					console.log(err)
				})
		},
		onAircraftSelect (event) {
			if (
				event.target.value !== '0' &&
        this.calendarData.startDate &&
        this.calendarData.endDate
			) {
				this.fetchRoutes()
			}
		},
		onRouteSelect (event) {
			if (event.target.value !== '0') {
				this.fetchFlight(event.target.value)
			}
		},
		onFlightSelect (e) {
			if (e.target.value != '0') {
				this.fetchEvents(e.target.value)
				this.fetchParameters()
				// this.fetchEventParameters(e.target.value)
			}
		},
		fetchParameters () {
			otherService
				.getParameters()
				.then(res => {
					this.parameters = res
				})
				.catch(err => {
					console.log(err)
				})
		},
		async onParameterSelect (opt) {
			this.parameters = this.parameters.map(i => {
				if (i.id === opt.id) {
					return { ...i, $isDisabled: true, isLoading: true }
				}
				return i
			})
			let data = []
			try {
				data = await otherService.getParameterById(opt.id, this.flight)
				this.datas.push(data)
			} catch (err) {
				console.log(err)
				this.$toastr.e(err)
			}
			this.selectedParameters.push({ name: opt.title, id: opt.id })
			this.xData = data.map(i => i.timestamp)
			const dataset = {
				name: opt.title,
				data: data.map(i => parseFloat(i.value)),
				type: 'line',
			}
			this.makeDataset(dataset)
			this.parameters = this.parameters.map(i => {
				if (i.id === opt.id) {
					return { ...i, $isDisabled: false, isLoading: false }
				}
				return i
			})
		},
		checkData () {
			this.datas[0].forEach((i, index) => {
				if (i.timestamp != this.datas[1][index].timestamp) {
					console.log(
						index,
						': data0: ',
						i.timestamp,
						' - data1: ',
						this.datas[1][index].timestamp
					)
				}
			})
		},
		makeDataset (dataset) {
			function getRandomColor () {
				const letters = 'BCDEF'.split('')
				let color = '#'
				for (let i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * letters.length)]
				}
				return color
			}
			dataset.data = Highcharts.map(dataset.data, (val, j) => {
				return [ this.xData[j], val ]
			})

			const plotLine = this.events.map(i => ({
				name: i.event_name,
				value: i.value,
				x: this.xData.findIndex(j => j === i.timestamp),
			}))

			const chartDiv = document.createElement('div')
			chartDiv.className = 'chart'
			document.getElementById('container').appendChild(chartDiv)

			function syncAnnotations (e) {
				const thisChart = this.chart
				const newX = this.options.shapes[0].points[0].x
				const index = this.chart.annotations.indexOf(this)
				console.log(newX)

				if (e.type !== 'afterUpdate') {
					Highcharts.each(Highcharts.charts, chart => {
						if (chart !== thisChart) {
							chart.annotations[index].update({
								labels: [
									{
										point: {
											x: newX,
										},
									},
								],
								shapes: [
									{
										points: [
											{
												x: newX,
												xAxis: 0,
												y: 0,
											},
											{
												x: newX,
												xAxis: 0,
												y: 1000,
											},
										],
									},
								],
							})
						}
					})
				}
			}

			Highcharts.chart(
				chartDiv,
				{
					chart: {
						marginLeft: 40, // Keep all charts left aligned
						spacingTop: 20,
						spacingBottom: 20,
						style: {
							color: '#c8c9c5',
						},
						events: {
							render: val => {
								this.drawEvents(plotLine)
							},
						},
						zoomType: 'x',
						resetZoomButton: {
							position: {
								// align: 'right', // by default
								// verticalAlign: 'top', // by default
								x: -10,
								y: 0,
							},
							relativeTo: 'chart',
							theme: {
								zIndex: 999999999,
							},
						},
					},
					point: {
						events: {
							mouseOut: function () {
								this.series.chart.tooltip.hide()
							},
						},
					},
					colors: [ 'red', 'orange', 'green', 'blue', 'purple', 'brown' ],
					title: {
						text: dataset.name,
						align: 'left',
						margin: 0,
						x: 30,
						style: {
							color: '#c8c9c5',
						},
					},
					credits: {
						enabled: false,
					},
					legend: {
						enabled: false,
					},
					xAxis: {
						id: 'xaxis',
						crosshair: true,
						events: {
							setExtremes: this.syncExtremes,
						},
						title: {
							style: {
								color: '#c8c9c5',
							},
						},
						categories: this.xData,
						labels: {
							enabled: false,
							style: {
								color: '#c8c9c5',
							},
						},
						plotLines: plotLine.map(i => {
							return {
								value: i.x,
								width: 0,
								label: {
									text: '',
									rotation: 0,
									useHTML: true,
								},
							}
						}),
					},
					yAxis: {
						title: {
							text: null,
							style: {
								color: '#c8c9c5',
							},
						},
						labels: {
							style: {
								color: '#c8c9c5',
							},
						},
					},
					tooltip: {
						backgroundColor: '#fff',
						hideDelay: 2000,
						borderColor: '#C6EDEE',
						borderRadius: 10,
						borderWidth: 2,
						formatter: function () {
							return `<span class="uppercase text-base">${this.series.name}</span> <br> 
								<span class="text-xs">Date & Time: </span> <span class="text-xs">${this.x}</span><br>
								<span class="text-xs">Value: </span> <span class="text-xs">${this.y}</span>`
						},
						headerFormat: '',
						shadow: false,
						style: {
							fontSize: '18px',
							color: '#000',
						},
						valueDecimals: dataset.valueDecimals,
					},
					series: [
						{
							data: dataset.data,
							name: dataset.name,
							type: dataset.type,
							color: randomColor(),
							fillOpacity: 0.3,
							turboThreshold: 100001,
							tooltip: {
								// valueSuffix: ' ' + dataset.unit
							},
						},
					],
				},
				chart => {
					this.drawEvents(plotLine)
				}
			)
		},
		resetEvents (className) {
			const a = document.getElementsByClassName(className)
			for (const i of [ ...a ]) {
				i.remove()
			}
		},
		drawEvents (plotLine) {
			this.resetEvents('event-chart-data')
			const charts = document.getElementsByClassName('chart')
			for (let j = 0; j < [ ...charts ].length; j++) {
				const a = charts[j].getElementsByClassName('highcharts-plot-line-label')
				const container = document.getElementById('container')
				const c = container.getBoundingClientRect()
				for (let i = 0; i < [ ...a ].length; i++) {
					const b = a[i].getBoundingClientRect()
					const span = document.createElement('span')
					span.classList = 'event-chart-data'
					span.style.top = b.top - c.top - 40 + 'px'
					span.style.left = b.left - c.left + 'px'
					span.style.position = 'absolute'
					span.style.height = '120px'
					span.style.width = '2px'
					span.style.color = 'red'
					span.style.display = 'block'
					span.style.background = '#6495EC'
					if (j === 0) {
						const innerSpan = document.createElement('span')
						innerSpan.style.position = 'absolute'
						innerSpan.style.height = 'auto'
						innerSpan.style.top = b.top - c.top - 40 + 'px'
						innerSpan.style.left = b.left - c.left + 'px'
						innerSpan.style.width = 'auto'
						innerSpan.style.background = 'white'
						innerSpan.style.color = '#6495EC'
						innerSpan.style.border = '1px solid #6495EC'
						innerSpan.style.lineHeight = 1
						innerSpan.style.fontSize = '12px'
						innerSpan.style.display = 'block'
						innerSpan.style.padding = '5px'
						innerSpan.style.fontWeight = 'bold'
						innerSpan.style.zIndex = 1
						innerSpan.classList = 'tooltip event-chart-data'
						innerSpan.style.borderLeftWidth = '2px'
						innerSpan.innerText = plotLine[i].name
						container.appendChild(innerSpan)

						const tooltip = document.createElement('div')
						tooltip.classList = 'tooltiptext'
						innerSpan.appendChild(tooltip)

						const title = document.createElement('span')
						title.classList = 'tooltiptext__title'
						title.innerText = plotLine[i].name
						tooltip.appendChild(title)

						const time = document.createElement('p')
						time.innerText = this.xData[plotLine[i].x]
						tooltip.appendChild(time)

						const eventLimit = document.createElement('p')
						eventLimit.innerText = 'Event Limit: 0.5'
						tooltip.appendChild(eventLimit)

						const eventValue = document.createElement('p')
						eventValue.innerText = 'Event Value: ' + plotLine[0].value
						tooltip.appendChild(eventValue)
					}
					container.appendChild(span)
				}
			}
		},
		onParameterRemove (opt) {
			//check is event loading
			// const event = this.parameters.find(i => i.id === opt.id)
			// console.log(event.$isDisabled)
			// if (event.$isDisabled) return
			// Else remove event
			const index = this.selectedParameters.findIndex(i => i.id === opt.id)
			const chart = Highcharts.charts[index]
			chart.container.parentNode.parentNode.removeChild(
				chart.container.parentNode
			)
			Highcharts.charts.splice(index, 1)
			this.selectedParameters.splice(index, 1)
			const evnetLines = document.getElementsByClassName('event-chart-data')
			console.log(evnetLines)
			const len = [ ...evnetLines ].length
			for (let i = 0; i < this.events.length; i++) {
				const removingEvent = evnetLines[len - 1 - i]
				removingEvent.parentNode.removeChild(removingEvent)
			}

			if (this.selectedParameters.length === 0) {
				this.resetEvents('event-chart-data')
			}
		},
		onMouseOver () {
			console.log('over')
		},
		highChartInit () {
			[ 'mousemove', 'touchmove', 'touchstart' ].forEach(eventType => {
				document
					.getElementById('container')
					.addEventListener(eventType, e => {
						let chart
						let point
						let i
						let event

						for (i = 0; i < Highcharts.charts.length; i = i + 1) {
							chart = Highcharts.charts[i]
							// Find coordinates within the chart
							event = chart.pointer.normalize(e)
							// Get the hovered point
							point = chart.series[0].searchPoint(event, true)

							if (point) {
								point.onMouseOver(e)
							}
						}
					})
			})
			// Highcharts.Pointer.prototype.reset = function () {
			// 	return undefined
			// }
			Highcharts.Point.prototype.highlight = function (event) {
				event = this.series.chart.pointer.normalize(event)
				this.onMouseOver() // Show the hover marker
				this.series.chart.tooltip.refresh(this) // Show the tooltip
				this.series.chart.xAxis[0].drawCrosshair(event, this) // Show the crosshair
			}
			this.syncExtremes = e => {
				const thisChart = this.chart

				if (e.trigger !== 'syncExtremes') {
					// Prevent feedback loop
					Highcharts.each(Highcharts.charts, chart => {
						if (chart !== thisChart) {
							if (chart.xAxis[0].setExtremes) {
								// It is null while updating
								chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
									trigger: 'syncExtremes',
								})
							}
						}
					})
				}
			}
		},
	},
}
</script>

<style lang="scss">
.date-choose {
  display: flex;
}
.spinner-3 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: conic-gradient(#0000 10%, #25b09b);
  --webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: s3 1s infinite linear;
}
@keyframes s3 {
  to {
    transform: rotate(1turn);
  }
}
.loader-container {
  display: flex;
  justify-content: center;
  margin-bottom: 140px;
}
.chart-tooltip {
  display: block;
  width: 3px;
  height: 10000px;
  // border-radius: 10px;
  background: cornsilk;
}
.multiselect__tags {
  background: transparent;
  border-color: rgb(118, 118, 118);
  input {
    background: transparent;
  }

  .multiselect__single {
    background: transparent;
    color: white;
  }
}
.plot {
  &__head {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    color: #fff;

    select,
    input {
      border-color: rgb(118, 118, 118);
    }
  }
}
.highcharts-figure,
.highcharts-data-table table {
  min-width: 320px;
  max-width: 800px;
  margin: 1em auto;
}

.chart {
  height: 120px;
  //   width: 42vw;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #c8c9c5;
  margin: 10px auto;
  text-align: center;
  width: 100%;
  max-width: 500px;
}
.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}
.highcharts-data-table th {
  font-weight: 600;
  padding: 0.5em;
}
.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  padding: 0.5em;
}
.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
  background: #3f3a3a;
}
.highcharts-data-table tr:hover {
  background: #303336;
}
.highcharts-background {
  fill: rgba(255, 255, 255, 0.02);
  // fill: rgba($color: #fff, $alpha: 1);
}
#events {
  pointer-events: none;
  background: rgba(#fff, 0.6);
}
#container {
  margin-bottom: 110px;
}

.tooltip .tooltiptext {
  visibility: hidden;
  min-width: 200px;
  background-color: #4aa96c;
  color: #fff;
  border-radius: 3px;
  padding: 5px 5px 5px 10px;
  font-weight: normal;
  position: absolute;
  font-size: 15px;
  top: -100px;
  line-height: 1.2;
  z-index: 1;
  right: 2px;

  &__title {
    font-weight: bold;
  }
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
