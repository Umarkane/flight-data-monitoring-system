<template>
	<div id="chart">
		<vue-apex-charts
			type="polarArea"
			width="380"
			:options="chartOptions"
			:series="series"
		/>
	</div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
	name: 'PolarArea',
	components: { VueApexCharts },
	data () {
		return {
			series: [ 42, 47, 52, 58, 65 ],
			chartOptions: {
				plotOptions: {
					polarArea: {
						rings: {
							strokeWidth: 0,
							strokeColor: '#e8e8e8',
						},
						spokes: {
							strokeWidth: 0,
							connectorColors: '#e8e8e8',
						}
					}
				},
				chart: {
					width: 380,
					type: 'polarArea',
					sparkline: {
						enabled: false,
					}
				},
				fill: {
					colors: [ '#E5E5E5', '#298BFE', '#FFD630', '#906BFF', '#E72D2D' ]
				},
				labels: [ 'Takeoff', 'Climb', 'Cruise' , 'Descent', 'Approach' ],

				stroke: {
					width: 0,
					colors: 'inherit'
				},
				yaxis: {
					show: false
				},
				xaxis: {
					show: false
				},
				legend: {
					show:false
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
						fontWeight: 'bold',
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
				// theme: {
				// 	mode: 'light',
				// 	palette: 'palette5'
				// }
			},
		}
	}
}
</script>

<style scoped>
canvas {
	max-width: 330px !important;
}
</style>