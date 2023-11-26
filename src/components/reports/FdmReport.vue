<template>
	<div class="fdm-report">
		<div class="flex ml-10 gap-3">
			<FunctionalCalendar
				v-model="calendarData"
				:is-dark="true"
				:is-modal="true"
				:is-date-range="true"
				@selectedDaysCount="onClose"
			/>
			<button
				class="text-white h-10 bg-gray-700 px-3 rounded"
				@click="makePdf"
			>
				Export
			</button>
		</div>
		<div class="invisible">
			<vue-apex-charts
				ref="barchart"
				type="bar"
				height="350"
				:options="chartOptions"
				:series="series"
			/>
			<vue-apex-charts
				ref="eventPercent"
				type="pie"
				width="480"
				:options="eventPercentage.chartOptions"
				:series="eventPercentage.series"
			/>
			<vue-apex-charts
				ref="allEventPhase"
				type="bar"
				height="350"
				:options="allPhaseEvent.chartOptions"
				:series="allPhaseEvent.series"
			/>
			<vue-apex-charts
				v-if="!loading"
				ref="eventSeverity"
				type="bar"
				height="350"
				:options="eventSeverity.chartOptions"
				:series="eventSeverity.series"
			/>
			<vue-apex-charts
				ref="eventDetail"
				type="line"
				height="350"
				:options="eventDetail.chartOptions"
				:series="eventDetail.series"
			/>
			<vue-apex-charts
				ref="eventDetail2"
				type="line"
				height="400"
				:options="eventDetail2.options"
				:series="eventDetail2.series"
			/>
		</div>
		<canvas id="canvas" />
	</div>
</template>

<script>
import pdfMake from 'pdfmake-lite'
import pdfFonts from 'pdfmake-lite/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs
import VueApexCharts from 'vue-apexcharts'
import Apexcharts from 'apexcharts'
import { eventService } from '../../_services/event.service'
import moment from 'moment'
import { aircraftService } from '../../_services/aircraft.service'
import { airlinesService } from '../../_services/airlines.service'
import { aircraftModelService } from '@/_services/aircraft-model.service'
import { mapActions } from 'vuex'
import { flightService } from '../../_services/flight.service'
import { otherService } from '../../_services/other.service'

const levels = [ 'L','M','H' ]

