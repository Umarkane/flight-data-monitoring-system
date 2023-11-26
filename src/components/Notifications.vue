<template>
	<div class="notification">
		<div class="notification__head">
			<div class="notification__title">
				Notifications
			</div>
			<div class="notification__see-all">
				See all
			</div>
		</div>
		<div class="notification__body">
			<div
				v-for="item in 3"
				:key="item"
				class="notification__item"
			>
				<div class="notification__image flex-center">
					MJ
					<img
						src="../assets/icons/start.svg"
						alt=""
					>
				</div>
				<div class="notification__name-surname">
					<div class="notification__title">
						Headline label
					</div>
					<div class="notification__sub-title">
						Subtitle text
					</div>
				</div>
				<div class="notification__menu">
					<img
						src="../assets/icons/tripple-dot.svg"
						alt=""
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Notifications'
}
</script>

<style lang="scss" scoped>
	.notification {
		padding: 24px;
		background: #1F2327;
		border-radius: 2px;

		&__head {
			display: flex;
			justify-content: space-between;
			margin-bottom: 21px;
		}

		&__title {
			font-size: 16px;
			line-height: 136.02%;
			color: #FFFFFF;
		}

		&__see-all {
			font-size: 12px;
			line-height: 16px;
			color: #298BFE;
		}

		&__item {
			display: flex;
			align-items: center;
			background: rgba(255, 255, 255, 0.02);
			width: 302px;
			height: 80px;
			padding: 0 11px 0 16px;
			margin: 25px 0;
		}

		&__image {
			font-family: 'Inter', sans-serif;
			background: #298BFE;
			width: 48px;
			height: 48px;
			border-radius: 50%;
			position: relative;
			font-weight: bold;
			font-size: 18px;
			line-height: 22px;
			letter-spacing: -0.005em;
			color: #FFFFFF;

			img {
				position: absolute;
				bottom: -2px;
				right: -10px;
			}
		}

		&__name-surname {
			flex: 1;
			margin-left: 16px;
		}

		&__title {
			font-size: 16px;
			line-height: 136.02%;
			color: #FFFFFF;
		}

		&__sub-title {
			font-size: 14px;
			line-height: 23px;
			font-feature-settings: 'salt' on;
			color: #FFFFFF;
			margin-top: 2px;
		}
	}
</style>