import Url from 'config/http'
import http from '@/utils/http'
export default {
	async setInfo({ commit }, scripts) {
		commit('setScripts',scripts)
	},
	async deleteScriptByIndex({ commit,state }, index) {
		const { scriptID } = state.scripts[index]
		return http.delete(Url.auth.script,{params:{scriptID}}).then(response => {
			response.success && commit('deleteScript', index)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async disableScriptByIndex({ commit,state }, index) {
		const { scriptID, disabled } = state.scripts[index]
		return http.post(Url.auth.script, { scriptID,disabled }).then(response => {
			response.success && commit('disabledScript', index)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async addScript({ commit, state }, script) {
		return http.put(Url.auth.script,script).then(response => {
			response.success && commit('setScripts', response.scripts)
			console.log(response.scripts)
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	}
}
