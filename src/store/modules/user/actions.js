import http from '@/utils/http'
import Url from 'config/http'
export default {
	async login({ commit, state,dispatch }, user) {
		return http
			.post(Url.api.login, user)
			.then(response => {
				if (response.success) {
					console.log(response)
					commit('Info', response.userInfo)
					commit('Token', response.token)
					;['weather', 'notice','scripts','usagelog'].forEach(e => {
						e && dispatch(`${e}/setInfo`,response[e], {root:true})
					})
				}
				return response
			})
			.catch(error => {
				console.error(error)
				return {message:error}
			})
	},
	async registry({ commit }, user) {
		return http
			.post(Url.api.registry, user)
			.then(response => {
				return response
			})
			.catch(error => {
				console.log(error)
				return {message:error}
			})
	},
	async hasExisted({ state }, email) {
		return http
			.get(Url.api.exist, {
				params: { email }
			})
			.then(response => {
				if (response.success) {
					return response.hasExisted
				}
			})
			.catch(error => {
				console.log(error)
				return {message:error}
			})
	},
	async getUserInfo({ state, commit,dispatch }) {
		return http.get(Url.auth.userInfo).then(response => {
			if (response.success) {
				console.log(response)
				commit('Info', response.userInfo)
				;['weather', 'notice', 'scripts','usagelog'].forEach(e => {
					e && dispatch(`${e}/setInfo`,response[e], {root:true})
				})
			}
			return response
		}).catch(error => {
				console.log(error)
				return {message:error}
		})
	},
	async modify({ state, commit }, user) {
		commit('setUserInfo',user)
		return http.post(Url.auth.userInfo,user).then(response => {
			if (response.success) {
				response.token && commit('Token', response.token)
			}
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async newsToZero({ state,commit },type) {
		return http.delete(Url.auth.news[type]).then(response => {
			if (response.success) {
				commit('News',type)
			}
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async search({ commit }, email) {
		return http.get(Url.auth.user.search,
			{ params: { email } }).then(response => {
			response.success &&	commit('setResult',response)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async addFeedback(context,feedback) {
		return http.put(Url.auth.feedback, feedback).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	}
}
