const state = {
	calendar: {}
}

const actions = {
	setCalendar ({ commit }, data) {
		commit('SET_CALENDAR', data)
	}
}

const mutations = {
	SET_CALENDAR (state, data) {
		state.calendar = data
	}
}

const getters = {
	calendar: ({ calendar }) => calendar
}

export const other = {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}