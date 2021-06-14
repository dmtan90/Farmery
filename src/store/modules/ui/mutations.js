import notice from 'config/notice'
import i18n from '@/lang/i18n'

export default {
	home(state, isHome) {
		state.isHome = isHome
	},
	setFamilyTab(state, tab) {
		state.familyTab = tab
	},
	finishScriptForm(state, { isFinish, id }) {
		const n = isFinish ? 0 : -1
		if (n === -1 && !state.scriptFormFinishCount) {
			return
		}
		if (!n && state.scriptFormFinishCount === 3) {
			return
		}
		if (state.scriptFormFinishCount >= id && !n) {
			return
		}
		state.scriptFormFinishCount = id + n
	},
	finishFormCountToZero(state) {
		state.scriptFormFinishCount = 0
	},
	switchNightModel(state) {
		let night = sessionStorage.getItem('night') || '0'
		if (night === '0') {
			state.isNightModel = true
			sessionStorage.setItem('night', '1')
		} else {
			state.isNightModel = false
			sessionStorage.setItem('night', '0')
		}
	},
	setMenuState(state, show) {
		state.isShowMenu = show
	},
	setLanguage(state, lang) {
		i18n.locale = lang
		state.language = lang
		localStorage.setItem('language', lang)
	},
	setUnits(state, units) {
		state.units = units
		localStorage.setItem('units', JSON.stringify(units))
	}
}
