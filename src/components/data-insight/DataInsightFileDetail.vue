<template>
	<div>
		<div class="title">
			{{ file.file_name }}
		</div>
		<div class="detail__body">
			<div class="detail__item">
				<div class="detail__item__title">
					Updated Date
				</div>
				<div class="detail__item__content">
					{{ file.updated_at }}
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					File Size
				</div>
				<div class="detail__item__content">
					{{ file.file_size }}
				</div>
			</div>
			<div class="detail__item">
				<div class="detail__item__title">
					DATA QUALITY
				</div>
				<div class="detail__item__content">
					98.89%
				</div>
			</div>
		</div>
		<data-insight-comment
			v-if="isShowComment"
			:id="file.id"
			:comments="messages"
			type="file"
			@fetch="fetchComments"
		/>
	</div>
</template>

<script>
import DataInsightComment from './DataInsightComment'
import moment from 'moment'
import { fileCommentService } from '../../_services/file-comment.service'
import { fileService } from '../../_services/file.service'
export default {
	name: 'DataInsightFileDetail',
	components: { DataInsightComment },
	props: {
		fileId: { type: [ Number, String ], default: 0 }
	},
	data () {
		return {
			messages: [],
			file: {},
			isShowComment: false
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	mounted () {
		this.fetchComments()
		this.fetchFile()
	},
	methods: {
		fetchFile () {
			if (!this.fileId) return
			fileService.getById(this.fileId).then(res => {
				this.file = { ...res, updated_at: moment(res.updated_at).format('DD-MM-YYYY HH:mm') }
			}).catch(err => {
				console.log(err)
			})
		},
		fetchComments () {
			fileCommentService.getAll(this.userProfile.user.id).then(res => {
				this.messages = res.map(i => ({ ...i, created_at: moment(i.created_at).format('DD-MM-YYYY HH:mm') }))
				this.isShowComment = true
			}).catch(err => {
				console.log(err)
				this.isShowComment = true
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
			flex: 200px;
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