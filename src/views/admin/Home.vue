<template>
	<div class="main">
		<div class="main__left">
			<div class="main__top">
				<div class="main__left__event">
					<div class="main__left__event__title">
						Events by Flight Phase
					</div>
					<div class="main__left__event__chart">
						<polar-area />
					</div>
				</div>
				<dashboard-speedometer />
				<div
					class="main__left__aircraft"
					:style="`background-image: url('${selectedAircraft.mainImage}')`"
				>
					<!-- <img
						:src="selectedAircraft.mainImage"
						alt=""
					> -->
				</div>
			</div>
			<div class="main__bottom">
				<div class="main__left__trigger">
					<div class="trigger__title">
						Top Triggers
					</div>
					<div class="trigger__content">
						<dashboard-bar />
					</div>
				</div>
				<div class="main__left__event-flight">
					<div class="event-flight__title">
						Event & Flight Count
					</div>
					<div class="event-flight__content">
						<dashboard-line />
					</div>
				</div>
			</div>
		</div>
		<div class="main__right">
			<div class="aircraft">
				<div class="aircraft__title">
					All Aircrafts
				</div>
				<div
					class="aircraft__img"
					@click="onAircraft(aircrafts[0])"
				>
					<component
						:is="aircrafts[0].component"
						:active="selectedAircraft.id === 'all'"
					/>
				</div>
			</div>
			<div
				v-for="(item, i) in aircraftData"
				:key="i"
				class="aircraft"
			>
				<div class="aircraft__title">
					{{ item.title }}
				</div>				
				<div
					class="aircraft__img"
					@click="onAircraft(item)"
				>
					<component
						:is="item.component"
						:active="selectedAircraft.id === item.id"
					/>
				</div>				
			</div>
		</div>
	</div>
</template>

<script>
import Header from '../../components/Header'
import Speedometer from '../../components/Speedometer'
import AircraftOne from '../../components/AircraftOne'
import AircraftTwo from '../../components/AircraftTwo'
import AircraftThree from '../../components/AircraftThree'
import AircraftFour from '../../components/AircraftFour'
import PolarArea from '../../components/charts/PolarArea'
import DashboardBar from '../../components/charts/DashboardBar'
import DashboardLine from '../../components/charts/DashboardLine'
import DashboardSpeedometer from '../../components/charts/DashboardSpeedometer'
import { aircraftService } from '../../_services/aircraft.service'
import { mapActions } from 'vuex'
export default {
	components: { DashboardSpeedometer, DashboardLine, DashboardBar, PolarArea, AircraftFour, AircraftThree, AircraftTwo, AircraftOne, Speedometer, Header },
	data () {
		return {
			aircrafts: [
				{
					title: 'All Aircrafts',
					component: 'AircraftOne',
					id: 'all',
					mainImage: require('../../assets/img/aircraft.png')
				},
				{
					title: 'Boeing 230',
					component: 'AircraftTwo',
					id: 2,
					mainImage: require('../../assets/img/aircraft-2.svg')
				},
				{
					title: 'Boeing 220',
					component: 'AircraftThree',
					id: 3,
					mainImage: require('../../assets/img/aircraft-3.svg')
				},
				{
					title: 'Boeing A2',
					component: 'AircraftFour',
					id: 4,
					mainImage: require('../../assets/img/aircraft-4.svg')
				}
			],
			aircraftData: [],
			selectedAircraft: {}
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	mounted () {
		this.fetchAircraft()
		this.selectedAircraft = this.aircrafts[0]
		this.setAircraft(this.selectedAircraft)
	},
	methods: {
		...mapActions('aircraft', [ 'setAircraft' ]),
		fetchAircraft () {
			aircraftService.getAll(this.userProfile.user.airline[0]).then(res => {
				this.aircraftData = res.map((i, index) => {
					const item = this.aircrafts[(index + 1) % 4]
					return {
						...i,
						component: item.component,
						mainImage: item.mainImage
					}
				})
			}).catch(err => {
				console.log(err)
			})
		},
		onAircraft (item) {
			this.selectedAircraft = item
			this.setAircraft(item)
		}
	}
}
</script>

<style lang="scss" scoped>
	.main {
		display: flex;
		margin-left: 36px;
		justify-content: space-between;
		color: #ffffff;
		padding-bottom: 20px;
		background: $black-back;

		&__left {
			&__event {
				font-size: 18px;
				line-height: 180%;
				background: rgba(255, 255, 255, 0.02);
				border-radius: 8.40864px;
				&__chart {
					min-width: 300px;
				}

				&__title {
					padding: 22px 0 0 20px;
				}
			}

			&__aircraft {
				// position: relative;
				height: 350px;
				width: 400px;
				background-position: center;
				background-repeat: no-repeat;
			}

			&__trigger {
				width: 380px;
				background: rgba(255, 255, 255, 0.02);
				border-radius: 8.40864px;
				padding: 10px;
			}

			&__event-flight {
				width: 50vw;
				padding: 10px 0;
				background: rgba(255, 255, 255, 0.02);
				border-radius: 3.97619px;
			}
		}

		&__top {
			display: flex;
			gap: 20px;
		}

		&__bottom {
			margin-top: 20px;
			display: flex;
			gap: 20px;
		}

		&__right {
			background: rgba(255, 255, 255, 0.02);
			border-radius: 8.41px;
			width: 120px;
			min-height: 100vh;
			display: flex;
			flex-direction: column;
			align-items: center;
			overflow-y: auto;
			padding-top: 30px;
			gap: 15px;
		}
	}

	.aircraft {
		//margin: 20px 0;

		&__item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		&__img {
			text-align: center;
			cursor: pointer;
		}

		&__title {
			margin-bottom: 15px;
			padding: 0 5px;
			text-align: center;
		}
	}

	.trigger {
		&__title {
			padding-top: 10px;
		}
	}

	.event-flight {
		&__title {
			padding-left: 15px;
			padding-top: 10px;
			margin-bottom: -20px;
		}
	}
</style>
