import notice from 'config/notice'
import moment from 'moment'

export default {
	[notice.type[0]](state, family) {
		state[notice.type[0]] = family
	},
	[notice.type[1]](state,weather ) {
		state[notice.type[1]] = weather
	},
	[notice.type[2]](state, electric) {
		state[notice.type[2]] = electric
	},
	addNotice(state, { message, receiver, type }) {
		moment.locale('vi-vn')

		const date = moment().fromNow()
		state[type].send.unshift({ date, message, receiver,status:'Not responding' })
	},
	setNoticeStatus(state, { id,status,type }) {
		[].find.call(state[type].receive, e => e.id === id).status = status
	}
}
