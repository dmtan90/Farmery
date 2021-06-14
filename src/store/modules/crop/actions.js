import Url from 'config/http'
import http from '@/utils/http'
export default {
	async setInfo({ commit }, crops) {
		commit('setCrops', crops)
	},
	async get({ commit }, id) {
		//console.log(id)
		return http.get(Url.auth.crop.get, {params:{_id: id}}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getTimeline({ commit }, id) {
		//console.log(id)
		return http.get(Url.auth.crop.getTimeline, {params:{_id: id}}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async search({ commit }, params) {
		//console.log(params)
		return http.get(Url.auth.crop.gets, {params: params}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async gets({ commit }, params) {
		//console.log(crop)
		return http.post(Url.auth.crop.gets, params).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getTimelines({ commit }, params) {
		//console.log(crop)
		return http.post(Url.auth.crop.getTimelines, params).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async count({ commit }) {
		//console.log(crop)
		return http.get(Url.auth.crop.count).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getCropByFarm({ commit }, id) {
		//console.log(id)
		return http.get(Url.auth.crop.getCropByFarm, {params:{_id: id}}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getUnits({ commit }) {
		return http.get(Url.auth.crop.getUnits).then(response => {
			//response.success && commit('setZones', zones)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async create({ commit }, crop) {
		//console.log(crop)
		return http.put(Url.auth.crop.create, crop).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async createTimeline({ commit }, crop) {
		//console.log(crop)
		return http.put(Url.auth.crop.createTimeline, crop).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async delete({ commit }, id) {
		return http.delete(Url.auth.crop.delete, { params: { _id: id } }).then(response => {
			//response.success && commit('deleteDeviceById', id)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async deleteTimeline({ commit }, id) {
		return http.delete(Url.auth.crop.deleteTimeline, { params: { _id: id } }).then(response => {
			//response.success && commit('deleteDeviceById', id)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async rename({ commit }, crop) {
		return http.patch(Url.auth.crop.rename, crop).then(response => {
			//response.success && commit('renameDeviceById', crop)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async update({ commit,dispatch }, crop) {
		return http.post(Url.auth.crop.update, crop).then(response => {
			if (response.success) {
			}
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async updateTimeline({ commit,dispatch }, crop) {
		return http.post(Url.auth.crop.updateTimeline, crop).then(response => {
			if (response.success) {
			}
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async exportTimeline({ commit }, params) {
		//console.log(crop)
		return http.post(Url.auth.crop.exportTimeline, params).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	}
}
