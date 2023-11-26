<template>
	<div class="detail__body">
		<div class="detail__item">
			<div class="detail__item__title">
				Registration Number
			</div>
			<div class="detail__item__content">
				{{ aircraft.reg_number }}
			</div>
		</div>
		<div class="detail__item">
			<div class="detail__item__title">
				Type
			</div>
			<div class="detail__item__content">
				{{ aircraft.title }}
			</div>
		</div>
		<div class="detail__item">
			<div class="detail__item__title">
				Serial No
			</div>
			<div class="detail__item__content">
				{{ aircraft.serial_no }}
			</div>
		</div>
		<div class="detail__item">
			<div class="detail__item__title">
				Engine
			</div>
			<div class="detail__item__content">
				{{ aircraft.engine }}
			</div>
		</div>
		<div class="detail__item">
			<div class="detail__item__title">
				Recorder part no.
			</div>
			<div class="detail__item__content">
				{{ aircraft.recorded_part_no }}
			</div>
		</div>
		<div class="detail__item">
			<div class="detail__item__title">
				Recorder Serial no.
			</div>
			<div class="detail__item__content" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'DataInsightAircraftDetail',
	props: {
		aircraft: { type: Object, default: () => ({}) }
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