import Url from 'config/http'
import http from '@/utils/http'
export default {
	async setInfo({ commit }, devices) {
		commit('setDevices', devices)
	},
	async get({ commit }, _id) {
		console.log(_id)
		return http.get(Url.auth.device.get, {params:{_id: _id}}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getByRelayId({ commit }, _id) {
		console.log(_id)
		return http.get(Url.auth.device.getByRelayId, {params:{_id: _id}}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getBySensorId({ commit }, _id) {
		console.log(_id)
		return http.get(Url.auth.device.getBySensorId, {params:{_id: _id}}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async gets({ commit }, params) {
		console.log(params)
		return http.get(Url.auth.device.gets, {params: params}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async count({ commit }) {
		return http.get(Url.auth.device.count).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async create({ commit }, device) {
		console.log(device)
		return http.put(Url.auth.device.create, device).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async delete({ commit }, id) {
		return http.delete(Url.auth.device.delete, { params: { id } }).then(response => {
			//response.success && commit('deleteDeviceById', id)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async rename({ commit }, device) {
		return http.patch(Url.auth.device.rename, device).then(response => {
			//response.success && commit('renameDeviceById', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async update({ commit,dispatch }, device) {
		return http.post(Url.auth.device.update, device).then(response => {
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
	},
	async getModels({ commit }) {
		return http.get(Url.auth.device.get).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getTimeline({ commit }, id) {
		//console.log(id)
		return http.get(Url.auth.device.getTimeline, {params:{_id: id}}).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getTimelines({ commit }, params) {
		//console.log(crop)
		return http.post(Url.auth.device.getTimelines, params).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async createTimeline({ commit }, timeline) {
		//console.log(crop)
		return http.put(Url.auth.device.createTimeline, timeline).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async deleteTimeline({ commit }, id) {
		return http.delete(Url.auth.device.deleteTimeline, { params: { _id: id } }).then(response => {
			//response.success && commit('deleteDeviceById', id)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async updateTimeline({ commit,dispatch }, timeline) {
		return http.post(Url.auth.device.updateTimeline, timeline).then(response => {
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
		return http.post(Url.auth.device.exportTimeline, params).then(response => {
			//response.success && commit('addDevice', device)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async setPinTopDevice({ commit }, uid) {
		commit('setPinTopDevice', uid)
    }
}
