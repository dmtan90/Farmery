import NProgress from 'nprogress'
export default {
	install(Vue, options) {
		Vue.prototype.progress = isShow => {
			NProgress.configure({ showSpinner: false })
			if (isShow) {
				NProgress.start()
			} else {
				NProgress.done()
			}
		}
	}
}
