<template lang="pug">
.device-add-component
	el-form.device-add-form(v-if="device" :model="device" label-width="150px"  center status-ico)
		el-form-item.device-form-input(:label="$t('admin.device.deviceId')")
			el-input(type="text" v-model.trim="device.uid" :placeholder="$t('admin.device.deviceIdHint')" clearable size="small")
		el-form-item.device-form-input(:label="$t('admin.device.deviceName')")
			el-input(type="text" v-model="device.name" :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable size="small")
		el-form-item(:label="$t('admin.device.deviceModel')")
			device-model-select(:devType.sync="device.model" style="width: 193px;")
		el-form-item.device-form-input(:label="$t('admin.device.cameraStream')" v-if="device.model===19")
			el-input(type="text" v-model="device.stream" :placeholder="$t('admin.device.cameraStreamHint')" clearable size="small")
		el-form-item.device-form-input(:label="$t('admin.device.crop')" v-if="device.model===41")
			el-select(v-model="device.cropId" :placeholder="$t('admin.device.cropHint')" size="small")
				el-option(v-for="(item,idx) in crops" :key="idx" :label="item.name" :value="item._id")
		el-form-item(:label="$t('common.status')")
			el-select(v-model="device.status" :placeholder="Status" size="small")
				el-option(v-for="item in statusOptions" :key="item.value" :label="item.name" :value="item.value")
		el-form-item(:label="$t('common.sensors')" v-if="device.control.sensors.length > 0")
			el-input(type="text" v-for="(sensor, index) in device.control.sensors" :key="sensor._id" v-model="device.control.sensors[index].name" size="small")
		el-form-item(:label="$t('common.relays')" v-if="device.control.relays.length > 0")
			el-input(type="text" v-for="(relay, index) in device.control.relays" :key="relay._id" v-model="device.control.relays[index].name" size="small")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('common.update') }}
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import DeviceModelSelect from '~/device/ModelSelect'
// import BulbCheckBox from '~/bulb/CheckBox'
// import BulbColorSelect from '~/bulb/ColorSelect'

import { mapActions, mapState } from 'vuex'
import notice from '@/utils/ui/notice'

@Component({
	components: {
		DeviceModelSelect
	},
	props: ['id'],
	methods: {
		...mapActions('device', ['get','update']),
		...mapActions('crop', ['gets']),
		loadData() {
			this.get(this.id).then(e => {
				if(e.success){
					this.device = e.device
					this.loadCrops()
				}
			})
		},
		loadCrops() {
			this.gets().then(e => {
				this.crops = e.crops
			})
		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			statusOptions: [
				{
					name: this.$t('common.enabled'),
					value: true
				},
				{
					name: this.$t('common.disabled'),
					value: false
				}
			],
			crops: null,
			device: null,
			isLoading: false
		}
	}
})
export default class DeviceAdd extends Vue{
	submitForm() {
		// console.log(this.device)
		this.device.uid = this.device.uid.toUpperCase()
		this.device.name = this.device.name.toUpperCase()
		let regex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/
		// e.g AA:BB:CC:DD:EE:FF
		if(!this.device.uid || this.device.uid.length != 17 || !regex.test(this.device.uid)){
			return notice.warning(this.$t('admin.device.deviceIdHintError'))
		}
		if(!this.device.name || this.device.name.length > 64){
			return notice.warning(this.$t('admin.device.deviceNameHintError'))
		}
		if(this.device.model === 19 && this.device.stream === ''){
			return notice.warning(this.$t('admin.device.cameraStreamHintError'))
		}
		this.isLoading = true
		// this.bulb.showStatus = this.bulb.status ? 'ON' : 'OFF'
		const params = {
			_id: this.device._id,
			uid: this.device.uid,
			name: this.device.name,
			model: this.device.model,
			status: this.device.status,
			relays: this.device.control.relays,
			sensors: this.device.control.sensors
		}
		// for camera
		if(this.device.model === 19){
			params['stream'] = this.device.stream
		}

		//for VKIST AI gateway
		if(this.device.model === 41){
			params['cropId'] = this.device.cropId
		}

		this.update(params).then(e=>{
			this.isLoading = false
			if(e.success){
				notice.success(e.message, this.$t('common.info'), 3000)
				this.$router.push({name: 'DeviceManage'})
			}else{
				notice.error(e.message, this.$t('common.error'), 3000)
			}
		})
	}
}
</script>

<style lang="stylus">
.device-add-component
	position relative
	overflow-y scroll
	overflow-x hidden
	margin 30px 100px 100px
	// font-beautify()
	.device-checkbox
		transform translateX(-100px)
.device-add-form
	width 400px
	margin-left auto
	margin-right auto
.device-add-tip
	font-size .8em
	margin-bottom 20px
	& *
		padding 5px 0
.brightness-slider
	width 80%

.device-form-input
	width 86%
</style>
