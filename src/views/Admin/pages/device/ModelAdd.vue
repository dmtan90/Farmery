<template lang="pug">
.model-add-component
	el-form.model-add-form(:model="model" label-width="150px"  center status-ico)
		el-row(:gutter="20")
			el-col(:xs="24" :md="8")
				avatar-upload.avatar-upload-component(:avatar.sync="model.avatar" :is-init="true")
			el-col(:xs="24" :md="16")
				el-form-item.model-form-input(:label="$t('admin.device.modelId')")
					el-input(type="number" v-model.trim="model.uid" :placeholder="$t('admin.device.deviceIdHint')" clearable size="small")
				el-form-item.model-form-input(:label="$t('admin.device.modelName')")
					el-input(type="text" v-model="model.name" :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable size="small")
				el-form-item(:label="$t('common.sensors')")
					el-select(v-model="model.sensors" :placeholder="$t('admin.device.selectSensors')" multiple size="small" @change="buildDataFormat")
						el-option(v-for="item in sensors" :key="item.value" :label="item.name" :value="item")
				el-form-item(:label="$t('common.relays')")
					el-select(v-model="model.relays" :placeholder="$t('admin.device.selectRelays')" multiple size="small" @change="buildDataFormat")
						el-option(v-for="item in relays" :key="item.value" :label="item.name" :value="item")
				el-form-item.model-form-input(:label="$t('admin.device.dataFormat')")
					el-input(type="text" v-model="model.dataFormat" :placeholder="$t('admin.device.dataFormatHint')" clearable size="small")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('common.add') }}
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
//import DeviceModelSelect from '~/device/ModelSelect'
// import BulbCheckBox from '~/bulb/CheckBox'
// import BulbColorSelect from '~/bulb/ColorSelect'

import { mapActions, mapState } from 'vuex'
import notice from '@/utils/ui/notice'
import AvatarUpload from '~/form/AvatarUpload'

@Component({
	components: {
		AvatarUpload
	},
	props: {
	
	},
	methods: {
		...mapActions('devicemodel', ['create','gets','getSensorType','getRelayType']),
		loadData()	{
			this.gets().then(e => {
				if(e.success){
					this.models = e.models
				}
			})
			this.getSensorType().then(e => {
				if(e.success){
					this.sensors = e.sensors
				}
			})
			this.getRelayType().then(e => {
				if(e.success){
					this.relays = e.relays
				}
			})
		},
		buildDataFormat(){
			let data = 'uid'
			this.model.sensors.forEach(sensor => {
				data += '#' + sensor.name
			})
			this.model.relays.forEach(relay => {
				data += '#' + relay.name
			})
			this.model.dataFormat = data
		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			model: {
				uid: -1,
				name:'',
				avatar: '',
				sensors: [],
				relays: [],
				dataFormat: ''
			},
			models: [],
			isLoading: false,
			sensors: [],
			relays: []
		}
	}
})
export default class ModelAdd extends Vue{
	submitForm() {
		console.log(this.model)
		this.model.name = this.model.name.toUpperCase()
		// e.g AA:BB:CC:DD:EE:FF
		if(Number.isNaN(this.model.uid)){
			return notice.warning(this.$t('admin.device.modelIdHintError'))
		}
		this.model.uid = parseInt(this.model.uid)
		if(!this.model.name || this.model.name.length > 64){
			return notice.warning(this.$t('admin.device.modelNameHintError'))
		}
		this.isLoading = true
		this.create(this.model).then(e=>{
			this.isLoading = false
			if(e.success){
				notice.success(e.message, this.$t('common.info'))
				this.$router.push({name:'DeviceManage'})
			}else{
				notice.error(e.message, this.$t('common.error'))
			}
		})
	}
}
</script>

<style lang="stylus">
.model-add-component
	position relative
	height 400px
	overflow-y scroll
	overflow-x hidden
	margin 30px 100px 100px
.model-add-form
	margin-left auto
	margin-right auto

.model-form-input
	width 86%
</style>
