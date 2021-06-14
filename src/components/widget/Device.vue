<template lang="pug">
.device-card-component(v-loading="loading" :class="isMobile ? 'mobile-viewport' : ''")
	el-container(v-if="orginDevices.length > 0" style="border: 1px solid #eee")
		el-aside.hidden-sm-and-down(width="250px")
			el-container(direction="vertical" style="height: 100%")
				el-header(style="line-height:60px; border-bottom: 1px solid #eee")
					el-row(:span="24")
						el-col(:span="24" style="text-align:right")
							el-popover(placement="bottom" width="250" trigger="click")
								el-container()
									el-form.zone-add-form(:model="filter" label-width="100px"  center status-ico)
										el-row(:gutter="20")
											el-col(:span="24")
												el-form-item(:label="$t('common.org')")
													el-select(v-model="filter.orgIds" :placeholder="$t('common.orgHint')" size="small" clearable multiple @change="handleChangeOrg")
														el-option(v-for="item in orgs" :key="item._id" :label="item.name" :value="item._id")
												el-form-item(:label="$t('common.farm')")
													el-select(v-model="filter.farmIds" :placeholder="$t('common.selectFarms')" size="small" clearable multiple @change="handleChangeFarm")
														el-option(v-for="item in farms" :key="item._id" :label="item.name" :value="item._id")
												el-form-item(:label="$t('common.model')")
													el-select(v-model="filter.modelIds" :placeholder="$t('common.selectDeviceModel')" size="small" clearable multiple)
														el-option(v-for="item in models" :key="item._id" :label="item.name" :value="item.uid")
										el-row(:span="24" type="flex" align="middle" justify="center")
											el-button(type="primary" @click="submitFilterForm" :loading="loading" round style="width: 100px" size="small") {{ $t('common.filter') }}
								el-button(slot="reference" icon="el-icon-s-operation" type="text")
				el-main(style="padding:0px; max-height: 900px")
					el-menu(@select="handleSelectDevice" :default-active="selectedDevice" v-if="devices.length > 0" style="height:100%")
						template(v-for="(device, index) in devices")
							el-menu-item(:key="index" :index="(index+'')")
								el-avatar(v-if="orginModels.length > 0" :size="32" :src="getDeviceModelAvatar(device.model)" fit="fill")
									img(src="/img/no-image.png" style="width:100%")
								span()
									| {{ device.name  }}
								el-popover(placement="bottom" width="250" trigger="hover")
									el-container()
										div()
											p()
												b()
													| {{ $t('admin.device.uid') }}: 
												| {{ device.uid }}
											p()
												b()
													| {{ $t('admin.device.deviceName') }}: 
												| {{ device.name }}
											p(v-if="models.length > 0")
												b()
													| {{ $t('admin.device.deviceModel') }}: 
												| {{ getDeviceModelName(device.model) }}
											p()
												b()
													| {{ $t('common.owner') }}: 
												| {{ device.ownerId }}
											p(v-if="device.control.sensors.length > 0")
												b()
													| {{ $t('common.sensors') }}:
											p(v-if="device.control.sensors.length > 0")
												el-tag(v-for="(sensor,idx) in device.control.sensors" :key="idx" size="mini" style="margin-right: 5px")
													| {{ sensor.name }}
											p(v-if="device.control.relays.length > 0")
												b()
													| {{ $t('common.relays') }}:
											p(v-if="device.control.relays.length > 0")
												el-tag(v-for="(relay,idx) in device.control.relays" :key="idx" size="mini" style="margin-right: 5px")
													| {{ relay.name }}
									i.el-icon-info.el-icon--right(slot="reference" style="position: absolute; right: 30px; line-height: 56px; font-size: 14px")
								el-tooltip(:content="$t('common.pinToTop')" placement="top")
									el-button(icon="el-icon-collection-tag" type="text" size="medium" style="position: absolute; right: 10px; top: 10px;" @click="handlePinToTop(device)")
		el-container(direction="vertical")
			el-header(style="line-height:60px; border-bottom: 1px solid #eee")
				el-row(:span="24")
					el-col(:span="18" style="text-align:left;white-space: nowrap")
						el-dropdown.hidden-md-and-up(@command="handleSelectDevice")
							span.el-dropdown-link
								| {{ device.name }}
								i.el-icon-arrow-down.el-icon--right
							el-dropdown-menu(slot="dropdown")
								template(v-for="(device, index) in devices")
									el-dropdown-item(:key="index" :index="(index+'')" :command="index")
										el-avatar(v-if="orginModels.length > 0" :size="32" :src="getDeviceModelAvatar(device.model)" fit="fill")
											img(src="/img/no-image.png" style="width:100%")
										| {{ device.name  }}
					el-col.hidden-sm-and-down(:span="18" style="text-align:left")
						|{{ device.name }}
					el-col(:span="6" style="text-align:right")
						el-dropdown(@command="handleDeviceCommand")
							i.el-icon-more-outline
							el-dropdown-menu(slot="dropdown")
								el-dropdown-item(command="setting" :disabled="!isOwnerOrAdmin")
									i.el-icon-setting(style="margin-right: 15px; line-height: 36px")
									| {{ $t('common.setting') }}
								el-dropdown-item(command="edit" :disabled="!isOwner")
									i.el-icon-edit-outline(style="margin-right: 15px; line-height: 36px")
									| {{ $t('common.edit') }}
			el-main(style="background-color: #F6F8F8; padding:20px; max-height: 900px")
				div(v-if="sensors.length > 0" style="margin-top:20px")
					span.header-bar()
						| {{ $t('components.widget.device.sensors') }}
					el-row(:span="24" :gutter="20" align="middle" style="margin-top:20px")
						el-col(:xs="24" :sm="12" :md="4" v-for="(sensor, index) in sensors" :key="sensor._id" style="margin-bottom:20px")
							sensor-card(:sensor.sync="sensor" :index.sync="index" @click="handleSenseChart")
					el-divider()
				div(v-if="relays.length > 0" style="margin-top:20px")
					span.header-bar()
						| {{ $t('components.widget.device.controls') }}
					el-row(:span="24" :gutter="20" align="middle" style="margin-top:20px")
						el-col(:xs="24" :sm="12" :md="4" v-for="relay in relays" :key="relay._id" :value="relay" style="margin-bottom:20px")
							relay-card(:relay.sync="relay" @change="handleSwitchRelay" :allowAction.sync="isOwnerOrAdmin")
					el-divider()
				div(v-if="sensors.length > 0" style="margin-top:20px")
					span.header-bar()
						| {{ $t('components.widget.device.environmentAnalysis') }}
					el-row(:span="24" :gutter="20" align="middle" style="margin-top:20px")
						el-col(:xs="24" :sm="24" :md="24")
							sensor-chart-card(:sensors.sync="sensors" :sensorIds.sync="sensorIds" :granularity.sync="granId")
					el-divider()
				div(v-if="device.model === 41" style="margin-top:20px")
					span.header-bar()
						| {{ $t('components.widget.device.timeline') }}
					el-row(:span="24" :gutter="20" align="middle" style="margin-top:20px")
						el-col(:span="24" style="margin-bottom:20px")
							device-timeline-card(:device.sync="device")
	el-container(v-else style="border: 1px solid #eee")
		| {{ $t('components.widget.device.noDeviceHint') }}
	el-dialog(:title="device.name" :visible.sync="bindDeviceDialogVisible" width="60%" @open="handleLoadDeviceSetting")
		device-setting(:id.sync="deviceId" :is-init.sync="bindDeviceDialogVisible")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapState,mapActions } from 'vuex'
