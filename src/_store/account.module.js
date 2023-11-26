import { userService } from '@/_services/user.service'
import router from '@/_router'
import { navbarService } from '../_services/navbar.service'

const roles = [
	{
		code: 'ROLE_SUPER_ADMIN',
		href: '/super-admin'
	}
]

const user = JSON.parse(localStorage.getItem('user'))
const rememberedUser = JSON.parse(localStorage.getItem('remembered'))

const state = {
	user: user ? user : {},
	remembered: rememberedUser || {}
}

const actions = {
	login ({ commit, dispatch }, data) {
		userService.login(data).then(async res => {
			localStorage.setItem('user', JSON.stringify(res))
			commit('SET_USER', res)
			let sidebars = []
			if (!res.user.is_staff) {
				sidebars = await navbarService.getAll(res.user.role[0])
				dispatch('sidebars/setSidebars', sidebars, { root: true })
				if (sidebars && sidebars.length) {
					router.push(sidebars[0].href)
				} else dispatch('alert/setAlert', { message: 'No sidebars found!', type: 'e' }, { root: true })
			} else {
				router.push('/super-admin')
			}
		}).catch(err => {
			console.log(err)
			dispatch('alert/setAlert', { message: err, type: 'e' }, { root: true })
		})
	},
	logout ({ commit }) {
		userService.logout()
		commit('REMOVE_USER')
	},
	remembering ({ commit }, data) {
		localStorage.setItem('remembered', JSON.stringify(data))
		commit('REMEMBER_USER', data)
	},
	removeRemember ({ commit }) {
		localStorage.removeItem('remembered')
		commit('REMEMBER_USER', {})
	}
}

const mutations = {
	SET_USER (state, data) {
		state.user = data
	},
	REMOVE_USER (state) {
		state.user = {}
	},
	REMEMBER_USER (state, data) {
		state.remembered = data
	}
}

const getters = {
	remembered ({ remembered }) {
		return remembered
	}
}

export const account = {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
