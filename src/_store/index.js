import Vue from 'vue'
import Vuex from 'vuex'
import { account } from '@/_store/account.module'
import { loader } from './loader.module'
import { alert } from './alert.module'
import { sidebars } from './navbar.module'
import { aircraft } from './aircraft.module'
import { other } from './other.module'
import { file } from './file.module'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		account,
		loader,
		alert,
		sidebars,
		aircraft,
		other,
		file
	}
})
