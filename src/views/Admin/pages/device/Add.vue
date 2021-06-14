<template lang="pug">
.device-add-component
	el-form.device-add-form(:model="device" label-width="150px"  center status-ico)
		el-form-item.device-form-input(:label="$t('admin.device.deviceId')")
			el-input(type="text" v-model.trim="device.uid" auto-complete='on' :placeholder="$t('admin.device.deviceIdHint')" clearable size="small")
		el-form-item.device-form-input(:label="$t('admin.device.deviceName')")
			el-input(type="text" v-model="device.name" auto-complete='on' :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable size="small")
		el-form-item(:label="$t('admin.device.deviceModel')")
			device-model-select(:devType.sync="device.model" style="width: 193px;")
		el-form-item.device-form-input(:label="$t('admin.device.cameraStream')" v-if="device.model===19")
			el-input(type="text" v-model="device.stream" auto-complete='on' :placeholder="$t('admin.device.cameraStreamHint')" clearable size="small")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('common.add') }}
	.device-add-tip
		h3.device-add-tip-title: | {{ $t('admin.device.tips.title') }}
		el-row
			| {{ $t('admin.device.tips.contents[0]') }}
		el-row
			| {{ $t('admin.device.tips.contents[1]') }}
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
	props: {
	
	},
	methods: {
		...mapActions('device', ['create'])
	}
})
export default class DeviceAdd extends Vue{
	device={
		uid:'',
		name:'',
		model: 1,
		stream: ''
	}
	isLoading = false
	submitForm() {
		console.log(this.device)
		this.device.uid = this.device.uid.toUpperCase()
		this.device.name = this.device.name.toUpperCase()
		let regex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/
		// e.g AA:BB:CC:DD:EE:FF
		if(!this.device.uid || this.device.uid.length != 17 || !regex.test(this.device.uid)){
			return notice.warning(this.$t('admin.device.deviceIdHintError'))
		}

		if(!this.device.name || this.device.name.length > 32){
			return notice.warning(this.$t('admin.device.deviceNameHintError'))
		}
		if(this.device.model === 19 && this.device.stream === ''){
			return notice.warning(this.$t('admin.device.cameraStreamHintError'))
		}
		this.isLoading = true
		// this.bulb.showStatus = this.bulb.status ? 'ON' : 'OFF'
		this.create(this.device).then(e=>{
			this.isLoading = false
			if(e.success){
				notice.success(e.message, this.$t('common.info')).then(()=>{
					this.$router.push({name:'DeviceManage'})
				})
			}else{
				notice.error(e.message, this.$t('common.error'))
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
