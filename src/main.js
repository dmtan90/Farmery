import Vue from 'vue'
// import ECharts from 'vue-echarts'
import App from './App'
import router from './router'
import store from './store'
import i18n from './lang/i18n'
import './registerServiceWorker'

import Textra from 'vue-textra'
Vue.use(Textra)

import VeLine from 'v-charts/lib/line.common'
Vue.component(VeLine.name, VeLine)

import VeHistogram from 'v-charts/lib/histogram.common'
Vue.component(VeHistogram.name, VeHistogram)

import VePie from 'v-charts/lib/pie.common'
Vue.component(VePie.name, VePie)

// register globally (or you can do it locally)
// Vue.component('v-chart', ECharts)

// import VeTree from 'v-charts/lib/tree.common'
// Vue.component(VeTree.name, VeTree)

import Element from 'element-ui'
// import viLocale from 'element-ui/lib/locale/lang/vi'
// import enLocale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index'
import 'element-ui/lib/theme-chalk/display'
import 'element-ui/lib/theme-chalk/base'

Vue.use(Element, { 
	i18n: (key, value) => i18n.t(key, value) 
})
Vue.use(Element)

import 'normalize.css/normalize'
import '@/assets/css/globals'
import '@/assets/css/element'
import 'vue2-animate/dist/vue2-animate.min'

import 'nprogress/nprogress.css'
import NProgress from '@/plugins/NProgress'
Vue.use(NProgress)

import '@/assets/js/iconfont'
import IconSvg from '~/icons/IconSvg'
Vue.component('icon-svg', IconSvg)

import console from './plugins/console'
console()

import * as filters from './filters'
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

import directives from './directives'
Vue.use(directives)

import VueFlags from "@growthbunker/vueflags"
Vue.use(VueFlags, { iconPath: "/img/flags" })

const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}

const config = {
	googleMapKey: '',
	getLocationOrigin
}
window.WKConfig = config

Vue.prototype.WKConfig = config

Vue.config.productionTip = false

const app = new Vue({
	store,
	i18n,
	router,
	render: h => h(App)
}).$mount('#app')
