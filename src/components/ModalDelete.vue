<template>
	<fdm-modal type="delete">
		<div
			slot="content"
			class="delete"
		>
			<div class="delete__title">
				Are you sure?
			</div>
			<div class="delete__buttons">
				<button @click="$emit('close')">
					Cancel
				</button>
				<button
					class="black"
					@click="$emit('delete')"
				>
					Delete
				</button>
			</div>
		</div>
	</fdm-modal>
</template>

<script>
import FdmModal from './FdmModal.vue'
export default {
	name: 'ModalDelete',
	components: { FdmModal },
}
</script>

<style lang="scss">
	.delete {
		&__title {
			font-size: 24px;
			line-height: 19px;
			color: #f1f1f1;
			text-shadow: 0px 0px 3.08876px rgba(0, 0, 0, 0.2);
			margin-bottom: 55px;
		}

		&__buttons {
			display: flex;
			gap: 20px;
			button {
				min-width: 160px;
				height: 36px;
				background: #fa2b56;
				border-radius: 2px;
				font-size: 14px;
				line-height: 19px;
				color: #fefefe;
				text-shadow: 0px 0px 3.08876px rgba(0, 0, 0, 0.2);
				text-transform: uppercase;

				&.black {
					background: #2a3546;
				}
			}
		}
	}
</style>
