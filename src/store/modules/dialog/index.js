export default {
	namespaced: true,
	state: {
		isShowLogin: false,
		isShowRegistry: false
	},
	mutations: {
		changeShowStatus(state, dialog) {
			state[`isShow${dialog.name}`] = dialog.status
		},
		replaceLogin(state) {
			state.isShowLogin = false
			state.isShowRegistry = true
		},
		replaceRegistry(state) {
			state.isShowLogin = true
			state.isShowRegistry = false
		},
		showLogin(state) {
			state.isShowLogin = true
		}
	}
}
