<template>
	<div>
		<div class="title">
			Flight n/a
		</div>
		<div class="detail__body">
			<div class="form__row no-margin">
				<label for="model">DEPARTURE</label>
				<select
					id="model"
					v-model="flight.dep_airport"
					name="model"
				>
					<option :value="flight.dep_airport">
						{{ flight.dep_airport }}
					</option>
					<!-- <option
						v-for="item in status"
						:key="item"
						:value="item"
					>
						{{ item }}
					</option> -->
				</select>
			</div>
			<div class="form__row no-margin">
				<label for="severity">ARRIVAL</label>
				<select
					id="severity"
					v-model="flight.arr_airport"
					name="severity"
				>
					<option :value="flight.arr_airport">
						{{ flight.arr_airport }}
					</option>
					<!-- <option
						v-for="item in severities"
						:key="item"
						:value="item"
					>
						{{ item }}
					</option> -->
				</select>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					FLIGHT NO.
				</div>
				<div class="detail__item__content">
					{{ flight.flight_no }}
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					LIFTOFF
				</div>
				<div class="detail__item__content">
					{{ flight.liftOff }}
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					TOUCHDOWN
				</div>
				<div class="detail__item__content">
					{{ flight.touchDown }}
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					DURATION
				</div>
				<div class="detail__item__content">
					{{ flight.duration }}
				</div>
			</div>
			<!-- <div class="detail__item">
				<div class="detail__item__title">
					START
				</div>
				<div class="detail__item__content">
					1/29/2020
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					END
				</div>
				<div class="detail__item__content">
					1/29/2020
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					TOUCHDOWN DISTANCE
				</div>
				<div class="detail__item__content">
					1641.54 ft
				</div>
			</div> -->
			<!-- <div class="form__row no-margin">
				<label for="type">TYPE</label>
				<select
					id="type"
					name="severity"
				>
					<option
						v-for="item in types"
						:key="item"
						:value="item"
					>
						{{ item }}
					</option>
				</select>
			</div> -->
		</div>
		<div class="flight-event">
			<div class="flight-event__buttons">
				<button
					:class="{ 'active' : buttonType === 'event' }"
					@click="buttonType = 'event'"
				>
					Events
				</button>
				<button
					:class="{ 'active' : buttonType === 'comment' }"
					@click="buttonType = 'comment'"
				>
					Comments
				</button>
			</div>
			<data-insight-flight-event
				v-if="buttonType === 'event'"
				:events="events"
			/>
			<data-insight-comment
				v-if="buttonType === 'comment'"
				:id="flight.id"
				:comments="messages"
				type="flight"
				@fetch="fetchComments"
			/>
		</div>
	</div>
</template>

<script>
import DataInsightComment from './DataInsightComment'
import moment from 'moment'
import { flightCommentService } from '../../_services/flight-comment.service'
import DataInsightFlightEvent from './DataInsightFlightEvent'
import { eventService } from '@/_services/event.service'
export default {
	name: 'DataInsightFlightDetail',
	components: { DataInsightFlightEvent, DataInsightComment },
	props: {
		flight: { type: Object, default: () => ({ id: 0 }) }
	},
	data () {
		return {
			status: [ 'Under Review', 'Valid', 'False', 'Nuisance', 'Auto Valid' ],
			severities: [ 'None', 'Low', 'Medium', 'High' ],
			types: [ 'Revenue', 'Training', 'Ferry/Reposition', 'Special/Other', 'Maintenance', 'Test FLight', 'Ground Run' ],
			messages: [],
			events: [],
			buttonType: 'event'
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	watch: {
		flight (val) {
			this.fetchEvents(val.id)
		}
	},
	mounted () {
		this.fetchComments()
	},
	methods: {
		fetchComments () {
			flightCommentService.getAll(this.userProfile.user.id).then(res => {
				this.messages = res.map(i => ({ ...i, created_at: moment(i.created_at).format('DD-MM-YYYY HH:mm') }))
			}).catch(err => {
				console.log(err)
			})
		},
		fetchEvents (id) {
			eventService.getAll(id).then(res => {
				this.events = res
			}).catch(err => {
				console.log(err)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.title {
		font-size: 18px;
		line-height: 21px;
		color: #b4b4b4;
		margin-top: 30px;
	}
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
				}
			}
		}
		&__body {
			display: flex;
			flex-wrap: wrap;
			row-gap: 50px;
			column-gap: 25px;
			margin-top: 30px;
		}
		&__item {
			flex: 0 30%;
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
	.flight-event {
		&__buttons {
			margin: 30px 0;
			button {
				height: 36px;
				min-width: 116px;
				margin-right: 20px;
				text-decoration: none !important;
				color: #FFFFFF !important;
				background: #2A3546 !important;
				border-radius: 3px;

				&.active {
					background: #298BFE !important;
				}
			}
		}
	}
</style>