import notice from 'config/notice'
import http from '@/utils/http'
import Url from 'config/http'

export default {
	async setInfo({ commit }, notices) {
		if (!notices) {
			return console.warn('No news notification')
		}
		const { family, weather, electric } = notices
		family && commit(notice.type[0], family)
		weather && commit(notice.type[1], weather)
		electric && commit(notice.type[2], electric)
	},
	async refuse({ commit }, receipts) {
		return http.post(Url.auth.notice.family,receipts).then(response => {
			response.success && commit('setNoticeStatus',{id:receipts.id,status:'rejected',type:'family'})
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	},
	async agree({ commit }, receipts) {
		return http.put(Url.auth.notice.family,receipts).then(response => {
			response.success && commit('setNoticeStatus',{id:receipts.id,status:'joined',type:'family'})
			return response
		}).catch(error => {
			console.log(error)
			return {message:error}
		})
	}
}
