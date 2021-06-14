import Token from '@/utils/store/token'
import i18n from '@/lang/i18n'

export default {
	Token(state, token = Token.get()) {
		state.token = token
		const expires = 365
		Token.set(token, { expires }, state.keep)
	},
	Keep(state, keep) {
		state.keep = keep
	},
	Status(state, status) {
		state.status = status
		sessionStorage.setItem('status', status)
		if (status === 'UNLOGIN') {
			Token.remove()
		}
	},
	Info(state, { name, email, address, role, avatar, news, families }) {
		state.name = name
		state.email = email
		state.role = role
		state.address = address
		state.avatar = avatar
		state.news = news
		state.families = families
	},
	News(state, type) {
		state.news[type] = 0
	},
	setEmail(state, email) {
		state.email = email
	},
	electricNewAdd(state) {
		if (!state.news.electric) {
			state.news.electric = 1
		} else {
			state.news.electric++
		}
	},
	setResult(state, { name, email, address, avatar,families }) {
		state.result.name = name
		state.result.email = email
		state.result.address = address
		state.result.avatar = avatar
		state.result.families = families
	},
	addFamily(state, family) {
		const _family = {
			name: family.name,
			displayName: family.displayName || family.name
		}
		state.families.push(_family)
	},
	setUserInfo(state, user) {
		if (user.name) {
			state.name = user.name
		}
		if (user.address) {
			state.address = user.address
		}
	}
}
