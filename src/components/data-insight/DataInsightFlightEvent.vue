<template>
	<div class="flight-event">
		<table>
			<thead>
				<tr>
					<th>Id</th>
					<th>Event</th>
					<th>Duration</th>
					<th>Severity</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(item, i) in events"
					:key="item.id"
				>
					<td>{{ i + 1 }}</td>
					<td>{{ item.event_name }}</td>
					<td>{{ item.duration }}</td>
					<td>{{ item.event_severity }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name: 'DataInsightFlightEvent',
	props: {
		events: { type: Array, default: () => [] },
	},
}
</script>

<style lang="scss" scoped>
	.flight-event {
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
	}
</style>