import SensorCard from './Sensor'
import SensorChartCard from './SensorChart'
import RelayCard from './Relay'
import DeviceTimelineCard from './DeviceTimeline'
import DeviceSetting from '@/views/Admin/pages/device/Setting'
import moment from 'moment'

@Component({
	components:{
		SensorCard,
		RelayCard,
		SensorChartCard,
		DeviceSetting,
		DeviceTimelineCard
	},
	computed:{
		...mapState('user',['role', 'email']),
		...mapState('device', ['pinTopDevice'])
	},
	props:{
	},
	watch:{
	},
	methods:{
		...mapActions('device',['gets', 'get', 'setPinTopDevice']),
		...mapActions({
            'getOrgs': 'org/gets',
            'getFarms': 'farm/gets',
            'getModels': 'devicemodel/gets'
        }),
		loadData() {
			this.loading = true
			this.getOrgs().then(e => {
				if(e.success){
					this.orgs = e.orgs
				}
			})

			this.getModels().then(e => {
				if(e.success){
					this.models = e.models
					this.orginModels = e.models
				}
			})

			this.gets().then(e => {
				if(e.success) {
					this.devices = e.devices

					if(this.devices.length > 0){
						this.devices = this.devices.filter(device => {
							return ((device.control.sensors.length > 0 || 
								device.control.relays.length > 0 || 
								(device.model !== 9 && device.model !== 11)) 
							&& device.status === true)
						})

						if(this.pinTopDevice !== ''){
							// sort the top device to first array
							for(let i = 0; i < this.devices.length; i++){
								let device = this.devices[i]
								if(this.pinTopDevice === device.uid){
									// remove the element at position
									this.devices.splice(i, 1)
									// insert the element to top
									this.devices.splice(0, 0, device)
									break
								}
							} 
						}
					}
					this.orginDevices = this.devices

					this.getFarms().then(e => {
						this.loading = false
						if(e.success){
							this.farms = e.farms
							this.orginFarms = e.farms
							// add share user into devices
							this.farms.forEach(farm => {
								let adminIds = farm.share.adminIds
								let userIds = farm.share.userIds
								let deviceIds = farm.deviceIds
								deviceIds.forEach(deviceId => {
									for(let i = 0; i < this.devices.length; i++){
										let device = this.devices[i]
										if(device._id === deviceId){
											adminIds.forEach(id => {
												device.share.adminIds.push(id)	
											})
											userIds.forEach(id => {
												device.share.userIds.push(id)
											})
										}
									}
								})
							})

							if(this.deviceId === '' && this.devices.length > 0) {
								this.handleSelectDevice(0)
							}
						}
					})
				}
			})
		},
		handleSelectDevice(val) {
			console.log(val)
			this.deviceId = this.devices[val].id
			this.deviceIdx = val
			this.device = this.devices[val]
			this.sensors = this.device.control.sensors
			this.relays = this.device.control.relays
			this.sensorIds = []
			this.loadChart = true
			if(this.timer !== undefined){
				clearInterval(this.timer)
			}

			this.loadDeviceData()
			this.verifyRole()
			
			let fn = this
			this.timer = setInterval(function(){
				fn.loadDeviceData()
			}, 15000)

			this.loadChart = false
			this.selectedDevice = val + ''
		},
		loadDeviceData(){
			let fn = this
			fn.get(fn.deviceId).then(e => {
				if(e.success){
					let share = fn.device.share
					fn.device = e.device
					fn.device.share = share
					fn.devices[fn.deviceIdx] = fn.device
					fn.sensors = fn.device.control.sensors
					fn.relays = fn.device.control.relays
				}
			})
		},
		handleSwitchRelay(data) {
			console.log(data)
		},
		handleSenseChart(id) {
			console.log(id)
			this.sensorIds = [id]
			this.granId = 'utm'
		},
		handleLoadDeviceSetting() {

		},
		handleDeviceCommand(cmd) {
			if(cmd === 'setting') {
				this.bindDeviceDialogVisible = true
			}
			else if(cmd === 'edit') {
				this.$router.push({ name:'DeviceModelEdit', params: {id: this.deviceId} })
			}
		},
		verifyRole(){
			if(this.device && (this.device.ownerId === this.email || this.device.share.adminIds.indexOf(this.email) >= 0)){
	  			this.isOwnerOrAdmin = true
	  		}
	  		else{
	  			this.isOwnerOrAdmin = false
	  		}

	  		if(this.device && this.device.ownerId === this.email){
	  			this.isOwner = true
	  			this.isOwnerOrAdmin = true
	  		}
	  		else{
	  			this.isOwner = false	
	  		}
	  		console.log("isOwnerOrAdmin: " + this.isOwnerOrAdmin)
	  		console.log("isOwner: " + this.isOwner)
		},
	  	handleChangeOrg(){
	  		let farms = []
	  		if(this.filter.orgIds.length > 0){
	  			this.orginFarms.forEach(farm => {
	  				if(this.filter.orgIds.indexOf(farm.orgId) >= 0){
	  					farms.push(farm)
	  				}
	  			})
	  		}
	  		else{
	  			farms = this.orginFarms
	  		}
	  		
	  		this.farms = farms
	  		let farmIds = []
	  		farms.forEach(farm => {
	  			farmIds.push(farm._id)
	  		})

	  		for(let i = 0; i < this.filter.farmIds.length; i++){
	  			let id = this.filter.farmIds[i]
  				if(farmIds.indexOf(id) < 0){
  					this.filter.farmIds,splice(i, 1)
  					i--
  				}
  			}
	  	},
	  	handleChangeFarm(){
	  		let models = []
	  		let modelUIDs = []
	  		if(this.filter.farmIds.length > 0){
	  			this.farms.forEach(farm => {
	  				if(this.filter.farmIds.indexOf(farm._id) >= 0){
	  					farm.devices.forEach(device => {
	  						if(modelUIDs.indexOf(device.model) < 0){
	  							modelUIDs.push(device.model)
	  						}
	  					})
	  				}
	  			})

	  			this.orginModels.forEach(model => {
	  				if(modelUIDs.indexOf(model.uid) >= 0){
	  					models.push(model)
	  				}
	  			})
	  		}
	  		else{
	  			models = this.orginModels
	  		}
	  		
	  		this.models = models
	  	},
	  	handleChangeModel(){

	  	},
	  	submitFilterForm(){
	  		// let deviceIds = []
	  		let devices = Array.from(this.orginDevices)
	  		if(this.filter.modelIds.length > 0){
	  			devices = devices.filter(device => {
	  				if(this.filter.modelIds.indexOf(device.model) >= 0){
	  					return true
	  				}
	  				return false
	  			})
	  		}

	  		let farms = []
	  		let deviceIds = []

	  		if(this.filter.farmIds.length > 0){
	  			this.farms.forEach(farm => {
	  				if(this.filter.farmIds.indexOf(farm._id) >= 0){
	  					farms.push(farm)
	  				}
	  			})
	  		}
	  		else{
	  			farms = this.farms
	  		}

	  		farms.forEach(farm => {
	  			farm.devices.forEach(device => {
	  				deviceIds.push(device._id)
	  			})
	  		})

	  		devices = devices.filter(device => {
  				if(deviceIds.indexOf(device._id) >= 0){
  					return true
  				}
  				return false
  			})

  			this.devices = devices

  			this.handleSelectDevice(0)
	  	},
	  	getDeviceModelName(model){
	  		let name = ''
	  		for(let i = 0; i < this.orginModels.length; i++){
	  			if(this.orginModels[i].uid === model){
	  				name = this.orginModels[i].name
	  				break
	  			}
	  		}
	  		return name
	  	},
	  	getDeviceModelAvatar(model){
	  		let avatar = ''
	  		for(let i = 0; i < this.orginModels.length; i++){
	  			if(this.orginModels[i].uid === model){
	  				avatar = this.orginModels[i].avatar
	  				break
	  			}
	  		}
	  		return avatar
	  	},
	  	parseDate(time){
			let now = moment(time)
			return now.format('YYYY/MM/DD')
		},
		handlePinToTop(device){
			this.setPinTopDevice(device.uid)
		}
	},
	mounted() {
		const fn = this
		this.loadData()
		window.onresize = () => {
	    	this.windowWidth = window.innerWidth
	    	this.isMobile = (this.windowWidth < 756 ? true : false)
	    }
	    this.isMobile = (this.windowWidth < 756 ? true : false)
	},
	beforeDestroy() {
		if(this.timer !== undefined){
			clearInterval(this.timer)
		}
	},
	data() {
		return {
			orginDevices: [],
			devices: [],
			device: {},
			deviceIdx: 0,
			deviceId: '',
			sensors: [],
			relays: [],
			sensorIds: [],
			granId: 'utm',
			bindDeviceDialogVisible: false,
			loading: true,
			timer: undefined,
			loadChart: false,
			windowWidth: window.innerWidth,
			isMobile: false,
			filter: {
				orgIds: [],
				farmIds: [],
				modelIds: []
			},
			orgs: [],
			farms: [],
			orginFarms: [],
			models: [],
			orginModels: [],
			isOwnerOrAdmin: true,
			isOwner: true,
			selectedDevice: '0'
		}
	}
})
export default class StatisticCard extends Vue{
}
</script>

<style lang="stylus">
.device-card-component
	box-shadow 2px 3px 10px #ccc
	border-radius 10px
	width 100%
	background-color #FFFFFF
	position relative
	padding 20px
.device-card-component.mobile-viewport
	padding 0px
	.el-main
		padding 10px
</style>
