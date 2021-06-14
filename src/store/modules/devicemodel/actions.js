import Url from 'config/http'
import http from '@/utils/http'
export default {
	async get({ commit }, id) {
		console.log(id)
		return http.get(Url.auth.devicemodel.get, {params:{_id: id}}).then(response => {
			//response.success && commit('addplant', plant)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async gets({ commit }, params) {
		//console.log(plant)
		return http.get(Url.auth.devicemodel.gets, {params: params}).then(response => {
			//response.success && commit('setPlants', response.plants)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async count({ commit }) {
		//console.log(plant)
		return http.get(Url.auth.devicemodel.count).then(response => {
			//response.success && commit('setPlants', response.plants)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getSensorType({ commit }) {
		//console.log(plant)
		return http.get(Url.auth.devicemodel.getSensorType).then(response => {
			//response.success && commit('setPlants', response.plants)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getRelayType({ commit }) {
		//console.log(plant)
		return http.get(Url.auth.devicemodel.getRelayType).then(response => {
			//response.success && commit('setPlants', response.plants)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async create({ commit }, model) {
		console.log(model)
		return http.put(Url.auth.devicemodel.create, model).then(response => {
			//response.success && commit('addplant', plant)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async delete({ commit }, id) {
		return http.delete(Url.auth.devicemodel.delete, { params: { id } }).then(response => {
			//response.success && commit('deleteplantById', id)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async rename({ commit }, model) {
		return http.patch(Url.auth.devicemodel.rename, model).then(response => {
			//response.success && commit('renameplantById', plant)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async update({ commit,dispatch }, model) {
		return http.post(Url.auth.devicemodel.update, model).then(response => {
			if (response.success) {
				//commit('setTheBulb', plant)
				//commit('user/electricNewAdd', null, {root:true})
				// dispatch('usagelog/refresh', null,{root:true})
				//commit('usagelog/setUsagelogs', response.usagelogs, {root:true})
			}
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	}
}
