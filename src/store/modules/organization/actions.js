import http from '@/utils/http'
import Url from 'config/http'

export default {
	async get({ commit }, id) {
		console.log(id)
		return http.get(Url.auth.org.get, { params:{_id: id} }).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarm', response.farm)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async gets({ commit }, params) {
		return http.get(Url.auth.org.gets, { params:params }).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async count({ commit }) {
		return http.get(Url.auth.org.count).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async countUser({ commit }) {
		return http.get(Url.auth.org.countUser).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getOwnOrgs({ commit }) {
		return http.get(Url.auth.org.getOwnFarms).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getShareOrgs({ commit }) {
		return http.get(Url.auth.org.getShareFarms).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getShareAdminOrgs({ commit }) {
		return http.get(Url.auth.org.getShareAdminFarms).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async getShareUserOrgs({ commit }) {
		return http.get(Url.auth.org.getShareUserFarms).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async create({ commit }, org) {
		return http.put(Url.auth.org.create, org).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async update({ commit }, org) {
		return http.post(Url.auth.org.update, org).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async delete({ commit }, id) {
		return http.delete(Url.auth.org.delete, {params:{_id: id}}).then(response => {
			//response.success && commit('user/addFamily', farm, {root:true})
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async registerMember({ commit }, params) {
    	return http.put(Url.auth.org.registerMember, params).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async search({ commit }, name) {
		return http.get(Url.auth.org.search, {params:{name}}).then(response => {
			//response.success && commit('setFarms', response.farms)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async hasExisted({ commit }, name) {
		//console.log("OMG!")
		return http.get(Url.auth.org.exist, {params:{name}}).then(response => {
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	}
}
