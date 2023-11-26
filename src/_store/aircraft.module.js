const state = {
	selectedAircraft: {}
}

const actions = {
	setAircraft ({ commit }, data) {
		commit('SET_AIRCRAFT', data)
	}
}

const mutations = {
	SET_AIRCRAFT (state, data) {
		state.selectedAircraft = data
	}
}

const getters = {
	currentAircraft: ({ selectedAircraft }) => selectedAircraft
}

export const aircraft = {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}