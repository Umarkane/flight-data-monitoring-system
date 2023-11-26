<template>
	<fdm-modal
		type="fligthData"
		@close="$emit('close')"
	>
		<div
			slot="content"
			class="detail-content"
		>
			<img
				src="../../assets/icons/close.svg"
				class="detail__close"
				alt=""
				@click="$emit('close')"
			>
			<div class="detail__head">
				<div class="detail__head__buttons">
					<button
						:class="{'active' : menu === 1}"
						@click="onMenuChange(1)"
					>
						AIRCRAFT
					</button>
					<button
						:class="{'active' : menu === 2}"
						@click="onMenuChange(2)"
					>
						FILE
					</button>
					<button
						:class="{'active' : menu === 3}"
						@click="onMenuChange(3)"
					>
						FLIGHT
					</button>
					<button
						:class="{'active' : menu === 4}"
						:disabled="!eventId"
						@click="onMenuChange(4)"
					>
						EVENT
					</button>
				</div>
			</div>
			<data-insight-aircraft-detail
				v-if="menu === 1"
				:aircraft="aircraft"
			/>
			<data-insight-file-detail
				v-if="menu === 2"
				:file-id="fileId"
			/>
			<data-insight-flight-detail
				v-if="menu === 3"
				:flight="flight"
			/>
			<data-insight-event-detail
				v-if="menu === 4"
				:event-id="eventId"
			/>
		</div>
	</fdm-modal>
</template>

<script>
import FdmModal from '../FdmModal'
import DataInsightAircraftDetail from './DataInsightAircraftDetail'
import DataInsightFileDetail from './DataInsightFileDetail'
import { aircraftService } from '../../_services/aircraft.service'
import { flightService } from '../../_services/flight.service'
import DataInsightEventDetail from './DataInsightEventDetail'
import DataInsightFlightDetail from './DataInsightFlightDetail'
import moment from 'moment'
export default {
	name: 'DataInsightDetail',
	components: { DataInsightFlightDetail, DataInsightEventDetail, DataInsightFileDetail, DataInsightAircraftDetail, FdmModal },
	props: {
		fileId: { type: Number, default: 0 },
		flightId: { type: Number, default: 0 },
		eventId: { type: Number, default: 0 },
		aircraftId: { type: Number, default: 0 },
		defaultMenu: { type: Number, default: 1 }
	},
	data () {
		return {
			menu: 1,
			aircraft: {},
			flight: {}
		}
	},
	mounted () {
		this.menu = this.defaultMenu
		this.fetchAircraft(this.aircraftId)
		this.onMenuChange(this.menu)
	},
	methods: {
		onMenuChange (id) {
			this.menu = id
			this.switchMenu(id)
		},
		switchMenu (id) {
			switch (id) {
			case 1:
				this.fetchAircraft()
				break
			case 3:
				this.fetchFlight()
				break
			}
		},
		fetchAircraft () {
			if (!this.aircraftId) return
			aircraftService.getById(this.aircraftId).then(res => {
				this.aircraft = res
			}).catch(err => {
				console.log(err)
			})
		},
		fetchFlight () {
			console.log(this.flightId)
			if (!this.flightId) return
			flightService.getById(this.flightId).then(res => {
				this.flight = { 
					...res,
				 	liftOff: moment(res.departure_time).format('DD-MM-YYYY HH:mm:ss'),
					touchDown: moment(res.arrival_time).format('DD-MM-YYYY HH:mm:ss'),
					duration: moment(res.departure_time).diff(moment(res.arrival_time), 'hours')
				  }
			}).catch(err => {
				console.log(err)
			})
		},

	}
}
</script>

<style lang="scss" scoped>
	.detail {
		&-content {
			padding: 30px 20px 20px;
			position: relative;
		}
		&__close {
			position: absolute;
			top: -22px;
			right: 0px;
			cursor: pointer;
		}
		&__head {
			&__buttons {
				button {
					min-width: 116px;
					height: 36px;
					background: rgba(#2A3546, 0.4);
					border-radius: 4px;
					font-size: 14px;
					line-height: 19px;
					color: #FFFFFF;
					margin-right: 49px;

					&.active {
						background: rgba(#298BFE, 0.4);
					}

					&:disabled {
						opacity: 0.5;
					}
				}
			}
		}
		&__body {
			display: flex;
			flex-wrap: wrap;
			row-gap: 50px;
			column-gap: 25px;
			margin-top: 60px;
		}
		&__item {
			flex: 250px;
			&__title {
				font-size: 13px;
				line-height: 19px;
				color: #2EA2F8;
				mix-blend-mode: normal;
				margin-bottom: 10px;
			}
			&__content {
				display: flex;
				padding-left: 15px;
				align-items: center;
				height: 48px;
				border: 1px solid #33393F;
				border-radius: 4px;
				font-size: 14px;
				line-height: 19px;
				color: #FFFFFF;
			}
		}
	}
</style>