import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './_router'
import store from './_store'
import VeeValidate from 'vee-validate'
import '@/assets/style/main.scss'
import VueToastr from 'vue-toastr'
import i18n from './i18n'
import FunctionalCalendar from 'vue-functional-calendar'
import Paginate from 'vuejs-paginate'
import Multiselect from 'vue-multiselect'

import 'cesium/Build/Cesium/Widgets/widgets.css'

Vue.component('multiselect', Multiselect)

Vue.use(FunctionalCalendar, {
	dayNames: [ 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su' ]
})
Vue.component('paginate', Paginate)
Vue.use(VeeValidate)
Vue.use(VueToastr, {
	defaultTimeout: 3000,
	defaultPosition: 'toast-top-right'
})

Vue.filter('crop', value => {
	if (value && value.length > 20) {
	  return value.slice(0, 20) + '...'
	}
	return value
})

Vue.config.productionTip = false

new Vue({
	router,
	store,
	i18n,
	render: h => h(App)
}).$mount('#app')
