import Url from 'config/http'
import http from '@/utils/http'
export default {
	async setInfo({ commit }, zones) {
		commit('setZones', zones)
	},
	async get({ commit }, id) {
		console.log(id)
		return http.get(Url.auth.zone.get, {params:{_id: id}}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async search({ commit }, params) {
		console.log(params)
		return http.get(Url.auth.zone.gets, {params: params}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async gets({ commit }) {
		return http.get(Url.auth.zone.gets).then(response => {
			//response.success && commit('setZones', zones)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async count({ commit }) {
		return http.get(Url.auth.zone.count).then(response => {
			//response.success && commit('setZones', zones)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getTypes({ commit }) {
		return http.get(Url.auth.zone.getTypes).then(response => {
			//response.success && commit('setZones', zones)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getUnits({ commit }) {
		return http.get(Url.auth.zone.getUnits).then(response => {
			//response.success && commit('setZones', zones)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getCultivations({ commit }) {
		return http.get(Url.auth.zone.getCultivations).then(response => {
			//response.success && commit('setZones', zones)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getZoneByFarm({ commit }, id) {
		console.log(id)
		return http.get(Url.auth.zone.getZoneByFarm, {params:{_id: id}}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async create({ commit }, zone) {
		console.log(zone)
		return http.put(Url.auth.zone.create, zone).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async delete({ commit }, id) {
		return http.delete(Url.auth.zone.delete, { params: { id } }).then(response => {
			//response.success && commit('deleteDeviceById', id)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async rename({ commit }, zone) {
		return http.patch(Url.auth.zone.rename, zone).then(response => {
			//response.success && commit('renameDeviceById', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async update({ commit,dispatch }, zone) {
		return http.post(Url.auth.zone.update, zone).then(response => {
			if (response.success) {
				//commit('setTheBulb', device)
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
