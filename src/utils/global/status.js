import store from '@/store'
import tip from '@/utils/ui/tip'
import router from '@/router'
import config from 'config/http'
import i18n from '@/lang/i18n'
export default {
	logOut({ isShowLogin = true, msg = i18n.t('utils.global.logout')}) {
		store.commit('user/Status', 'UNLOGIN')
		store.commit('dialog/changeShowStatus',{name:'Login',status:false})
		store.commit('ui/finishFormCountToZero')
		if (isShowLogin) {
			router.push({ name:'Login' })
		}
		else {
			location.href = config.home
		}
	}
}
