<template>
	<div>
		<button
			class="print"
			@click="makeChart"
		>
			<img
				src="../../assets/icons/report.svg"
				alt=""
			> Print
		</button>
		<img
			id="image"
			src="/img/airmanas.jpg"
			alt=""
			hidden
		>
		<div
			id="canvas-content"
			style="position: absolute; z-index: -100"
		>
			<canvas
				id="canvas"
				height="450"
				width="600"
			/>
		</div>
	</div>
</template>

<script>
import pdfMake from 'pdfmake-lite'
import pdfFonts from 'pdfmake-lite/build/vfs_fonts'
const image = require('../../../public/img/airmanas.jpg')
import * as d3 from 'd3'
import Chart from 'chart.js'
import { otherService } from '../../_services/other.service'
import { mapActions } from 'vuex'

pdfMake.vfs = pdfFonts.pdfMake.vfs
export default {
	name: 'TopTriggers',
	props: {
		aircraft: { type: Number, default: 0 },
		start: { type: String, default: '' },
		end: { type: String, default: '' },
	},
	data () {
		return {
			bar: '',
			topEvents: [],
			topHighEvents: [],
			eventBars: [],
			months: [],
			now: new Date()
		}
	},
	methods: {
		...mapActions('loader', [ 'setLoading' ]),
		makeChart () {
			this.setLoading(true)
			otherService.topHighEvents().then(res => {
				this.topHighEvents = res
				const labels = res.map(i => i.title)
				const data = res.map(i => i.high)
				this.bar = new Chart(document.getElementById('canvas').getContext('2d'),{
					type: 'bar',
					data: {
						labels: labels,
						datasets: [ {
							label: 'High',
							data: data,
							backgroundColor: '#D82904',
						} ]
					},
					options: {
						title: {
							display: true,
							text: 'Top 10 High Severity Events per 100 Flights (Air Manas)',
							fontSize: 25,
							fontColor: '#000'
						},
						legend: {
							display: true,
							fontColor: '#000'
						},
						scales: {
							yAxes: [ {
								ticks: {
									beginAtZero: true,
									fontColor: '#000'
								},
								scaleLabel: {
									display: true,
									labelString: 'Event / 100 Flights',
									fontSize: 20,
									fontColor: '#000'
								}
							} ],
							xAxes: [ {
								ticks: {
									fontColor: '#000'
								},
								scaleLabel: {
									display: true,
									labelString: 'Event Name',
									fontSize: 20,
									fontColor: '#000'
								}
							} ]
						},
						animation: {
							// onComplete: this.exportPdf
						}
					}
				})
				return res
			}).then(res => {
				this.topHighEvents = res
				this.months = []
				this.eventBars = []
				for (let i = 1; i <= 12; i ++) {
					if (i < 10) {
						this.months.push({
							title: '0'+i,
							event: `0${i}_events`,
							flight: `0${i}_flight`
						})
					} else {
						this.months.push({
							title: i,
							event: `${i}_events`,
							flight: `${i}_flight`
						})
					}
				}
				res.forEach((trigger, index) => {
					const canvas = document.createElement('canvas')
					const content = document.getElementById('canvas-content')
					content.appendChild(canvas)
					canvas.width = 600
					canvas.height = 450
					const labels = []
					const data = this.months.filter(i => {
						if (trigger[i.event] > 0) {
							labels.push(this.now.getFullYear() + '-' + i.title)
							return true
						}
					}).map(i => trigger[i.event])
					const b = new Chart(canvas.getContext('2d'),{
						type: 'bar',
						data: {
							labels: labels,
							datasets: [ {
								label: 'High',
								data: data,
								backgroundColor: '#D82904',
							} ]
						},
						options: {
							title: {
								display: true,
								text: trigger.title,
								fontSize: 25,
								fontColor: '#000'
							},
							legend: {
								display: true,
								fontColor: '#000'
							},
							scales: {
								yAxes: [ {
									ticks: {
										beginAtZero: true,
										fontColor: '#000',
										fontSize: 12,
									},
									scaleLabel: {
										display: true,
										labelString: 'EVENT / 100 FLIGHTS',
										fontSize: 20,
										fontColor: '#000'
									}
								} ],
								xAxes: [ {
									ticks: {
										fontColor: '#000',
										fontSize: 12,
									},
									scaleLabel: {
										display: true,
										labelString: 'MONTH',
										fontSize: 20,
										fontColor: '#000'
									}
								} ]
							},
							animation: {
								onComplete: index + 1 === res.length ? this.exportPdf : ''
							}
						}
					})
					this.eventBars.push(b)
				})
			}).catch(err => {
				this.setLoading(false)
				console.log(err)
				this.$toastr.e(err)
			})
		},
		exportPdf () {
			const c = document.createElement('canvas')
			const img = document.getElementById('image')
			c.height = img.naturalHeight
			c.width = img.naturalWidth
			const ctx = c.getContext('2d')

			const items = this.topHighEvents.map(i => i.title)

			ctx.drawImage(img, 0, 0, c.width, c.height)
			const base64String = c.toDataURL()
			const docDefinition = {
				info: {
					title: 'Title',
					author: 'SigmaSoft Team',
				},
				pageOrientation: 'portrait',
				pageMargins: [ 30, 30, 30, 30 ],
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
						text: 'Air Manas EX-402 Monthly FDM Report March, 2021',
						style: 'header',
						pageBreak: 'after'
					},
					{
						image: 'imageUrl',
						width: 150,
						height: 25,
						style: 'logo',
					},
					{
						text: 'Table of Contents',
						style: 'subHeader'
					},
					{
						ol: [ 'Top 10 High Severity Events per 100 Flights (Air Manas)', ...items ],
						style: 'ul',
						pageBreak: 'after'
					},
					{
						image: 'imageUrl',
						width: 150,
						height: 25,
						style: 'logo',
					},
					{
						text: '1.  Top 10 High Severity Events per 100 Flights (Air Manas)',
						margin: [ 20, 30, 10, 20 ]
					},
					{
						image: this.bar.toBase64Image(),
						width: 450,
						height: 350
					},
					{
						style: 'table',
						table: {
							widths: [ 30, ...items.map(i => '*') ],
							body: [
								[
									{ text: '', style: 'tableTd' },
									...items.map(i => ({ text: i, style: 'tableTd' }))
								],
								[
									{ text: 'High Ratio', style: 'tableTd', alignment: 'left' },
									...this.topHighEvents.map(i => Math.round(i.high / i.n_of_flights).toFixed(2))
								],
								[
									{ text: 'High Count', style: 'tableTd', alignment: 'left' },
									...this.topHighEvents.map(i => i.high)
								],
								[
									{ text: 'Number of Flights', style: 'tableTd', alignment: 'left' },
									...this.topHighEvents.map(i => i.n_of_flights)
								],
							]
						},
						layout: {
							fillColor: function (rowIndex, node, columnIndex) {
								return (rowIndex === 0 || columnIndex === 0) ? '#CCCCCC' : null
							},
							hLineWidth: function (i, node) {
								return 0
							},
							vLineWidth: function (i, node) {
								return 0
							},
						},
					},
					...this.eventBars.map((i, index) => {
						const m = this.months.filter(e => {
							if (this.topHighEvents[index] && this.topHighEvents[index][e.event] > 0) {
								return true
							}
						})
						const events = m.map(e => this.topHighEvents[index] && this.topHighEvents[index][e.event])
						const monthNames = m.map(e => e.title)
						const flights = m.map(e => this.topHighEvents[index] && this.topHighEvents[index][e.flight])
						return [
							{
								image: 'imageUrl',
								width: 150,
								height: 25,
								style: 'logo',
								pageBreak: 'before'
							},
							{
								text: (index + 2) + '.    ' + (this.topHighEvents[index] && this.topHighEvents[index].title),
								margin: [ 20, 30, 10, 20 ]
							},
							{
								image: i.toBase64Image(),
								width: 450,
								height: 350,
							},
							{
								style: 'table',
								table: {
									widths: [ 30, ...events.map(i => '*') ],
									body: [
										[
											{ text: '', style: 'tableTd' },
											...monthNames.map(i => ({ text: this.now.getFullYear() + '-' + i, style: 'tableTd' }))
										],
										[
											{ text: 'High Ratio', style: 'tableTd', alignment: 'left' },
											...events.map((i, index) => Math.round(i / flights[index]).toFixed(2))
										],
										[
											{ text: 'High Count', style: 'tableTd', alignment: 'left' },
											...events.map(i => i)
										],
										[
											{ text: 'Number of Flights', style: 'tableTd', alignment: 'left' },
											...flights.map(i => i)
										],
									]
								},
								layout: {
									fillColor: function (rowIndex, node, columnIndex) {
										return (rowIndex === 0 || columnIndex === 0) ? '#CCCCCC' : null
									},
									hLineWidth: function (i, node) {
										return 0
									},
									vLineWidth: function (i, node) {
										return 0
									},
								},
							},
						]
					}).flat()
				],
				images: {
					imageUrl: base64String,
				},
				styles: {
					logo: {
						alignment: 'right'
					},
					header: {
						fontSize: 28,
						bold: true,
						margin: [ 30, 40, 30, 10 ],
						alignment: 'center',
					},
					subHeader: {
						fontSize: 18,
						bold: true,
						margin: [ 30, 30, 30, 30 ]
					},
					ul: {
						fontSize: 12,
						margin: [ 50, 10, 10, 10 ]
					},
					tableTd: {
						bold: true,
						fontSize: 8,
					},
					table: {
						margin: [ -15, 40, 0, 0 ],
						fontSize: 8,
						alignment: 'right'
					}
				},
				defaultStyle: {
					// columnGap: 20
				}
			}
			pdfMake.createPdf(docDefinition).download(`Top triggers.pdf`)
			this.setLoading(false)
		},
	}
}
</script>

<style lang="scss" scoped>
#image {
	display: none;
}
.print {
	width: 148px;
	height: 36px;
	border: 1px solid #FFFFFF;
	border-radius: 2px;
	background: inherit;
	outline: none;
	color: #FFFFFF;
	font-size: 14px;
	line-height: 19px;
	display: flex;
	align-items: center;
	justify-content: center;

	img {
		margin-right: 10px;
	}
}
.graph {
	width: auto;
}

.tooltip {
	color:black;
}

.axis {
	font: 12px Georgia, Arial, sans-serif;
}

.axis path, .axis line {
	fill: none;
	stroke: #dadada;
	shape-rendering: crispEdges;
}

</style>