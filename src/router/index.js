import Vue from 'vue'
import Router from 'vue-router'
import Routes from './routes'
import auth from 'config/auth'
import Token from '@/utils/store/token'
import store from '@/store'
import tip from '@/utils/ui/tip'
import NProgress from 'nprogress'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: Routes
})

router.beforeEach((to,from, next) => {
	NProgress.start()

	if (to.meta.title) {
		document.title = to.meta.title
	}

	if (!Token.get()) {
		if (auth.whiteList.includes(to.name)) {
			return next()
		}
		tip.info('Please log in first!')
		setTimeout(() => store.commit('dialog/showLogin'), 1000)
		next({ name:'Login' })
	} else {
		if (store.getters.status !== 'LOGIN') {
			store.commit('user/Status', 'LOGIN')
			tip.success('login successful!')
		}
		if (to.name === 'Login') {
			return next({ name:'Home' })
		}
		if (!store.getters.account) {
			store.dispatch('user/getUserInfo').then(next).catch(()=>next({ name:'Login' }))
		} else {
			next()
		}
	}
})

router.afterEach((to, from) => {
	store.commit('ui/home',to.name === 'Home')
	NProgress.done()
})

router.onError((to, from) => {
	NProgress.done()
	tip.error('A problem happened')
	router.push({ name:'Login' })
})

export default router
