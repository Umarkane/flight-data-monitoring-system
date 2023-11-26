<template>
	<div class="main__left__speedometer">
		<div>
			<div class="speedometer__item">
				<div class="speedometer__flight flex-center">
					<div class="speedometer__content">
						<div class="speedometer__date">
							Per Month
						</div>
						<div class="speedometer__count">
							{{ speedometer.n_flights_per_month }}
						</div>
						<div class="speedometer__title">
							Flights
						</div>
					</div>
					<speedometer />
					<canvas
						id="arc"
						class="arc"
						width="150"
						height="150"
					/>
				</div>
				<div
					v-if="isLoading"
					class="loader"
				>
					<loader-small />
				</div>
			</div>
			<div class="speedometer__item">
				<div class="speedometer__flight flex-center">
					<div class="speedometer__content">
						<div class="speedometer__date">
							Per 100 Flts
						</div>
						<div class="speedometer__count">
							{{ speedometer.n_events_per_100_flights }}
						</div>
						<div class="speedometer__title">
							Events
						</div>
					</div>
					<speedometer />
					<canvas
						id="per_event"
						class="arc event"
						width="150"
						height="150"
					/>
				</div>
				<div
					v-if="isLoading"
					class="loader"
				>
					<loader-small />
				</div>
			</div>
		</div>
		<div>
			<div class="speedometer__item">
				<div class="speedometer__flight flex-center">
					<div class="speedometer__content">
						<div class="speedometer__date">
							Per Month
						</div>
						<div class="speedometer__count">
							{{ speedometer.n_events_per_1_month }}
						</div>
						<div class="speedometer__title">
							Events
						</div>
					</div>
					<speedometer color="#E73030" />
					<canvas
						id="event"
						class="arc event"
						width="150"
						height="150"
					/>
				</div>
				<div
					v-if="isLoading"
					class="loader"
				>
					<loader-small />
				</div>
			</div>
			<div class="speedometer__item">
				<div class="speedometer__flight flex-center">
					<div class="speedometer__content">
						<div class="speedometer__date">
							Per Flight
						</div>
						<div class="speedometer__count">
							{{ speedometer.n_events_per_1_flight }}
						</div>
						<div class="speedometer__title">
							Events
						</div>
						<!--									<div class="speedometer__sub-title">-->
						<!--										Per Aircraft tp-->
						<!--									</div>-->
					</div>
					<speedometer />
					<canvas
						id="per_aircraft"
						class="arc event"
						width="150"
						height="150"
					/>
				</div>
				<div
					v-if="isLoading"
					class="loader"
				>
					<loader-small />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Speedometer from '../Speedometer'
import { otherService } from '../../_services/other.service'
import { mapActions } from 'vuex'
import LoaderSmall from '../LoaderSmall'
export default {
	name: 'DashboardSpeedometer',
	components: { LoaderSmall, Speedometer },
	data () {
		return {
			speedometer: {},
			isLoading: false
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
			// this.isShow = false
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
			// this.isLoading = true
			otherService.averageStats(aircraft, start, end).then(res => {
				if (res.length) {
					this.speedometer = res[0]
					const flight = 2 * Math.PI * this.speedometer.n_flights_per_month / this.speedometer.max_flights_per_month
					const event = 2 * Math.PI * this.speedometer.n_events_per_1_month / this.speedometer.max_events_per_month
					const event100 = 2 * Math.PI * this.speedometer.n_events_per_100_flights / 600
					const event1 = 2 * Math.PI * this.speedometer.n_events_per_1_flight / 20

					this.draw('#arc','#FFD630', flight)
					this.draw('#event','#E73030', event)
					this.draw('#per_event','#298BFE', event100)
					this.draw('#per_aircraft','#66C8D4', event1)
				} else {
					this.draw('#arc','#FFD630', Math.PI * 0.71 - 0.9)
					this.draw('#event','#E73030', Math.PI * 0.71 - 0.9)
					this.draw('#per_event','#298BFE', Math.PI * 0.71 - 0.9)
					this.draw('#per_aircraft','#66C8D4', Math.PI * 0.71 - 0.9)
				}
				this.setLoading(false)
				this.$nextTick(() => this.isLoading = false)
			}).catch(err => {
				this.speedometer = {}
				this.draw('#arc','#FFD630', 0)
				this.draw('#event','#E73030', 0)
				this.draw('#per_event','#298BFE', 0)
				this.draw('#per_aircraft','#66C8D4', 0)
				this.$nextTick(() => this.isLoading = false)
				// this.$toastr.e(err)
				console.log(err)
				this.setLoading(false)
			})
		},

		checkArc (val) {
			return val > (2 * Math.PI + 0.8) || (0.9 < val && Math.PI * 0.7 > val ) ? 0.9 : val
		},
		draw (doc, color, angle) {
			const canvas = document.querySelector(doc)
			const ctx = canvas.getContext('2d')
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.strokeStyle = color
			ctx.lineWidth = 4
			ctx.beginPath()
			// console.log(Math.PI * 0.7 + angle, this.checkArc(Math.PI * 0.7 + angle))
			ctx.arc(75, 75, 62, 0.7 * Math.PI, this.checkArc(Math.PI * 0.7 + angle), false)
			ctx.stroke()
		},
	}
}
</script>

<style lang="scss" scoped>
.main {
	&__left {
		&__speedometer {
			display: flex;
			gap: 20px;

			> div {
				.speedometer__item {
					background: rgba(255, 255, 255, 0.02);
					border-radius: 8.40864px;
					padding: 20px 10px;
					position: relative;

					&:last-child {
						margin-top: 37px;
					}
				}
			}
		}
	}
}
.speedometer {
	&__flight {
		position: relative;
		.arc {
			position: absolute;
			top: -11px;
			left: -11px;
		}
	}

	&__date {
		font-size: 12px;
		line-height: 100%;
		margin-top: 10px;
	}

	&__title {
		font-size: 18px;
		line-height: 100%;
	}

	&__count {
		font-size: 27px;
		line-height: 100%;
		margin: 10px 0;
	}

	&__content {
		position: absolute;
		text-align: center;
	}

	&__sub-title {
		margin-bottom: -15px;
		padding-top: 12px;
		font-size: 11px;
	}
}
.loader {
	position: absolute;
	top: 0;
	left: 0;
	background: rgba($color: #7f7d96, $alpha: 0.5);
	width: 100%;
	height: 100%;

	> div {
		left: 50%;
		transform: translateY(50%) translateX(-50%);
	}
}
</style>