<template>
	<div class="comment">
		<table>
			<thead>
				<tr>
					<th>Id</th>
					<th>Name</th>
					<th>Date</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(item, i) in comments"
					:key="item.id"
				>
					<td>{{ i + 1 }}</td>
					<td class="">
						{{ item.owner_fullname }}
					</td>
					<td class="">
						{{ item.created_at }}
					</td>
					<td>{{ item.description }}</td>
				</tr>
				<tr>
					<td
						colspan="4"
						class="center add-comment"
					>
						<button
							v-show="!isAddComment"
							@click="isAddComment = true"
						>
							ADD ANOTHER COMMENT
						</button>
						<form
							v-show="isAddComment"
							class="comment__form"
							@submit.prevent="onSubmit"
						>
							<input
								v-model="comment"
								v-validate="'required'"
								:class="{ 'invalid' : errors.has('comment') }"
								type="text"
								name="comment"
							>
							<button
								type="submit"
								:disabled="isLoading"
							>
								Save
							</button>
							<button
								type="reset"
								class="reset"
								@click="isAddComment = false"
							>
								Cancel
							</button>
						</form>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { eventCommentService } from '../../_services/event-comment.service'
import { fileCommentService } from '../../_services/file-comment.service'
import { flightCommentService } from '../../_services/flight-comment.service'

export default {
	name: 'DataInsightComment',
	props: {
		type: { type: String, default: 'event' },
		id: { type: Number, required: true },
		comments: { type: Array, default: () => [] }
	},
	data () {
		return {
			isAddComment: false,
			isLoading: false,
			comment: '',
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.user
		}
	},
	methods: {
		onSubmit () {
			this.$validator.validate().then(valid => {
				if (valid) {
					const data = {
						event: this.id,
						owner: this.userProfile.user.id,
						description: this.comment
					}
					this.createComment(data)
				}
			})
		},
		createComment (data) {
			switch (this.type) {
			case 'event':
				this.creatingComment(eventCommentService, data)
				break
			case 'file':
				this.creatingComment(fileCommentService, data)
				break
			case 'flight':
				this.creatingComment(flightCommentService, data)
				break
			}
		},
		creatingComment (service, data) {
			service.create(data).then(res => {
				this.isAddComment = false
				this.isLoading = false
				this.comment = ''
				this.$emit('fetch')
			}).catch(err => {
				console.log(err)
				this.isLoading = false
				this.$toastr.e(err)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.comment {
		margin-top: 50px;
		table {
			width: 100%;
			border: 1px solid #33393F;
			border-collapse: collapse;
			border-radius: 4px;
			text-align: left;

			tr {
				height: 50px;
			}

			tbody {
				tr {
					&:hover:not(:last-child) {
						background: rgba(#2EA2F8, 0.2);
					}
				}
			}

			th {
				border-bottom: 1px solid #33393F;
				font-size: 14px;
				line-height: 19px;
				color: #2EA2F8;
				font-weight: 400;
				&:first-child {
					padding-left: 24px;
				}
			}

			td {
				color: #FFFFFF;
				font-size: 14px;
				line-height: 19px;
				padding-right: 15px;

				&:first-child {
					padding-left: 24px;
				}

				&:last-child {
					font-weight: 300;
				}

				&.fixed {
					width: 150px;
				}

				&.add-comment {
					button {
						font-size: 14px;
						line-height: 19px;
						text-decoration-line: underline;
						text-transform: uppercase;
						color: #2EA2F8;
						background: inherit;
						outline: none;
						border: none;
					}
				}
			}
		}
		&__form {
			display: flex;
			height: 35px;
			gap: 20px;

			input {
				flex: 1;
				outline: none;
				padding: 0 10px;
				border: 1px solid #33393F;
				border-radius: 2px;
			}

			button {
				flex: 0.3;
				text-decoration: none !important;
				color: #FFFFFF !important;
				background: #298BFE !important;
				border-radius: 3px;

				&.reset {
					background: #FA2B56 !important;
				}
			}
		}
	}
	.invalid {
		border: 1px solid #f91c3d !important;
	}
</style>