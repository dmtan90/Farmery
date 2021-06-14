import Url from 'config/http'
import http from '@/utils/http'
export default {
	async getSeries({ commit,dispatch }, query) {
		//console.log(_id)
		return http.get(Url.auth.sensor.getSeries, { params: query }).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async exportSeries({ commit,dispatch }, query) {
		//console.log(_id)
		return http.post(Url.auth.sensor.getSeries, query).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async update({ commit,dispatch }, sensor) {
		return http.post(Url.auth.sensor.update, sensor).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getThresholds({ commit,dispatch }, _id) {
		return http.get(Url.auth.sensor.getThresholds, {params:{_id: _id}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getThresholdsByDeviceId({ commit,dispatch }, _id) {
		return http.get(Url.auth.sensor.getThresholdsByDeviceId, {params:{_id: _id}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getThreshold({ commit,dispatch }, _id) {
		return http.get(Url.auth.sensor.getThreshold, {params:{_id: _id}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async setThreshold({ commit,dispatch }, timer) {
		return http.put(Url.auth.sensor.setThreshold, timer).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async updateThreshold({ commit,dispatch }, timer) {
		return http.post(Url.auth.sensor.updateThreshold, timer).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async deleteThreshold({ commit,dispatch }, id) {
		return http.delete(Url.auth.sensor.deleteThreshold, { params: { _id: id } }).then(response => {
			//response.success && commit('deleteplantById', id)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
}
