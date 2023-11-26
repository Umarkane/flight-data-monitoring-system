<template>
	<div class="data-list">
		<div class="data-list__head">
			<div>Data Insights</div>
			<div class="data-list__buttons">
				<button
					class="data-list__button"
					:class="{ 'active' : menu === 1 }"
					@click="menu = 1"
				>
					FILES <img
						src="../../assets/icons/file.svg"
						alt=""
					>
				</button>
				<button
					class="data-list__button"
					:class="{ 'active' : menu === 2 }"
					@click="menu = 2"
				>
					FLIGHTS <img
						src="../../assets/icons/flight.svg"
						alt=""
					>
				</button>
				<button
					class="data-list__button"
					:class="{ 'active' : menu === 3 }"
					@click="menu = 3"
				>
					EVENTS <img
						src="../../assets/icons/event.svg"
						alt=""
					>
				</button>
			</div>
		</div>
		<div class="data-list__body">
			<data-insight-file v-if="menu === 1" />
			<data-insight-flight v-if="menu === 2" />
			<data-insight-event v-if="menu === 3" />
		</div>
	</div>
</template>

<script>
import DataInsightFile from '../../components/data-insight/DataInsightFile'
import DataInsightFlight from '../../components/data-insight/DataInsightFlight'
import DataInsightEvent from '../../components/data-insight/DataInsightEvent'

export default {
	name: 'DataInsight',
	components: { DataInsightEvent, DataInsightFlight, DataInsightFile },
	data () {
		return {
			menu: 1
		}
	},
	methods: {}
}
</script>

<style lang="scss">
.data-list {
	margin: 0 40px;
	&__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 20px;
		line-height: 27px;
		letter-spacing: 0.2px;

		color: #ffffff;
	}

	&__button {
		background: #2a3546;
		height: 36px;
		padding: 0 10px;
		font-size: 14px;
		line-height: 19px;
		color: #ffffff;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		min-width: 116px;
		cursor: pointer;

		img {
			margin-left: 15px;
		}

		&.active {
			background: rgba($color: #298bfe, $alpha: 0.4);
		}
	}

	&__buttons {
		display: flex;
		gap: 49px;
	}

	&__body {
		margin-top: 18px;
		margin-bottom: 30px;
	}
}
</style>
