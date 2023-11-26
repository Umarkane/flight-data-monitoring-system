<template>
	<div>
		<div class="title">
			{{ event.event_name }}
		</div>
		<div class="detail__body">
			<div class="detail__item">
				<div class="detail__item__title">
					REVIEWED
				</div>
				<div class="detail__item__content">
					<span>{{ event.is_reviewed ? 'On' : 'Off' }}</span>
					<fdm-switch
						:value="event.is_reviewed"
						@click="event.is_reviewed = !event.is_reviewed"
					/>
				</div>
			</div>
			<div class="form__row no-margin">
				<label for="model">STATUS</label>
				<select
					id="model"
					name="model"
				>
					<option
						v-for="item in status"
						:key="item"
						:value="item"
					>
						{{ item }}
					</option>
				</select>
			</div>
			<div class="form__row no-margin">
				<label for="severity">SEVERITY</label>
				<select
					id="severity"
					v-model="event.event_severity"
					name="severity"
				>
					<option
						v-for="item in severities"
						:key="item.value"
						:value="item.value"
					>
						{{ item.title }}
					</option>
				</select>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					START
				</div>
				<div class="detail__item__content">
					12.01.2021 10:20
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					END
				</div>
				<div class="detail__item__content">
					12.01.2021 12:20
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					DURATION
				</div>
				<div class="detail__item__content">
					{{ event.duration }}
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					LIMIT
				</div>
				<div class="detail__item__content" />
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					VALUE
				</div>
				<div class="detail__item__content">
					{{ event.value }}
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					FLIGHT PHASE
				</div>
				<div class="detail__item__content">
					LIFTOFF
				</div>
			</div>
		</div>
		<data-insight-comment
			v-if="isShowComment"
			:id="event.id"
			:comments="messages"
			type="event"
			@fetch="fetchComments"
		/>
	</div>
</template>

<script>
import DataInsightComment from './DataInsightComment'
import { eventCommentService } from '../../_services/event-comment.service'
import moment from 'moment'
import { eventService } from '../../_services/event.service'
import FdmSwitch from '../elements/FdmSwitch'
export default {
	name: 'DataInsightEventDetail',
	components: { FdmSwitch, DataInsightComment },
	props: {
		eventId: { type: Number, default: 0 }
	},
	data () {
		return {
			status: [ 'Under Review', 'Valid', 'False', 'Nuisance', 'Auto Valid' ],
			severities: [ { title: 'None', value: 'none' }, { title: 'Low', value: 'L' }, { title: 'Medium', value: 'M' }, { title: 'High', value: 'H' } ],
			messages: [],
			event: {},
			isShowComment: false,
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	mounted () {
		this.fetchComments()
		this.fetchEvent()
	},
	methods: {
		fetchEvent () {
			if (!this.eventId) return
			eventService.getById(this.eventId).then(res => {
				this.event = res
				this.isShowComment = true
			}).catch(err => {
				this.isShowComment = true
				console.log(err)
			})
		},
		fetchComments () {
			eventCommentService.getAll(this.userProfile.user.id).then(res => {
				this.messages = res.map(i => ({ ...i, created_at: moment(i.created_at).format('DD-MM-YYYY HH:mm') }))
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
</style>