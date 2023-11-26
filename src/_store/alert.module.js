const state = {
	alert: {
		message: '',
		type: ''
	}
}

const actions = {
	setAlert ({ commit }, data) {
		commit('SET_ALERT', data)
	},

	removeAlert ({ commit }) {
		commit('REMOVE_ALERT')
	}
}

const mutations = {
	SET_ALERT (state, data) {
		state.alert = data
	},

	REMOVE_ALERT (state) {
		state.alert = {}
	}
}

const getters = {
	alert ({ alert }) {
		return alert
	}
}

export const alert = {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}