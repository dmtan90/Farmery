<template lang="pug">
.ifttt-add-component
	el-form.ifttt-add-form(:model="ifttt" label-width="150px"  center status-ico)
		el-form-item.ifttt-form-input(:label="$t('common.farm')")
			el-select(v-model="ifttt.farmId" :placeholder="$t('common.selectFarm')" clearable size="small" @change="handleChangeFarm")
				el-option(v-for="item in farms" :key="item.value" :label="item.name" :value="item._id" :disabled="!item.enabled")
		el-form-item(:label="$t('common.repeated')")
			el-select(v-model="ifttt.repeat" :placeholder="$t('admin.script.selectType')" size="small")
				el-option(v-for="item in repeatTypes" :key="item.value" :label="item.name" :value="item.value")
		el-form-item(:label="$t('common.dayOfWeek')" v-if="ifttt.repeat === 2")
			el-select(v-model="ifttt.days" :placeholder="$t('admin.script.selectType')" size="small" multiple)
				el-option(v-for="item in dayOfWeek" :key="item.value" :label="item.name" :value="item.value")
		el-form-item(:label="$t('common.workingTime')")
			el-time-picker(is-range v-model="ifttt.time" range-separator="-" :start-placeholder="$t('common.onTime')" :end-placeholder="$t('common.offTime')" size="small" width="250px")
		el-form-item.ifttt-form-input(:label="$t('common.sensor')")
			el-cascader(v-model="ifttt.sensorId"
			    :options="sensorOptions"
			    :props="{ expandTrigger: 'hover' }"
			    size="small"
			    @change="handleChangeSensor")
			el-select(v-model="ifttt.condition.express" :placeholder="$t('admin.script.operatorHint')" size="small" style="margin-left: 10px")
				el-option(v-for="(item, index) in operators" :key="index" :label="item" :value="item")
			el-input(type="number" v-model.trim="ifttt.condition.value" :placeholder="$t('admin.script.valueHint')" clearable size="small" style="margin-left: 10px; width: 200px")
				template(slot="append")
					|{{ sensorUnit }}
		el-form-item(:label="$t('common.relay')")
			el-cascader(v-model="ifttt.relayId"
			    :options="relayOptions"
			    :props="{ expandTrigger: 'hover' }"
			    size="small"
			    @change="handleChangeRelay")
			el-select(v-model="ifttt.action.isOn" :placeholder="$t('components.widget.ifttt.actionHint')" size="small" style="margin-left: 10px")
				el-option(v-for="item in actions" :key="item.value" :label="item.name" :value="item.value")
			el-input(type="number" v-model.trim="ifttt.action.duration" :placeholder="$t('components.widget.ifttt.durationHint')" clearable size="small" style="margin-left: 10px; width: 200px")
				template(slot="append")
					| {{ $t('components.widget.ifttt.minute') }}
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('common.create') }}
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
//import DeviceModelSelect from '~/device/ModelSelect'
// import BulbCheckBox from '~/bulb/CheckBox'
// import BulbColorSelect from '~/bulb/ColorSelect'
import moment from 'moment'

import { mapActions, mapState } from 'vuex'
import notice from '@/utils/ui/notice'

let defaultTime = []
let now = moment()
now.hour(6)
now.minute(0)
now.second(0)
now.millisecond(0)
defaultTime.push(now.valueOf())
now.hour(18)
now.minute(0)
now.second(0)
now.millisecond(0)
defaultTime.push(now.valueOf())

