<template>
	<paginate
		:page-count="totalElements"
		:click-handler="onChange"
		:prev-text="'Prev'"
		:next-text="'Next'"
		:container-class="'paginate'"
		:prev-class="'paginate__prev'"
		:next-class="'paginate__next'"
		:page-class="'paginate__item'"
		:active-class="'paginate__active'"
	/>
</template>

<script>
export default {
	name: 'Pagination',
	props: {
		totalElements: { type: Number, default: 0 }
	},
	methods: {
		onChange (num) {
			this.$emit('change', num)
		}
	}
}
</script>

<style scoped>

</style>