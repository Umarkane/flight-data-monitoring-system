<template>
	<table class="fdm-table">
		<thead>
			<slot name="head" />
		</thead>
		<tbody>
			<slot name="body" />
		</tbody>
	</table>
</template>

<script>
export default {
	name: 'FmdTable',
}
</script>

<style lang="scss">
	.fdm-table {
		background: rgba(255, 255, 255, 0.02);
		// opacity: 0.7;
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;

		tr {
			height: 48px;

			&:first-child {
				height: 50px;
				border-top: none;
			}

			th {
				font-size: 14px;
				line-height: 19px;
				color: #ffffff;
				font-weight: 400;
				text-align: left;
				padding-left: 10px;

				&:first-child {
					padding-left: 40px;
				}

				&.id {
					text-align: center;
					width: 50px;
					padding-left: 0;
				}
				&.pl20 {
					padding-left: 20px;
				}
			}

			td {
				border-top: 1px solid #323744;
				font-weight: normal;
				font-size: 14px;
				line-height: 19px;
				color: #7882a2;
				padding-left: 10px;

				&:first-child {
					padding-left: 40px;
				}

				&:last-child {
					padding-right: 10px;
				}

				&.id {
					text-align: center;
					padding-left: 0;
				}
				&.center {
					text-align: center;
				}
				&.pl20 {
					padding-left: 20px;
				}
			}
		}
	}
</style>