@Component({
	components: {
	
	},
	props: {
	
	},
	methods: {
		...mapActions({
			'getFarms': 'farm/gets',
			'getDevices': 'device/gets',
			'getSensorTypes': 'devicemodel/getSensorType',
			'getRelayTypes': 'devicemodel/getRelayType'
		}),
		...mapActions('ifttt', ['create']),
		loadData()	{
			this.isLoading = true
			this.getFarms().then(e => {
				if(e.success) {
					this.farms = e.farms
					this.farms = this.farms.filter(farm => {
						return farm.enabled
					})
				}
			})
			this.getDevices().then(e => {
				this.isLoading = false
				if(e.success){
					this.devices = e.devices
					this.devices = this.devices.filter(device => {
						return ((device.control.sensors.length > 0 || device.control.relays.length > 0) && device.status === true)
					})
					this.bindDevices(this.devices)
				}
			})
			this.getSensorTypes().then(e => {
				if(e.success){
					this.sensors = e.sensors
				}
			})
			this.getRelayTypes().then(e => {
				if(e.success){
					this.relays = e.relays
				}
			})
		},
		handleChangeFarm(farmId) {
			console.log(farmId)
			let fn = this;
			let farm = null
			for(let i = 0; i < this.farms.length; i++){
				if(farmId === this.farms[i]._id){
					farm = this.farms[i]
					break
				}
			}

			this.ifttt.sensorId = ''
			this.ifttt.relayId = ''

			let devices = this.devices.filter(device => {
				if(fn.ifttt.farmId === '') {
					return true
				} else if(farm.deviceIds.indexOf(device.id) >= 0) {
					return true
				} else {
					return false
				}
			})
			this.bindDevices(devices)
		},
		bindDevices(devices) {
			this.relayOptions = []
			this.sensorOptions = []
			devices.forEach(device => {
				if(device.control.relays.length > 0) {
					this.relayOptions.push({
						value: device._id,
			            label: device.name,
			            children: device.control.relays.filter(relay => {
			            	relay.value = relay._id
			            	relay.label = relay.name
			            	return true
			            })
					})
				}

				if(device.control.sensors.length > 0) {
					this.sensorOptions.push({
						value: device._id,
			            label: device.name,
			            children: device.control.sensors.filter(sensor => {
			            	sensor.value = sensor._id
			            	sensor.label = sensor.name
			            	return true
			            })
					})
				}
			})
		},
		handleChangeSensor(sensor) {
			console.log(sensor)
			let devices = this.devices.filter(device => {
				if(device._id === sensor[0]) {
					return true
				}
				return false
			})
			let sensors = devices[0].control.sensors.filter(sen => {
				if(sen._id === sensor[1]) {
					return true
				}
				return false	
			})
			this.sensorUnit = sensors[0].unit
			console.log(sensors)
			this.ifttt.sensorType = {
				name: sensors[0].name,
				value: sensors[0].type,
				unit: sensors[0].unit
			}
		},
		handleChangeRelay(relay) {
			console.log(relay)
			let devices = this.devices.filter(device => {
				if(device._id === relay[0]) {
					return true
				}
				return false
			})
			let relays = devices[0].control.relays.filter(rel => {
				if(rel._id === relay[1]) {
					return true
				}
				return false
			})
			console.log(relays)
			this.ifttt.relayType = {
				name: relays[0].name,
				value: relays[0].type
			}
		},
		submitForm() {
			console.log(this.ifttt)
			if(this.ifttt.sensorId === '') {
				return notice.warning(this.$t('components.widget.ifttt.sensorHintError'))
			}

			if(this.ifttt.condition.value === undefined) {
				return notice.warning(this.$t('components.widget.ifttt.sensorValueHintError'))
			}

			if(this.ifttt.relayId === '') {
				return notice.warning(this.$t('components.widget.ifttt.relayHintError'))
			}
			
			//console.log(this.newTimerForm)
			let time = this.ifttt.time
			if(time === undefined || time.length !== 2){
				return notice.warning(this.$t('components.widget.ifttt.timeHintError'))
			}
			let startTime = moment(time[0])
			let endTime = moment(time[1])
			//cron format second - minute - hour - day of month - month - day of week
			let date = moment()
			date.second(startTime.second())
			date.minute(startTime.minute())
			date.hour(startTime.hour())
			date.date(startTime.date())
			date.month(startTime.month())
			date.day(startTime.day())

			let cron = ''
			if(this.ifttt.repeat === 0){// no repeat
				cron = date.format("s m H D M d")
			}
			else if(this.ifttt.repeat === 1){ // repeat everyday
				cron = date.format("s m H * * *")
			}
			else if(this.ifttt.repeat === 2){ // repeat specific day of week
				if(this.ifttt.days.length == 0){
					return notice.warning(this.$t('components.widget.ifttt.dayOfWeekHintError'))
				}
				cron = date.format("s m H ? * ") + this.ifttt.days.join(',')
			}
			let params = {
				farmId: (this.ifttt.farmId ? this.ifttt.farmId : ''),
				cron: cron,
				onTime: startTime.valueOf(),
				offTime: endTime.valueOf(),
				sensorId: this.ifttt.sensorId[1],
				sensorType: this.ifttt.sensorType,
				condition: {
					value: this.ifttt.condition.value,
					expression: this.ifttt.condition.express
				},
				relayId: this.ifttt.relayId[1],
				relayType: this.ifttt.relayType,
				action: {
					isOn: this.ifttt.action.isOn,
					duration: this.ifttt.action.duration
				},
				type: 0,
				status: true
			}
			console.log(params)
			this.isLoading = true
			this.create(params).then(e=>{
				this.isLoading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.$router.push({name:'ScriptManage'})
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			isLoading: false,
			repeatTypes: [
				{
					name: this.$t('common.noRepeat'),
					value: 0
				},
				{
					name: this.$t('common.everyday'),
					value: 1
				},
				{
					name: this.$t('common.specificDayOfWeek'),
					value: 2
				}
			],
			dayOfWeek: [
				{
					name: this.$t('common.sunday'),
					value: 0
				},
				{
					name: this.$t('common.monday'),
					value: 1
				},
				{
					name: this.$t('common.tuesday'),
					value: 2
				},
				{
					name: this.$t('common.wednesday'),
					value: 3
				},
				{
					name: this.$t('common.thursday'),
					value: 4
				},
				{
					name: this.$t('common.friday'),
					value: 5
				},
				{
					name: this.$t('common.saturday'),
					value: 6
				}
			],
			operators: ['=', '>', '>=', '<', '<='],
			actions: [
				{
					name: this.$t('components.widget.ifttt.on'),
					value: 'true'
				},
				{
					name: this.$t('components.widget.ifttt.off'),
					value: 'false'
				}
			],
			sensorUnit: '%',
			sensorOptions: [],
			relayOptions: [],
			ifttt: {
				farmId: '',
				repeat: 0,
				days: [],
				time: defaultTime,
				cron: '',
				onTime: 0,
				offTime: 0,
				sensorId: '',
				sensorType: null,
				condition: {
					value: 0,
					express: '>='
				},
				relayId: '',
				relayType: null,
				action: {
					isOn: 'true',
					duration: 0
				}
			},
			farms: [],
			devices: [],
			sensors: [],
			relays: []
		}
	}
})
export default class IftttAdd extends Vue{

}
</script>

<style lang="stylus">
.ifttt-add-component
	position relative
	height 400px
	overflow-y scroll
	overflow-x hidden
	margin 30px 100px 100px
	// font-beautify()
	.device-checkbox
		transform translateX(-100px)
	.el-form-item__content .el-input-group
		vertical-align middle
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

.model-form-input
	width 86%
</style>

