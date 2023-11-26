<template>
	<button
		class="fdm-switch"
		:class="{ 'active' : value }"
		@click="$emit('click')"
	/>
</template>

<script>
export default {
	name: 'FdmSwitch',
	props: {
		value: { type: Boolean, default: false }
	}
}
</script>

<style lang="scss" scoped>
	.fdm-switch {
		background: #2A3546;
		width: 44px;
		height: 22px;
		border-radius: 12px;
		position: relative;
		outline: none;

		&:after {
			content: "";
			display: block;
			height: 18px;
			width: 18px;
			border-radius: 50%;
			background: #FFFFFF;
			position: absolute;
			left: 3px;
			right: unset;
			top: 2px;
			transition: all 2s ease;
		}

		&.active {
			background: #2EA2F8;
			&:after {
				content: "";
				display: block;
				height: 18px;
				width: 18px;
				border-radius: 50%;
				background: #FFFFFF;
				position: absolute;
				right: 3px;
				left: unset;
				top: 2px;
				transition: all 1s ease-in-out;
			}
		}
	}
</style>