import http from '@/utils/http'
import Url from 'config/http'

export default {
	async get({ commit }, id) {
		console.log(id)
		return http.get(Url.auth.farm.get, { params:{_id: id} }).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarm', response.farm)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async gets({ commit }, params) {
		return http.get(Url.auth.farm.gets, { params:params }).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async count({ commit }) {
		return http.get(Url.auth.farm.count).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getOwnFarms({ commit }) {
		return http.get(Url.auth.farm.getOwnFarms).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getShareFarms({ commit }) {
		return http.get(Url.auth.farm.getShareFarms).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getShareAdminFarms({ commit }) {
		return http.get(Url.auth.farm.getShareAdminFarms).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getShareUserFarms({ commit }) {
		return http.get(Url.auth.farm.getShareUserFarms).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async create({ commit }, farm) {
		return http.put(Url.auth.farm.create, farm).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async update({ commit }, farm) {
		return http.post(Url.auth.farm.update, farm).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async delete({ commit }, id) {
		return http.delete(Url.auth.farm.delete, {params:{_id: id}}).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async join({ commit },verification) {
    	return http.put(Url.auth.farm.member, verification).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async search({ commit }, name) {
		return http.get(Url.auth.farm.search, {params:{name}}).then(response => {
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
  	async invite({ commit }, verification) {
		return http.post(Url.auth.farm.invite, verification).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async hasExisted({ commit }, name) {
		//console.log("OMG!")
		return http.get(Url.auth.farm.exist, {params:{name}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async member({ commit }, families) {
		return http.get(Url.auth.farm.member, {params:{names:families.join()}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	}
}