export default {
	name: 'FdmReport',
	components: { VueApexCharts },
	data () {
		return {
			calendarData: {},
			aircrafts: [],
			events: [],
			flights: [],
			series: [ {
				name: 'Low',
				data: [ 44, 55, 41, 67, 22, 43, 12, 33, 38, 42, 47 ]
			}, {
				name: 'Medium',
				data: [ 13, 23, 20, 8, 13, 27, 9, 12, 14, 17, 20 ]
			}, {
				name: 'High',
				data: [ 11, 17, 15, 15, 21, 14, 11, 8, 5, 18, 20 ]
			} ],
			chartOptions: {
				chart: {
					type: 'bar',
					height: 350,
					stacked: true,
					foreColor: '#000',
					toolbar: {
						show: false
					},
				},
				dataLabels: {
					style: {
						colors: [ '#000000' ]
					}
				},
				responsive: [ {
					breakpoint: 480,
					options: {
						legend: {
							position: 'bottom',
							offsetX: -10,
							offsetY: 0
						}
					}
				} ],
				plotOptions: {
					bar: {
						borderRadius: 8,
						horizontal: false,
					},
				},
				grid: {
					show: false
				},
				colors: [ '#f0fc0d','#fcb00d','#fc2003' ],
				yaxis: {
					labels: {
						show: false,
					},
				},
				xaxis: {
					labels: {
						show: true,
					},
					axisTicks: {
						show: false,
					},
					categories: [ 'Pre Flight', 'Taxi Out', 'Take Off', 'Initial Climb',
						'Climb', 'Cruise', 'Descent', 'Go-Around', 'Approach', 'Landing', 'Tax In'
					],
				},
				legend: {
					position: 'top',
					// offsetY: 40
				},
				fill: {
					opacity: 1
				}
			},
			eventPercentage: {
				series: [ 1, 10, 20, 25, 30, 40, 37, 50, 13, 25, 25 ],
				chartOptions: {
					fill: {
						colors: [ 
							'#f94144', '#f3722c', '#f8961e', '#f9844a', 
							'#f9c74f', '#90be6d', '#43aa8b',
							'#4d908e', '#577590', '#277da1', '#0077B6' 
						]
					},
					labels: [ 
						'Pre Flight', 'Taxi Out', 'Take Off', 
						'Initial Climb','Climb', 'Cruise', 'Descent', 
						'Go-Around', 'Approach', 'Landing', 'Tax In'
					],

					stroke: {
						width: 0,
						// colors: 'inherit'
					},
					yaxis: {
						show: false
					},
					xaxis: {
						show: false
					},
					legend: {
						show:true
					},
					dataLabels: {
						enabled: true,
						textAnchor: 'start',
						formatter: function (val, opt) {
							const total = opt.w.globals.series.reduce((acc, i) => acc + i)
							return [ opt.w.globals.labels[opt.seriesIndex], (opt.w.globals.series[opt.seriesIndex] * 100 / total).toFixed() + '%' ]
						},
						style: {
							fontSize: '10px',
							fontWeight: 'normal',
							colors: [ '#fff' ],
						},
						background: {
							enabled: false,
						},
					},
				},
			},
			allPhaseEvent: {
				series: [ {
					name: 'Low',
					data: [ 44, 55, 41 ]
				}, {
					name: 'Medium',
					data: [ 13, 23, 20 ]
				}, {
					name: 'High',
					data: [ 11, 17, 15 ]
				}, ],
				chartOptions: {
					title: {
						text: 'Events of All Phases (EX-37402)',
						align: 'center',
						style: {
							fontSize:  '15px',
							fontWeight:  'normal',
							fontFamily:  undefined,
							color:  '#000'
						},
						foreColor: '#000',
					},
					colors: [ '#f0fc0d','#fcb00d','#fc2003' ],
					chart: {
						type: 'bar',
						height: 350,
						stacked: true,
						toolbar: {
							show: true
						},
						zoom: {
							enabled: true
						},
					},
					dataLabels: {
						style: {
							colors: [ '#000000' ]
						}
					},
					responsive: [ {
						breakpoint: 480,
						options: {
							legend: {
								position: 'bottom',
								offsetX: -10,
								offsetY: 0
							}
						}
					} ],
					plotOptions: {
						bar: {
							borderRadius: 8,
							horizontal: false,
							columnWidth: '40%'
						},
					},
					xaxis: {
						categories: [ 'MLW Exceedance', 'Speed high (low alt)', 'Speed high below 10000' ],
						title: {
							text: 'Event definition',
						},
					},
					yaxis: {
						title: {
							text: 'Number of Events',
							// style: {
							// 	fontSize: '15px'
							// }
						},
					},
					legend: {
						position: 'bottom',
						offsetY: 5,
						offsetX: 20
					},
					fill: {
						opacity: 1
					}
				},
			},
			eventSeverity: {
				series: [ {
					name: 'Event Severity',
					data: [ 3, 2, 3 ]
				} ],
				chartOptions: {
					title: {
						text: 'Events Of EX-37402',
						align: 'center',
						style: {
							fontSize:  '15px',
							fontWeight:  'normal',
							fontFamily:  undefined,
							color:  '#000'
						},
						foreColor: '#000',
					},
					colors: [ '#f0fc0d','#fcb00d','#fc2003' ],
					chart: {
						type: 'bar',
						height: 350,
						stacked: false,
						toolbar: {
							show: true
						},
						zoom: {
							enabled: true
						},
					},
					dataLabels: {
						style: {
							colors: [ '#000000' ]
						}
					},
					responsive: [ {
						breakpoint: 480,
						options: {
							legend: {
								position: 'bottom',
								offsetX: -10,
								offsetY: 0
							}
						}
					} ],
					plotOptions: {
						bar: {
							borderRadius: 8,
							horizontal: false,
							columnWidth: '40%',
							distributed: true
						},
					},
					xaxis: {
						categories: [ 'Low', 'Medium', 'High' ],
						title: {
							text: 'Event Severity',
						},
					},
					yaxis: {
						title: {
							text: 'Number Of Events',
							// style: {
							// 	fontSize: '15px'
							// }
						},
					},
					legend: {
						show: false
					},
					fill: {
						opacity: 1
					}
				},
			},
			eventDetail: {
				series: [ {
					name: 'Desktops',
					data: [ 10, 41, 35, 51, 49, 62, 69, 91, 148 ]
				} ],
				chartOptions: {
					chart: {
						height: 350,
						type: 'line',
						zoom: {
							enabled: false
						},
						toolbar: {
							show: false
						}
					},
					annotations: {
						xaxis: [ {
							x: 'Mar',
							strokeDashArray: 0,
							borderColor: '#775DD0',
							label: {
								borderColor: '#775DD0',
								style: {
									color: '#fff',
									background: '#775DD0',
								},
								text: 'Speed high (low alt)',
							}
						}, ]
					},
					dataLabels: {
						enabled: false
					},
					stroke: {
						curve: 'smooth',
						width: 2
					},
					grid: {
						padding: {
							right: 30,
							left: 20
						}
					},
					xaxis: {
						categories: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep' ],
					},
					yaxis: {
						title: {
							text: 'Pressure Altitude (feet)',
						},
					}
				},
			},
			eventDetail2: {
				series: [
					{
						name: 'Computed Airspeed (knots)',
						data: [ 1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6 ]
					},
					{
						name: 'Radio Height (feet)',
						data: [ 20, 29, 37, 36, 44, 45, 50, 58 ]
					},
					{
						name: 'Pressure Altiitude (feet)',
						data: [ 10, 19, 17, 36, 44, 45, 20, 38 ]
					}
				],
				options: {
					chart: {
						height: 300,
						type: 'line',
						stacked: false,
						toolbar: {
							show: false
						}
					},
					dataLabels: {
						enabled: true,
						textAnchor: 'end',
						offsetX: -3,
						formatter: function (value, { seriesIndex, dataPointIndex, w }) {
							if (dataPointIndex === 2) return value
							return ''
						}
					},
					colors: [ '#FF1654', '#247BA0', '#f2aa24' ],
					stroke: {
						width: [ 2,2,2 ],
						curve: 'smooth'
					},
					plotOptions: {
						bar: {
							columnWidth: '20%'
						}
					},
					annotations: {
						xaxis: [ {
							x: 2011,
							strokeDashArray: 0,
							borderColor: '#775DD0',
							label: {
								borderColor: '#775DD0',
								style: {
									color: '#fff',
									background: '#775DD0',
								},
								text: 'Speed high (low alt)',
							}
						}, ]
					},
					labels: [ 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 ],
					xaxis: {
						categories: [ 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 ]
					},
					yaxis: [
						{
							axisTicks: {
								show: true
							},
							axisBorder: {
								show: true,
								color: '#FF1654'
							},
							labels: {
								style: {
									colors: '#FF1654'
								}
							},
							title: {
								text: 'Computed Airspeed (knots)',
								style: {
									color: '#FF1654'
								}
							}
						},
						{
							opposite: true,
							axisTicks: {
								show: true
							},
							axisBorder: {
								show: true,
								color: '#247BA0'
							},
							labels: {
								style: {
									colors: '#247BA0'
								}
							},
							title: {
								text: 'Radio Height (feet)',
								style: {
									color: '#247BA0'
								}
							}
						},
                        	{
							opposite: true,
							axisTicks: {
								show: true
							},
							axisBorder: {
								show: true,
								color: '#f2aa24'
							},
							labels: {
								style: {
									colors: '#f2aa24'
								}
							},
							title: {
								text: 'Pressure Altiitude (feet)',
								style: {
									color: '#f2aa24'
								}
							}
						}
					],
					tooltip: {
						shared: false,
						intersect: true,
						x: {
							show: false
						}
					},
					legend: {
						show: false
					}
				}
			},
			loading: false,
			startDate: '',
			endDate: '',
			airline: {}
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	mounted () {
		// this.makePdf()
		// this.drawChart()
		// this.getData()
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		drawChart () {
			return this.$refs.barchart.chart.dataURI().then(uri => {
				return uri.imgURI
			})
		},
		getData () {
			this.setLoading(true)
			const start = moment(this.calendarData.dateRange.start, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
			const end = moment(this.calendarData.dateRange.end, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
			this.loading = true
			return aircraftService.getAll(this.userProfile.user.airline[0]).then(async res => {
				this.aircrafts = res
				for (const i of this.aircrafts) {
					const model = await aircraftModelService.getById(i.aircraft_model)
					i.modelTitle = model.title
					i.modelCode = model.code
				}
				this.events = await eventService.getAll()
				this.eventSeverity.series[0].data = levels.map(i => {
					return this.events.filter(j => j.event_severity === i).length
				})
				this.flights = await flightService.getAll('',start, end)
				this.airline = await airlinesService.getById(this.userProfile.user.airline[0])
			}).catch(err => {
				this.loading = false
				this.setLoading(false)
				console.log(err)
			})
		},
		onClose () {
			// this.setCalendar({
			this.startDate = moment(this.calendarData.dateRange.start, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY'),
			this.endDate = moment(this.calendarData.dateRange.end, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY')
			// })
		},
		async makePdf () {
			await this.getData()
			const start = moment(this.calendarData.dateRange.start, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
			const end = moment(this.calendarData.dateRange.end, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
			let reports = []
			try {
				reports = await otherService.getAirlineReport(this.userProfile.user.airline[0], start, end)
			} catch (err) {
				console.log(err)
				this.loading = false
				this.setLoading(false)
				this.$toastr.e(err)
			}
			this.loading = false
			this.setLoading(false)
			function toDataURL (src, callback, outputFormat) {
				const image = new Image()
				image.crossOrigin = 'Anonymous'
				image.onload = function () {
					const canvas = document.createElement('canvas')
					const ctx = canvas.getContext('2d')
					canvas.height = this.naturalHeight
					canvas.width = this.naturalWidth
					ctx.drawImage(this, 0, 0)
					const dataURL = canvas.toDataURL(outputFormat)
					callback(dataURL)
				}
				image.src = src
				if (image.complete || image.complete === undefined) {
					image.src = src
				}
			}
			function getEventName (severity) {
				return severity === 'L' ? 'Low' : severity === 'M' ? 'Medium' : 'High'
			}
			function getEventColor (severity) {
				return severity === 'L' ? '#fcbf49' : severity === 'M' ? '#f77f00' : '#ef233c'
			}
			toDataURL('img/airmanas.jpg',
				async dataUrl => {
					const flightPhase = await this.drawChart()
					const eventPercent = await this.$refs.eventPercent.chart.dataURI()
					const allEventPhase = await this.$refs.allEventPhase.chart.dataURI()
					const eventSeverity = await this.$refs.eventSeverity.chart.dataURI()
					const eventDetail = await this.$refs.eventDetail.chart.dataURI()
					const eventDetail2 = await this.$refs.eventDetail2.chart.dataURI()
					const a = document.getElementById('phase')
					const primaryColor = '#083e5e'
					const cv = document.createElement('canvas')
					const ctx = cv.getContext('2d')
					ctx.beginPath()
					ctx.moveTo(0, 0)
					ctx.lineTo(530, 0)
					ctx.strokeStyle = '#0b29b0'
					ctx.lineWidth = 30
					ctx.stroke()
					const line = cv.toDataURL()
					const docDefinition = {
						info: {
							title: 'Title',
							author: 'SigmaSoft Team',
						},
						compress: false,
						pageOrientation: 'portrait',
						pageMargins: [ 30, 10, 30, 30 ],
						pageSize: 'A4',
						ownerPassword: '123456',
						permissions: {
							printing: 'highResolution', //'lowResolution'
							modifying: false,
							copying: false,
							annotating: true,
							fillingForms: true,
							contentAccessibility: true,
							documentAssembly: true
						},
						content: [
							{
								image: 'imageUrl',
								width: 150,
								height: 25,
								style: 'logo'
							},
							{
								text: 'AIR MANAS AIRLINES',
								style: 'header2',
							},
							{
								text: `FDM REPORT (${this.airline.title})`,
								style: 'header',
							},
							{
								text: 'ISSUE DATE: '+moment().format('DD/MM/YYYY'),
								style: 'header4',
							},
							{
								text: '',
								pageBreak: 'after'
							},
							{
								text: 'Part 1: General Information',
								style: 'header3',
								pageBreak: 'after'
							},
							{
								stack: [
									{
										text: 'FDM Report'
									},
									{
										text: this.airline.title
									}
								],
								style: 'header4'
							},
							{
								image: 'line',
								width: 530,
								height: 25,
								style: 'line'
							},
							{
								text: '1-1     General Information:',
								style: 'header5'
							},
							{
								style: 'table',
								table: {
									widths: [ 220, 220 ],
									// heights: [ 20, 20, 20 ],
									body: [
										[
											{ text: 'Aircrafts Type', style: 'tableTh' },
											{ text: this.aircrafts.map(i => i.modelTitle).join(', '), style: 'tableTd' }
										],
										[
											{ text: 'Aircrafts Registration', style: 'tableTh' },
											{ text: this.aircrafts.map(i => i.reg_number).join(', '), style: 'tableTd' }
										],
										// [
										// 	{ text: 'Number of Flights', style: 'tableTh' },
										// 	{ text: reports.number_of_flights, style: 'tableTd' }
										// ],
										// [
										// 	{ text: 'Number of Events', style: 'tableTh' },
										// 	{ text: 0, style: 'tableTd' }
										// ],
									]
								},
								layout: {
									fillColor: function (rowIndex, node, columnIndex) {
										return (rowIndex % 2 === 0) ?  '#f7e7bc' : '#dfeaf0'
									},
									hLineColor: function (i, node) {
										return 'black'
									},
									vLineColor: function (i, node) {
										return 'black'
									},
									hLineWidth: function (i, node) {
										return 0.5
									},
									vLineWidth: function (i, node) {
										return 0.5
									},
								},
							},
							{
								text: '1-2     Read Out Information:',
								style: 'header5'
							},
							{
								style: 'table',
								table: {
									widths: [ 18, 140, 140, 140 ],
									// heights: [ 20, 20, 20 ],
									body: [
										[
											{ text: 'No.', style: 'tableTh', rowSpan: 2,alignment: 'center', margin: [ 0, 8, 0, 0 ] },
											{ text: 'Generation Date', style: 'tableTh', rowSpan: 2, alignment: 'center', margin: [ 0, 8, 0, 0 ] },
											{ 
												text: 'Flights Date', 
												style: 'tableTh', 
												colSpan: 2,
												margin: [ 0,0,0,0 ],
												alignment: 'center'
											},
											''
										],
										[ 
											'', '', 
											{ text: 'From', style: 'tableTh', margin: [ 0,0,0,0 ], alignment: 'center' },
											{ text: 'To', style: 'tableTh', margin: [ 0,0,0,0 ], alignment: 'center' },
										],
										[
											{ text: 1, style: 'tableTd', alignment: 'center' },
											{ text: moment().format('DD/MM/YYYY'), style: 'tableTd', alignment: 'center' },
											{ text: this.startDate, style: 'tableTd', alignment: 'center' },
											{ text: this.endDate, style: 'tableTd', alignment: 'center' }
										]
									]
								},
								layout: {
									fillColor: function (rowIndex, node, columnIndex) {
										return (rowIndex > 1) ?  '#f7e7bc' : '#dfeaf0'
									},
									hLineColor: function (i, node) {
										return 'black'
									},
									vLineColor: function (i, node) {
										return 'black'
									},
									hLineWidth: function (i, node) {
										return 0.5
									},
									vLineWidth: function (i, node) {
										return 0.5
									},
								},
							},
							{
								image: 'line',
								width: 530,
								height: 20,
								style: 'line',
								margin: [ 0, 380, 0, 0 ]
							},
							{
								margin: [ 0, -10, 0, 0 ], fontSize: 9,
								columns: [
									{ text: 'Date: ' + moment().format('DD/MM/YYYY'), width: 176, alignment: 'left', margin: [ 8, 0, 0, 0 ] },
									{ text: this.airline.title, width: 176, alignment: 'center', bold: true },
									{ text: [
										'Page: ',
										{ text: '3 ', bold: true },
										'of ',
										{ text: '6', bold: true },
									], alignment: 'right', margin: [ 0, 0, 8, 0 ] }
								],
								pageBreak: 'after'
							},
							{
								text: 'Part 2: Graph of Events',
								style: 'header3',
							},
							// {
							// 	stack: [
							// 		{
							// 			text: 'FDM Report'
							// 		},
							// 		{
							// 			text: 'EP-37402'
							// 		}
							// 	],
							// 	pageBreak: 'before',
							// 	style: 'header4',
							// 	pageOrientation: 'landscape'
							// },
							// {
							// 	image: 'line',
							// 	width: 770,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	text: '3-1   Event Detection in All Phases and Airports:',
							// 	style: 'header5',
							// 	margin: [ 5,-10,0,50 ]
							// },
							// {
							// 	image: 'phaseChart',
							// 	alignment: 'center',
							// 	width: 780,
							// 	height: 240,
							// },
							// {
							// 	text: 'Figure 1: Number of Events vs Phase of Flight',
							// 	margin: [ 0, 20, 0, 55 ],
							// 	alignment: 'center',
							// 	fontSize: 11
							// },
							// {
							// 	image: 'line',
							// 	width: 770,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	margin: [ 0, -10, 0, 0 ], fontSize: 11,
							// 	columns: [
							// 		{ text: 'Date: 16/03/2021', width: 300, alignment: 'left', margin: [ 8, 0, 0, 0 ] },
							// 		{ text: 'AIRSA-FDMMANAS-37402-21-01', width: 180, alignment: 'center', bold: true },
							// 		{ text: [
							// 			'Page: ',
							// 			{ text: '5 ', bold: true },
							// 			'of ',
							// 			{ text: '32', bold: true },
							// 		], alignment: 'right', margin: [ 0, 0, 8, 0 ] }
							// 	],
							// 	pageBreak: 'after'
							// },
							// {
							// 	stack: [
							// 		{
							// 			text: 'FDM Report'
							// 		},
							// 		{
							// 			text: 'EP-37402'
							// 		}
							// 	],
							// 	style: 'header4'
							// },
							// {
							// 	image: 'line',
							// 	width: 770,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	text: 'Events by Flight Phase',
							// 	style: 'header5',
							// 	margin: [ 5,-10,0,50 ],
							// 	alignment: 'center'
							// },
							// {
							// 	image: 'eventPercentage',
							// 	alignment: 'center',
							// 	width: 450,
							// 	height: 310,
							// },
							// {
							// 	text: 'Figure 2: The percentage of events in each phase of flight',
							// 	margin: [ 0, 20, 0, 40 ],
							// 	alignment: 'center',
							// 	fontSize: 11
							// },
							// {
							// 	image: 'line',
							// 	width: 770,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	margin: [ 0, -10, 0, 0 ], fontSize: 11,
							// 	columns: [
							// 		{ text: 'Date: 16/03/2021', width: 300, alignment: 'left', margin: [ 8, 0, 0, 0 ] },
							// 		{ text: 'AIRSA-FDMMANAS-37402-21-01', width: 180, alignment: 'center', bold: true },
							// 		{ text: [
							// 			'Page: ',
							// 			{ text: '6 ', bold: true },
							// 			'of ',
							// 			{ text: '32', bold: true },
							// 		], alignment: 'right', margin: [ 0, 0, 8, 0 ] }
							// 	],
							// 	pageBreak: 'after'
							// },
							// {
							// 	stack: [
							// 		{
							// 			text: 'FDM Report'
							// 		},
							// 		{
							// 			text: 'EP-37402'
							// 		}
							// 	],
							// 	style: 'header4'
							// },
							// {
							// 	image: 'line',
							// 	width: 770,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	image: 'allEventPhase',
							// 	alignment: 'center',
							// 	width: 770,
							// 	height: 280,
							// },
							// {
							// 	text: 'Figure 3: Number of Events vs Event Definition',
							// 	margin: [ 0, 20, 0, 50 ],
							// 	alignment: 'center',
							// 	fontSize: 11
							// },
							// {
							// 	margin: [ 30, 0, 0, 20 ],
							// 	table: {
							// 		widths: [ 100, 600 ],
							// 		// heights: [ 20, 20, 20 ],
							// 		body: [
							// 			[
							// 				{ text: 'Analysis: ', style: 'tableTh', alignment: 'center', margin: [ 0, 8, 0, 8 ] },
							// 				''
							// 			],
							// 		]
							// 	},
							// 	layout: {
							// 		hLineColor: function (i, node) {
							// 			return 'black'
							// 		},
							// 		vLineColor: function (i, node) {
							// 			return 'black'
							// 		},
							// 		hLineWidth: function (i, node) {
							// 			return 0.5
							// 		},
							// 		vLineWidth: function (i, node) {
							// 			return 0.5
							// 		},
							// 	},
							// },
							// {
							// 	image: 'line',
							// 	width: 770,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	margin: [ 0, -10, 0, 0 ], fontSize: 11,
							// 	columns: [
							// 		{ text: 'Date: 16/03/2021', width: 300, alignment: 'left', margin: [ 8, 0, 0, 0 ] },
							// 		{ text: 'AIRSA-FDMMANAS-37402-21-01', width: 180, alignment: 'center', bold: true },
							// 		{ text: [
							// 			'Page: ',
							// 			{ text: '7 ', bold: true },
							// 			'of ',
							// 			{ text: '32', bold: true },
							// 		], alignment: 'right', margin: [ 0, 0, 8, 0 ] }
							// 	],
							// 	pageBreak: 'after'
							// },
							// {
							// 	stack: [
							// 		{
							// 			text: 'FDM Report'
							// 		},
							// 		{
							// 			text: this.airline.title
							// 		}
							// 	],
							// 	style: 'header4'
							// },
							// {
							// 	image: 'line',
							// 	width: 770,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	image: 'eventSeverity',
							// 	alignment: 'center',
							// 	width: 690,
							// 	height: 310,
							// },
							// {
							// 	text: 'Figure 4: Number of Events vs Event Severity',
							// 	margin: [ 0, 20, 0, 50 ],
							// 	alignment: 'center',
							// 	fontSize: 11
							// },
							// {
							// 	margin: [ 30, 0, 0, 20 ],
							// 	table: {
							// 		widths: [ 100, 600 ],
							// 		// heights: [ 20, 20, 20 ],
							// 		body: [
							// 			[
							// 				{ text: 'Analysis: ', style: 'tableTh', alignment: 'center', margin: [ 0, 8, 0, 8 ] },
							// 				''
							// 			],
							// 		]
							// 	},
							// 	layout: {
							// 		hLineColor: function (i, node) {
							// 			return 'black'
							// 		},
							// 		vLineColor: function (i, node) {
							// 			return 'black'
							// 		},
							// 		hLineWidth: function (i, node) {
							// 			return 0.5
							// 		},
							// 		vLineWidth: function (i, node) {
							// 			return 0.5
							// 		},
							// 	},
							// },
							// {
							// 	image: 'line',
							// 	width: 770,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	margin: [ 0, -10, 0, 0 ], fontSize: 11,
							// 	columns: [
							// 		{ text: 'Date: 16/03/2021', width: 300, alignment: 'left', margin: [ 8, 0, 0, 0 ] },
							// 		{ text: 'AIRSA-FDMMANAS-37402-21-01', width: 180, alignment: 'center', bold: true },
							// 		{ text: [
							// 			'Page: ',
							// 			{ text: '8 ', bold: true },
							// 			'of ',
							// 			{ text: '32', bold: true },
							// 		], alignment: 'right', margin: [ 0, 0, 8, 0 ] }
							// 	],
							// 	pageBreak: 'after'
							// },
							{
								stack: [
									{
										text: 'FDM Report'
									},
									{
										text: this.airline.title
									}
								],
								style: 'header4',
								pageBreak: 'before'
							},
							{
								image: 'line',
								width: 770,
								height: 25,
								style: 'line',
							},
							// {
							// 	margin: [ 30, 0, 0, 170 ],
							// 	table: {
							// 		widths: [ 300, 80, 150, 150 ],
							// 		// heights: [ 20, 20, 20 ],
							// 		body: [
							// 			[
							// 				{ text: 'Event Definitions', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'Severity', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'Flight Phase Name', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'Number of Events', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 			],
							// 			[
							// 				{ text: 'MLW Exceedance', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'High', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Landing', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '2', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 			],
							// 		]
							// 	},
							// 	layout: {
							// 		hLineColor: function (i, node) {
							// 			return 'black'
							// 		},
							// 		vLineColor: function (i, node) {
							// 			return 'black'
							// 		},
							// 		hLineWidth: function (i, node) {
							// 			return 0.5
							// 		},
							// 		vLineWidth: function (i, node) {
							// 			return 0.5
							// 		},
							// 	},
							// },
							{
								text: '1-1     Events occured:',
								style: 'header5'
							},
							{
								style: 'table',
								table: {
									widths: [ 220, 220 ],
									// heights: [ 20, 20, 20 ],
									body: [
										[
											{ text: 'Event Name', style: 'tableTh' },
											{ text: 'Occured', style: 'tableTh' }
										],
										...reports.events_occured.map(i => {
											return [
												{ text: i.title, style: 'tableTd' },
												{ text: i.occured, style: 'tableTd' }
											]
										})
									]
								},
								layout: {
									fillColor: function (rowIndex, node, columnIndex) {
										return (rowIndex % 2 === 0) ?  '#f7e7bc' : '#dfeaf0'
									},
									hLineColor: function (i, node) {
										return 'black'
									},
									vLineColor: function (i, node) {
										return 'black'
									},
									hLineWidth: function (i, node) {
										return 0.5
									},
									vLineWidth: function (i, node) {
										return 0.5
									},
								},
							},
							{
								text: '1-2     Max values:',
								style: 'header5'
							},
							{
								style: 'table',
								table: {
									widths: [ 110, 110, 110, 110 ],
									// heights: [ 20, 20, 20 ],
									body: [
										[
											{ text: 'Parameter name', style: 'tableTh' },
											{ text: 'Value', style: 'tableTh' },
											{ text: 'Date & Time', style: 'tableTh' },
											{ text: 'Flight Detail', style: 'tableTh' },
										],
										...reports.max_malues.map(i => {
											return [
												{ text: i.title, style: 'tableTd' },
												{ text: i.value, style: 'tableTd' },
												{ text: i.timestamp, style: 'tableTd' },
												{ text: i.flight_detail, style: 'tableTd' }
											]
										})
									]
								},
								layout: {
									fillColor: function (rowIndex, node, columnIndex) {
										return (rowIndex % 2 === 0) ?  '#f7e7bc' : '#dfeaf0'
									},
									hLineColor: function (i, node) {
										return 'black'
									},
									vLineColor: function (i, node) {
										return 'black'
									},
									hLineWidth: function (i, node) {
										return 0.5
									},
									vLineWidth: function (i, node) {
										return 0.5
									},
								},
							},
							{
								text: '1-3     Warning events:',
								style: 'header5'
							},
							{
								style: 'table',
								table: {
									widths: [ 220, 220 ],
									// heights: [ 20, 20, 20 ],
									body: [
										[
											{ text: 'Event Name', style: 'tableTh' },
											{ text: 'Occured', style: 'tableTh' },
										],
										...reports.warning_events.map(i => {
											return [
												{ text: i.title, style: 'tableTd' },
												{ text: i.occured, style: 'tableTd' }
											]
										})
									]
								},
								layout: {
									fillColor: function (rowIndex, node, columnIndex) {
										return (rowIndex % 2 === 0) ?  '#f7e7bc' : '#dfeaf0'
									},
									hLineColor: function (i, node) {
										return 'black'
									},
									vLineColor: function (i, node) {
										return 'black'
									},
									hLineWidth: function (i, node) {
										return 0.5
									},
									vLineWidth: function (i, node) {
										return 0.5
									},
								},
							},

							// {
							// 	text: 'Part 4: Details of Events',
							// 	style: 'header3',
							// 	pageOrientation: 'portrait',
							// 	pageBreak: 'before'
							// },

							// ...this.events.map((i, index) => {
							// 	return [
							// 		{
							// 			stack: [
							// 				{
							// 					text: 'FDM Report'
							// 				},
							// 				{
							// 					text: this.airline.title
							// 				}
							// 			],
							// 			style: 'header4',
							// 			pageOrientation: 'landscape',
							// 			pageBreak: 'before'
							// 		},
							// 		{
							// 			image: 'line',
							// 			width: 770,
							// 			height: 25,
							// 			style: 'line',
							// 		},
							// 		{
							// 			margin: [ 30, -10, 0, 20 ],
							// 			table: {
							// 				fontSize: 9,
							// 				widths: [ 110, 110, 110, 110, 110, 110 ],
							// 				// heights: [ 20, 20, 20 ],
							// 				alignment: 'center',
							// 				body: [
							// 					[
							// 						{ text: `${index + 1}-Event: ${i.event_name}`, bold: true, alignment: 'center', fillColor: '#f5d68e', colSpan: 6 },
							// 						'','','', '', ''
							// 					],
							// 					[
							// 						{ text: 'Event Duration', style: 'eventD', alignment: 'center', fillColor: '#d1d1d1' },
							// 						{ text: 'Severity', style: 'eventD', alignment: 'center', fillColor: '#d1d1d1' },
							// 						{ text: 'Flight Phase', style: 'eventD', alignment: 'center', fillColor: '#d1d1d1' },
							// 						{ text: 'Event Time (GMT)', style: 'eventD', alignment: 'center', fillColor: '#d1d1d1' },
							// 						{ text: 'Pilot 1', style: 'eventD', alignment: 'center', fillColor: '#d1d1d1' },
							// 						{ text: 'Pilot 2', style: 'eventD',alignment: 'center', fillColor: '#d1d1d1' },
							// 					],
							// 					[
							// 						{ text: `${i.duration}s`,style: 'eventDN', alignment: 'center' },
							// 						{ text: `${getEventName(i.event_severity)}`,style: 'eventDN', alignment: 'center', fillColor: getEventColor(i.event_severity) },
							// 						{ text: 'Initial Climb',style: 'eventDN', alignment: 'center' },
							// 						{ text: moment(i.timestamp, 'DD/MM/YYYY hh:mm:ss').format('hh:mm:ss'),style: 'eventDN', alignment: 'center' },
							// 						{ text: 'Not Engaged',style: 'eventDN', alignment: 'center' },
							// 						{ text: 'Engaged',style: 'eventDN', alignment: 'center' },
							// 					]
							// 				]
							// 			},
							// 			layout: {
							// 				hLineColor: function (i, node) {
							// 					return 'black'
							// 				},
							// 				vLineColor: function (i, node) {
							// 					return 'black'
							// 				},
							// 				hLineWidth: function (i, node) {
							// 					return 0.5
							// 				},
							// 				vLineWidth: function (i, node) {
							// 					return 0.5
							// 				},
							// 			},
							// 		},
							// 		{
							// 			columns: [
							// 				{
							// 					margin: [ 30, 0, 0, 10 ],
							// 					table: {
							// 						fontSize: 9,
							// 						widths: [ 150, 150 ],
							// 						// alignment: 'center',
							// 						body: [
							// 							[
							// 								{ text: 'Takeoff Information', style: 'eventD', alignment: 'center', fillColor: '#6a9ebd', colSpan: 2 },
							// 								''
							// 							],
							// 							[
							// 								{ text: 'Takeoff Time point (GMT)', style: 'eventD', fillColor: '#d1d1d1' },
							// 								{ text: '12:50:26',style: 'eventDN', fillColor: '#d1d1d1' },
							// 							],
							// 							[
							// 								{ text: 'Departure Airport', style: 'eventD', fillColor: '#d1d1d1' },
							// 								{ text: 'UCFM',style: 'eventDN', fillColor: '#d1d1d1' },
							// 							],
							// 							[
							// 								{ 
							// 									colSpan: 2,
							// 									text: [
							// 										{ text: 'Weather:\n', style: 'eventD', },
							// 										{ text: 'UCFM 091230Z 26003MPS 8000 NSC M02/M04 Q1016 R26/0///95 NOSIG', style: 'eventDN' }
							// 									], 
							// 									fillColor: '#d1d1d1' 
							// 								}, ''
							// 							]
							// 						]
							// 					},
							// 					layout: {
							// 						hLineColor: function (i, node) {
							// 							return 'black'
							// 						},
							// 						vLineColor: function (i, node) {
							// 							return 'black'
							// 						},
							// 						hLineWidth: function (i, node) {
							// 							return 0.5
							// 						},
							// 						vLineWidth: function (i, node) {
							// 							return 0.5
							// 						},
							// 					},
							// 				},
							// 				{
							// 					margin: [ 30, 0, 0, 10 ],
							// 					table: {
							// 						fontSize: 9,
							// 						widths: [ 150, 150 ],
							// 						// alignment: 'center',
							// 						body: [
							// 							[
							// 								{ text: ' Landing Information', style: 'eventD', alignment: 'center', fillColor: '#faeed2', colSpan: 2 },
							// 								''
							// 							],
							// 							[
							// 								{ text: 'Landing Time point (GMT)', style: 'eventD', fillColor: '#d1d1d1' },
							// 								{ text: '13:24:29',style: 'eventDN', fillColor: '#d1d1d1' },
							// 							],
							// 							[
							// 								{ text: 'Arrival Airport', style: 'eventD', fillColor: '#d1d1d1' },
							// 								{ text: 'UCFO',style: 'eventDN', fillColor: '#d1d1d1' },
							// 							],
							// 							[
							// 								{ 
							// 									colSpan: 2,
							// 									text: [
							// 										{ text: 'Weather:\n',style: 'eventD', },
							// 										{ text: 'UCFO 1300Z 10001MPS 1900 FU SCT050 BKN133 04/M01 Q1016 R12/0///95 TEMPO 1000 BR FU', style: 'eventDN' }
							// 									], 
							// 									fillColor: '#d1d1d1' 
							// 								}, ''
							// 							]
							// 						]
							// 					},
							// 					layout: {
							// 						hLineColor: function (i, node) {
							// 							return 'black'
							// 						},
							// 						vLineColor: function (i, node) {
							// 							return 'black'
							// 						},
							// 						hLineWidth: function (i, node) {
							// 							return 0.5
							// 						},
							// 						vLineWidth: function (i, node) {
							// 							return 0.5
							// 						},
							// 					},
							// 				},
							// 			]
							// 		},
							// 		{
							// 			image: 'eventDetail',
							// 			alignment: 'center',
							// 			width: 560,
							// 			height: 180,
							// 		},
							// 		{
							// 			margin: [ 120, 10, 0, 10 ],
							// 			table: {
							// 				widths: [ 130, 130, 130, 100 ],
							// 				body: [
							// 					[
							// 						{ text: 'Captured Parameters', style: 'eventD', alignment: 'center', fillColor: '#ded9cc', colSpan: 4 },
							// 						'', '', ''
							// 					],
							// 					[
							// 						{ text: 'Standard Name', style: 'eventD', fillColor: '#ded9cc' },
							// 						{ text: 'Units',style: 'eventD', fillColor: '#ded9cc' },
							// 						{ text: 'Peak',style: 'eventD', fillColor: '#ded9cc' },
							// 						{ text: 'Limit',style: 'eventD', fillColor: '#ded9cc' },
							// 					],
							// 					[
							// 						{ text: 'Pressure Altitude', style: 'eventDN' },
							// 						{ text: '(feet)',style: 'eventDN' },
							// 						{ text: '3864',style: 'eventDN' },
							// 						{ text: '',style: 'eventDN' },
							// 					],
							// 					[
							// 						{ text: 'Radio Height', style: 'eventDN' },
							// 						{ text: '(feet)',style: 'eventDN' },
							// 						{ text: '2493',style: 'eventDN' },
							// 						{ text: '',style: 'eventDN' },
							// 					],
							// 					[
							// 						{ text: 'Computed Airspeed', style: 'eventDN' },
							// 						{ text: '(knots)',style: 'eventDN' },
							// 						{ text: '248',style: 'eventDN' },
							// 						{ text: '230',style: 'eventDN' },
							// 					],
							// 				]
							// 			},
							// 			layout: {
							// 				hLineColor: function (i, node) {
							// 					return 'black'
							// 				},
							// 				vLineColor: function (i, node) {
							// 					return 'black'
							// 				},
							// 				hLineWidth: function (i, node) {
							// 					return 0.5
							// 				},
							// 				vLineWidth: function (i, node) {
							// 					return 0.5
							// 				},
							// 			},
							// 		},
							// 		{
							// 			image: 'line',
							// 			width: 770,
							// 			height: 25,
							// 			style: 'line',
							// 		},
							// 		{
							// 			margin: [ 0, -10, 0, 0 ], fontSize: 11,
							// 			columns: [
							// 				{ text: 'Date: 16/03/2021', width: 300, alignment: 'left', margin: [ 8, 0, 0, 0 ] },
							// 				{ text: this.airline.title, width: 180, alignment: 'center', bold: true },
							// 				{ text: [
							// 					'Page: ',
							// 					{ text: 11 + 2 * index, bold: true },
							// 					'of ',
							// 					{ text: '32', bold: true },
							// 				], alignment: 'right', margin: [ 0, 0, 8, 0 ] }
							// 			],
							// 		},
							// 		{
							// 			stack: [
							// 				{
							// 					text: 'FDM Report'
							// 				},
							// 				{
							// 					text: this.airline.title
							// 				}
							// 			],
							// 			style: 'header4',
							// 			pageOrientation: 'landscape',
							// 			pageBreak: 'before'
							// 		},
							// 		{
							// 			image: 'line',
							// 			width: 770,
							// 			height: 25,
							// 			style: 'line',
							// 		},
							// 		{
							// 			margin: [ 30, 0, 0, 0 ],
							// 			table: {
							// 				widths: [ 700 ],
							// 				body: [
							// 					[
							// 						{ text: `1- ${i.event_name}`, style: 'tableTh', border: [ 1,1,1,1 ], fillColor: '#e3b11b' }
							// 					]
							// 				]
							// 			}
							// 		},
							// 		{
							// 			image: 'eventDetail2',
							// 			alignment: 'center',
							// 			width: 750,
							// 			height: 320,
							// 			margin: [ 0,30,0,60 ]
							// 		},
							// 		{
							// 			image: 'line',
							// 			width: 770,
							// 			height: 25,
							// 			style: 'line',
							// 		},
							// 		{
							// 			margin: [ 0, -10, 0, 0 ], fontSize: 11,
							// 			columns: [
							// 				{ text: 'Date: 16/03/2021', width: 300, alignment: 'left', margin: [ 8, 0, 0, 0 ] },
							// 				{ text: 'AIRSA-FDMMANAS-37402-21-01', width: 180, alignment: 'center', bold: true },
							// 				{ text: [
							// 					'Page: ',
							// 					{ text: 11 + index * 2 + 1, bold: true },
							// 					'of ',
							// 					{ text: '32', bold: true },
							// 				], alignment: 'right', margin: [ 0, 0, 8, 0 ] }
							// 			],
							// 		},
							// 	]
							// }).flat(),

							// {
							// 	text: 'Confidential Report',
							// 	fontSize: 18,
							// 	color: '#f23218',
							// 	pageOrientation: 'portrait',
							// 	pageBreak: 'before',
							// 	margin: [ 20, 40, 0, 5 ],
							// 	bold: true
							// },
							// {
							// 	table: {
							// 		widths: [ 180 ],
							// 		body: [
							// 			[
							// 				{
							// 					text: 'AIRSA-FDMMANAS-37402-21-01',
							// 					border: [ 1,1,1,1 ],
							// 					fillColor: '#ffde91',
							// 					alignment: 'center'
							// 				}
							// 			]
							// 		]
							// 	}
							// },
							// {
							// 	margin: [ 30, 300, 30, 100 ],
							// 	text:[
							// 		{
							// 			text: 'Part 5: Appendix\n (Identified Detail of Events)',
							// 			style: 'header3',
							// 		},
							// 		{
							// 			text: '\nCaution: After receiving the report, please detach this section.',
							// 			color: '#e65339',
							// 			fontSize: 8,
							// 			alignment: 'center',
							// 			margin: [ 0, 20, 0, 0 ]
							// 		}
							// 	],
							// },
							// {
							// 	stack: [
							// 		{
							// 			text: 'FDM Report'
							// 		},
							// 		{
							// 			text: this.airline.title
							// 		}
							// 	],
							// 	style: 'header4',
							// 	pageOrientation: 'portrait',
							// 	pageBreak: 'before'
							// },
							// {
							// 	image: 'line',
							// 	width: 550,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	text: '5-1   Identified Data:',
							// 	style: 'header5',
							// 	margin: [ 5,-10,0,50 ]
							// },
							// {
							// 	margin: [ -5, 0, 0, 500 ],
							// 	style: 'data',
							// 	table: {
							// 		widths: [ 30, 120, 40, 20,40,40,70,70,40 ],
							// 		// heights: [ 20, 20, 20 ],
									
							// 		body: [
							// 			[
							// 				{ text: 'Item', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'Event Definitions', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'Severity', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'FN', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'Dep. Airport', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'Arr. Airport', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'Date', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'Flight Phase', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 				{ text: 'No. of Events', style: 'tableTh', alignment: 'center', fillColor: '#6a9ebd' },
							// 			],
							// 			[
							// 				{ text: '1', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Speed high (low alt)', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Low', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '195', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'FRU', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'OSS', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '12/9/2019', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Initial Climb', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '1', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 			],
							// 			[
							// 				{ text: '2', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Speed high (low alt)', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Low', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '195', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'FRU', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'OSS', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '12/9/2019', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Initial Climb', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '1', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 			],
							// 			[
							// 				{ text: '3', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Speed high (low alt)', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Low', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '195', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'FRU', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'OSS', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '12/9/2019', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Initial Climb', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '1', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 			],
							// 			[
							// 				{ text: '4', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Speed high (low alt)', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Low', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '195', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'FRU', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'OSS', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '12/9/2019', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: 'Initial Climb', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 				{ text: '1', style: 'tableTd', alignment: 'center', fillColor: '#d1d1d1' },
							// 			]
							// 		]
							// 	},
							// 	layout: {
							// 		hLineColor: function (i, node) {
							// 			return 'black'
							// 		},
							// 		vLineColor: function (i, node) {
							// 			return 'black'
							// 		},
							// 		hLineWidth: function (i, node) {
							// 			return 0.5
							// 		},
							// 		vLineWidth: function (i, node) {
							// 			return 0.5
							// 		},
							// 	},
							// },
							// {
							// 	image: 'line',
							// 	width: 550,
							// 	height: 25,
							// 	style: 'line',
							// },
							// {
							// 	margin: [ 0, -10, 0, 0 ], fontSize: 11,
							// 	columns: [
							// 		{ text: 'Date: 16/03/2021', width: 170, alignment: 'left', margin: [ 8, 0, 0, 0 ] },
							// 		{ text: 'AIRSA-FDMMANAS-37402-21-01', width: 170, alignment: 'center', bold: true },
							// 		{ text: [
							// 			'Page: ',
							// 			{ text: '14 ', bold: true },
							// 			'of ',
							// 			{ text: '32', bold: true },
							// 		], alignment: 'right', margin: [ 0, 0, 8, 0 ] }
							// 	],
							// },
						],
						images: {
							imageUrl: dataUrl,
							line,
							phaseChart: flightPhase,
							eventPercentage: eventPercent.imgURI,
							allEventPhase: allEventPhase.imgURI,
							eventSeverity: eventSeverity.imgURI,
							eventDetail: eventDetail.imgURI,
							eventDetail2: eventDetail2.imgURI,
						},
						styles: {
							logo: {
								alignment: 'right',
								margin: [ 0, 20, 0, 0 ],
							},
							data: {
								fontSize: 10,
							},
							header: {
								fontSize: 36,
								bold: true,
								margin: [ 30, 280, 30, 320 ],
								alignment: 'center',
								color: primaryColor
							},
							header2: {
								fontSize: 22,
								bold: true,
								alignment: 'left',
								margin: [ 30, -25, 30, 30 ],
								color: primaryColor
							},
							header3: {
								fontSize: 22,
								bold: true,
								alignment: 'center',
								margin: [ 30, 350, 30, 100 ],
							},
							eventD: {
								bold: true,
								fontSize: 10
							},
							eventDN: {
								fontSize: 10
							},
							header4: {
								fontSize: 14,
								bold: true,
								alignment: 'center',
								color: primaryColor,
								border: [ true, true, true, true ],
							},
							ul: {
								fontSize: 12,
								margin: [ 50, 10, 10, 10 ]
							},
							line: {
								margin: [ 0, 5, 0, 5 ],
								alignment: 'center'
							},
							tableTh: {
								bold: true,
								margin: [ 0, 4, 0, 4 ]
							},
							tableTd: {
								margin: [ 0, 4, 0, 4 ],
							},
							header5: {
								fontSize: 16,
								bold: true,
								alignment: 'left',
								margin: [ 40, 20, 0, 20 ],
								color: '#227fb3',
							},
							table: {
								margin: [ 40,0,40,30 ],
								fontSize: 10
							}
						},
						defaultStyle: {
							// columnGap: 20
						}
					}
					pdfMake.createPdf(docDefinition).download(`Top triggers.pdf`)
				}
			)
		}
	}
}
</script>

<style lang="scss">
	.invisible {
		height: 0;
		overflow-y: hidden;
	}
</style>