import { authHeader, handleResponse } from '@/_helpers/authHeader'

export const userService = {
	login ({ username, password }) {
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		}
		return fetch(`${process.env.VUE_APP_BASE_URL}/auth/login`, options).then(handleResponse)
	},
	logout () {
		localStorage.removeItem('user')
	},
	register (user) {
		const fd = new FormData()
		for (const [ key, value ] of Object.entries(user)) {
			fd.append(key, value)
		}

		const requestOptions = {
			method: 'POST',
			body: fd
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/auth/register`, requestOptions).then(handleResponse)
	},
	getProfile () {
		const options = {
			method: 'GET',
			headers: authHeader(),
		}
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/profile`, options).then(handleResponse)
	},
	match_user (deleteUserId, matchUserId) {
		const requestOptions = {
			method: 'POST',
			headers: { ...authHeader(), 'Content-Type': 'application/json' },
			body: {}
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/match-user?deleteUserId=${deleteUserId}&matchUserId=${matchUserId}`, requestOptions).then(handleResponse)
	},
	getAll (role='') {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/list?role=${role}`, requestOptions).then(handleResponse)
	},
	getAllInterface (role, tikId) {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/list-by-tik-interface/${tikId}?role=${role}`, requestOptions).then(handleResponse)
	},
	getAllpageable (role='', page, tikId='', query='') {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/pageable/list?role=${role}&page=${page}&tikId=${tikId}&query=${query}`, requestOptions).then(handleResponse)
	},
	getByTik (role, tikId, page, query='', operatorId='', superAgitatorId='', uikId = '', size=20) {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/list-by-tik/${tikId}?role=${role}&page=${page}&query=${query}&operatorId=${operatorId}&superAgitatorId=${superAgitatorId}&uikId=${uikId}&size=${size}`, requestOptions).then(handleResponse)
	},
	getById (id) {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/${id}`, requestOptions).then(handleResponse)
	},
	
	getUserCount (role, id) {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/count/user/region/${id}?roleCode=${role}`, requestOptions).then(handleResponse)
	},
	
	listByCurator (id) {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/list-by-curator/${id}`, requestOptions).then(handleResponse)
	},
	getUserAgitators (id) {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/list/agitators?curator_id=${id}`, requestOptions).then(handleResponse)
	},
	listByUik (id, role='') {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/list-by-uik/${id}?role=${role}`, requestOptions).then(handleResponse)
	},
	uikList (agitatorId) {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/uik-list/${agitatorId}`, requestOptions).then(handleResponse)
	},
	getByParent (id, query='') {
		const requestOptions = {
			method: 'GET',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/list/parent/${id}?query=${query}`, requestOptions).then(handleResponse)
	},
	update (user) {
		const requestOptions = {
			method: 'POST',
			headers: { ...authHeader(), 'Content-Type': 'application/json' },
			body: JSON.stringify(user)
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/edit/${user.id}`, requestOptions).then(handleResponse)
	},
	importUsers (data) {
		const fd = new FormData()
		fd.append('file', data.file)
		fd.append('operatorId', data.operatorId)
		fd.append('superAgitatorId', data.superAgitatorId)
		const requestOptions = {
			method: 'POST',
			headers: { ...authHeader() },
			body: fd
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/import`, requestOptions).then(handleResponse)
	},
	_delete (id) {
		const requestOptions = {
			method: 'DELETE',
			headers: authHeader()
		}
		
		return fetch(`${process.env.VUE_APP_BASE_URL}/v1/users/?id=${id}`, requestOptions).then(handleResponse)
	}
}
