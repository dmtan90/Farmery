import Url from 'config/http'
import http from '@/utils/http'
export default {
	async setInfo({ commit }, plants) {
		commit('setPlants', plants)
	},
	async get({ commit }, id) {
		console.log(id)
		return http.get(Url.auth.plant.get, {params:{_id: id}}).then(response => {
			//response.success && commit('addplant', plant)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async gets({ commit }, params) {
		//console.log(plant)
		return http.get(Url.auth.plant.gets, {params: params}).then(response => {
			//response.success && commit('setPlants', response.plants)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async count({ commit }) {
		//console.log(plant)
		return http.get(Url.auth.plant.count).then(response => {
			//response.success && commit('setPlants', response.plants)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async create({ commit }, plant) {
		console.log(plant)
		return http.put(Url.auth.plant.create, plant).then(response => {
			//response.success && commit('addplant', plant)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async delete({ commit }, id) {
		return http.delete(Url.auth.plant.delete, { params: { id } }).then(response => {
			//response.success && commit('deleteplantById', id)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async rename({ commit }, plant) {
		return http.patch(Url.auth.plant.rename, plant).then(response => {
			//response.success && commit('renameplantById', plant)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async update({ commit,dispatch }, plant) {
		return http.post(Url.auth.plant.update, plant).then(response => {
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
