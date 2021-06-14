import Vue from 'vue'
import VueI18n from 'vue-i18n'
import vnMessage from './vn.json'
import enMessage from './en.json'

import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementViLocale from 'element-ui/lib/locale/lang/vi'

Vue.use(VueI18n)

const messages = {
  vn: {
  	...vnMessage,
  	...elementViLocale
  },
  en: {
  	...enMessage,
  	...elementEnLocale
  }
}

const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'vn', // set locale
  messages,
  fallbackLocale: 'en',
})

export default i18n
