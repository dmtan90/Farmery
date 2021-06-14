import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import dialog from './modules/dialog'
import common from './modules/common'
import user from './modules/user'
import weather from './modules/weather'

import org from './modules/organization'
import farm from './modules/farm'
import crop from './modules/crop'
import zone from './modules/zone'
import plant from './modules/plant'
import device from './modules/device'
import relay from './modules/relay'
import sensor from './modules/sensor'
import devicemodel from './modules/devicemodel'
import ifttt from './modules/ifttt'
import ui from './modules/ui'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const strict = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	modules: {
		dialog,
		common,
		org,
		user,
		weather,
		farm,
		zone,
		crop,
		plant,
		device,
		relay,
		sensor,
		devicemodel,
		ifttt,
		ui
	},
	getters,
	strict:false
	// plugins: strict ? [createLogger()] : []
})
