<template>
	<div>
		<loader v-if="loader" />
		<router-view />
	</div>
</template>
<script>
import Loader from './components/Loader'
import { mapActions } from 'vuex'
export default {
	components: { Loader },
	computed: {
		loader () {
			return this.$store.getters['loader/loading']
		},
		alert () {
			return this.$store.getters['alert/alert']
		}
	},
	watch: {
		alert (value) {
			if (value.type && value.message) {
				this.$toastr[value.type](value.message)
				this.removeAlert()
			}
		}
	},
	methods: {
		...mapActions('alert', [ 'removeAlert' ])
	}
}
</script>

<style lang="scss"></style>
