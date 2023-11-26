<template>
	<div
		id="modal"
		class="modal flex-center"
	>
		<div
			class="modal__content"
			:class="{ 'delete' : type === 'delete', 'auto-height' : autoHeight, 'width' : type === 'fligthData' }"
		>
			<slot name="content" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'FdmModal',
	props: {
		type: { type: String, default: '' },
		autoHeight: { type: Boolean, default: false },
	},
	data () {
		return {
			modal: '',
		}
	},
	mounted () {
		this.modal = document.getElementById('modal')
		this.modal.addEventListener('click', this.onOutsideClick)
	},
	beforeDestroy () {
		this.modal.removeEventListener('click', this.onOutsideClick)
	},
	methods: {
		onOutsideClick (e) {
			if (e.target === this.modal) {
				this.$emit('close')
			}
		},
	},
}
</script>

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba($color: #7f7d96, $alpha: 0.5);
		z-index: 12;

		&__content {
			background: #1f2327;
			box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
			border-radius: 2px;
			padding: 48px 30px 66px;
			max-height: 90%;
			max-width: 80vw;
			overflow-y: auto;

			&.auto-height {
				height: auto;
			}

			&.width {
				width: 60vw;
				height: 90%;
			}

			&.delete {
				height: auto;
			}

			&::-webkit-scrollbar {
				width: 5px;
			}
			&::-webkit-scrollbar-track {
				-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
			}
			&::-webkit-scrollbar-thumb {
				background: #7882A2;
				opacity: 0.7;
				border-radius: 9.54286px;
			}
		}
	}
</style>
