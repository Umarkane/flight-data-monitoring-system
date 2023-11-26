const state = {
	selectedFileId: '',
	selectedFlightId: '',
}

const actions = {
	setFileId ({ commit }, id) {
		commit('SET_FILE_ID', id)
	},
	setFlightId ({ commit }, id) {
		commit('SET_FLIGHT_ID', id)
	}
}

const mutations = {
	SET_FILE_ID (state, id) {
		state.selectedFileId = id
	},
	SET_FLIGHT_ID (state, id) {
		state.selectedFlightId = id
	}
}

const getters = {
	selectedFile ({ selectedFileId }) {
		return selectedFileId
	},
	selectedFlight ({ selectedFlightId }) {
		return selectedFlightId
	}
}

export const file = {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
