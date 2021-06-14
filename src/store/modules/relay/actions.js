import Url from 'config/http'
import http from '@/utils/http'
export default {
	async getSeries({ commit }, _id) {
		console.log(_id)
		return http.get(Url.auth.relay.getSeries, {params:{_id: _id}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async setState({ commit,dispatch }, relay) {
		return http.post(Url.auth.relay.setState, relay).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getTimers({ commit,dispatch }, _id) {
		return http.get(Url.auth.relay.getTimers, {params:{_id: _id}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getTimersByDeviceId({ commit,dispatch }, _id) {
		return http.get(Url.auth.relay.getTimersByDeviceId, {params:{_id: _id}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getTimer({ commit,dispatch }, _id) {
		return http.get(Url.auth.relay.getTimer, {params:{_id: _id}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async setTimer({ commit,dispatch }, timer) {
		return http.put(Url.auth.relay.setTimer, timer).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async updateTimer({ commit,dispatch }, timer) {
		return http.post(Url.auth.relay.updateTimer, timer).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async deleteTimer({ commit,dispatch }, id) {
		return http.delete(Url.auth.relay.deleteTimer, { params: { _id: id } }).then(response => {
			//response.success && commit('deleteplantById', id)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
}
