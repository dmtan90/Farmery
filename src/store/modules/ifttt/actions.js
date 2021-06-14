import Url from 'config/http'
import http from '@/utils/http'
export default {
	async get({ commit }, id) {
		console.log(id)
		return http.get(Url.auth.ifttt.get, {params:{_id: id}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async gets({ commit }, params) {
		//console.log(plant)
		return http.get(Url.auth.ifttt.gets, {params: params}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async create({ commit }, model) {
		console.log(model)
		return http.put(Url.auth.ifttt.create, model).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async delete({ commit }, id) {
		return http.delete(Url.auth.ifttt.delete, { params: { _id: id } }).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async update({ commit,dispatch }, model) {
		return http.post(Url.auth.ifttt.update, model).then(response => {
			if (response.success) {
			}
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	}
}
