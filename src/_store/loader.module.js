const state = {
	loading: false,
	type: 'loader',
	percentage: 0
}

const actions = {
	setLoading ({ commit }, value) {
		commit('SET_LOADER', value)
	},
	setType ({ commit }, value) {
		commit('SET_TYPE', value)
	}
}

const mutations = {
	SET_LOADER (state, value) {
		state.loading = value
	},
	SET_TYPE (state, data) {
		state.type = data.value
		state.percentage = data.percentage
	}
}

const getters = {
	loading ({ loading }) {
		return loading
	},
	type ({ type }) {
		return type
	},
	percentage ({ percentage }) {
		return percentage
	}
}

export const loader = {
	namespaced: true,
	actions,
	state,
	mutations,
	getters
}