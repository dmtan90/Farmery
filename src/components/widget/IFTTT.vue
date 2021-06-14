<template lang="pug">
.ifttt-card-component(:class="color")
	i.el-icon-odometer.card-icon
	.card-title(:span="24" type="flex" align="middle" justify="center")
		|{{ farmName }}
	.card-subtitle(:span="24" type="flex" align="middle" justify="center")
		|{{ IFTTTTime }}
	el-row.card-value
		el-col(:span="24")
			|{{ IFTTTValue }}
	el-divider
	el-row.card-footer
		el-col(:span="12" style="margin-top:5px")
			el-switch(v-model="status" @change="handleChangeStatus")
		el-col(:span="12" style="text-align:right")
			el-button(icon="el-icon-setting" circle size="small" @click="handleEdit")
			el-button(icon="el-icon-delete" type="danger" circle size="small" @click="handleDelete")
	el-dialog(:title="$t('components.widget.ifttt.editScript')" :visible.sync="bindEditDialogVisible" width="40%")
		el-form.ifttt-add-form(:model="editIfttt" v-if="editIfttt && editIfttt._id" label-width="150px"  center status-ico)
			el-form-item.ifttt-form-input(:label="$t('common.farm')")
				el-select(v-model="editIfttt.farmId" :placeholder="$t('admin.farm.farmHint')" clearable size="small" @change="handleChangeFarm")
					el-option(v-for="item in farms" :key="item.value" :label="item.name" :value="item._id" :disabled="!item.enabled")
			el-form-item(:label="$t('common.repeated')")
				el-select(v-model="editIfttt.repeat" :placeholder="$t('admin.script.selectType')" size="small")
					el-option(v-for="item in repeatTypes" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.dayOfWeek')" v-if="editIfttt.repeat === 2")
				el-select(v-model="editIfttt.days" :placeholder="$t('admin.script.selectType')" size="small" multiple)
					el-option(v-for="item in dayOfWeek" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.workingTime')")
				el-time-picker(is-range v-model="editIfttt.time" range-separator="-" :start-placeholder="$t('common.onTime')" :end-placeholder="$t('common.offTime')" size="small" width="250px")
			el-form-item(:label="$t('common.sensor')")
				el-cascader(v-model="editIfttt.sensorId"
				    :options="sensorOptions"
				    :props="{ expandTrigger: 'hover' }"
				    size="small"
				    style="line-height: 40px"
				    @change="handleChangeSensor")
				el-select(v-model="editIfttt.condition.expression" :placeholder="$t('components.widget.ifttt.operatorHint')" size="small" style="margin-left: 10px")
					el-option(v-for="(item, index) in operators" :key="index" :label="item" :value="item")
				el-input(type="number" v-model.trim="editIfttt.condition.value" :placeholder="$t('components.widget.ifttt.valueHint')" clearable size="small" style="margin-left: 10px; margin-top: 5px")
					template(slot="append")
						|{{ sensorUnit }}
			el-form-item(:label="$t('common.relay')")
				el-cascader(v-model="editIfttt.relayId"
				    :options="relayOptions"
				    :props="{ expandTrigger: 'hover' }"
				    size="small"
				    style="line-height: 40px"
				    @change="handleChangeRelay")
				el-select(v-model="editIfttt.action.isOn" :placeholder="$t('components.widget.ifttt.actionHint')" size="small" style="margin-left: 10px")
					el-option(v-for="item in actions" :key="item.value" :label="item.name" :value="item.value")
				el-input(type="number" v-model.trim="editIfttt.action.duration" :placeholder="$t('components.widget.ifttt.durationHint')" clearable size="small" style="margin-left: 10px; margin-top: 5px")
					template(slot="append")
						|minute(s)
		span(slot="footer" class="dialog-footer")
			el-button(@click="bindEditDialogVisible = false" round style="width: 150px" size="small") {{ $t('common.cancel') }}
			el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('common.update') }}
		</span>
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapState,mapActions } from 'vuex'
import moment from 'moment'
import notice from '@/utils/ui/notice'

@Component({
	props:{
		ifttt: Object,
		index: Number,
		onDelete: Function
	},
	watch:{
		ifttt: function(value, oldValue){
			if(value !== undefined){
				this.buildIFTTT()
			}
		},
		index: function(value, oldValue){
			if(value !== undefined){
				if(this.index < 0){
					this.index = 0
				}
				else if(this.index > this.colors.length){
					this.index = this.index % this.colors.length
				}
				this.color = this.colors[this.index]
			}
		}
	},
	methods:{
		...mapActions({
			'getFarms': 'farm/gets',
			'getFarm': 'farm/get',
			'getDevices': 'device/gets',
			'getDeviceOfRelay': 'device/getByRelayId',
			'getDeviceOfSensor': 'device/getBySensorId',
			'getDevice': 'device/get',
			'getSensorTypes': 'devicemodel/getSensorType',
			'getRelayTypes': 'devicemodel/getRelayType'
		}),
		...mapActions('ifttt',['update','delete']),
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
			// console.log(farm)
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
				if(fn.editIfttt.farmId === '') {
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
			let fn = this
			devices.forEach(device => {
				if(device.control.relays.length > 0) {
					this.relayOptions.push({
						value: device._id,
			            label: device.name,
			            children: device.control.relays.filter(relay => {
			            	relay.value = relay._id
			            	relay.label = relay.name
			            	if(relay._id === this.ifttt.relayId){
			            		this.relayDeviceName = device.name
			            	}
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
			            	if(sensor._id === this.ifttt.sensorId){
			            		this.sensorDeviceName = device.name
			            	}
			            	return true
			            })
					})
				}
			})
		},
		handleChangeSensor(sensor) {
			// console.log(sensor)
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
			this.editIfttt.sensorType = {
				name: sensors[0].name,
				value: sensors[0].type,
				unit: sensors[0].unit
			}
		},
		handleChangeRelay(relay) {
			// console.log(relay)
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
			this.editIfttt.relayType = {
				name: relays[0].name,
				value: relays[0].type
			}
		},
		submitForm() {
			// console.log(this.editIfttt)
			if(this.editIfttt.sensorId === '') {
				return notice.warning(this.$t('components.widget.ifttt.sensorHintError'))
			}

			if(this.editIfttt.condition.value === undefined) {
				return notice.warning(this.$t('components.widget.ifttt.sensorValueHintError'))
			}

			if(this.editIfttt.relayId === '') {
				return notice.warning(this.$t('components.widget.ifttt.relayHintError'))
			}
			this.editIfttt.sensorId = this.editIfttt.sensorId.length === 2 ? this.editIfttt.sensorId[1] : this.editIfttt.sensorId
			this.editIfttt.relayId = this.editIfttt.relayId.length === 2 ? this.editIfttt.relayId[1] : this.editIfttt.relayId
			
			//console.log(this.newTimerForm)
			let time = this.editIfttt.time
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
			if(this.editIfttt.repeat === 0){// no repeat
				cron = date.format("s m H D M d")
			}
			else if(this.editIfttt.repeat === 1){ // repeat everyday
				cron = date.format("s m H * * *")
			}
			else if(this.editIfttt.repeat === 2){ // repeat specific day of week
				if(this.editIfttt.days.length == 0){
					return notice.warning(this.$t('components.widget.ifttt.dayOfWeekHintError'))
				}
				cron = date.format("s m H ? * ") + this.editIfttt.days.join(',')
			}
			let params = {
				_id: this.editIfttt._id,
				farmId: (this.editIfttt.farmId ? this.editIfttt.farmId : ''),
				cron: cron,
				onTime: startTime.valueOf(),
				offTime: endTime.valueOf(),
				sensorId: this.editIfttt.sensorId,
				sensorType: this.editIfttt.sensorType,
				condition: {
					value: this.editIfttt.condition.value,
					expression: this.editIfttt.condition.expression
				},
				relayId: this.editIfttt.relayId,
				relayType: this.editIfttt.relayType,
				action: {
					isOn: this.editIfttt.action.isOn,
					duration: this.editIfttt.action.duration
				},
				type: this.editIfttt.type,
				status: this.editIfttt.status
			}
			console.log(params)
			this.isLoading = true
			this.update(params).then(e=>{
				this.isLoading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.ifttt = e.ifttt
					this.editIfttt = {}
					this.bindEditDialogVisible = false
					this.buildIFTTT()
					this.bindDevices(this.devices)
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		},
		handleChangeStatus(value){
			// console.log(value)
			let params = {
				_id: this.ifttt._id,
				status: value
			}
			console.log(params)
			this.isLoading = true
			this.update(params).then(e=>{
				this.isLoading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.ifttt = e.ifttt
					//  this.editIfttt = {}
					// this.bindEditDialogVisible = false
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		},
		async handleEdit(){
			this.loadData()
			// this.editIfttt = {...this.ifttt}
			// Object.assign({}, this.ifttt)
			let points = this.ifttt.cron.split(' ')
			const s = points[0]
			const m = points[1]
			const H = points[2]
			const D = points[3]
			const M = points[4]
			const d = points[5]

			let repeatMode = 0
			let days = []
			if(D === '*' && M === '*' && d === '*'){
				repeatMode = 1
			}
			else if(D === '?'){
				days = d.split(',').map(x=>Number(x))
				console.log(days)
				repeatMode = 2
			}

			this.editIfttt = {
				_id: this.ifttt._id,
				farmId: this.ifttt.farmId,
				repeat: repeatMode,
				days: days,
				time: [this.ifttt.onTime, this.ifttt.offTime],
				cron: this.ifttt.cron,
				onTime: this.ifttt.onTime,
				offTime: this.ifttt.offTime,
				sensorId: this.ifttt.sensorId,
				sensorType: this.ifttt.sensorType,
				condition: this.ifttt.condition,
				relayId: this.ifttt.relayId,
				relayType: this.ifttt.relayType,
				action: this.ifttt.action
			}
			this.bindEditDialogVisible = true
		},
		handleDelete(){
			this.isLoading = true
			this.delete(this.ifttt._id).then(e=>{
				this.isLoading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					if(this.onDelete){
						this.onDelete()
					}
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		},
		async buildIFTTT(){
			if(this.ifttt.farmId === ''){
				this.farmName = this.$t('components.widget.ifttt.allFarms')
			} else {
				this.getFarm(this.ifttt.farmId).then(e => {
					if(e.success){
						this.farmName = e.farm.name
					}
				})
			}
			this.status = this.ifttt.status
			let sensorDeviceName = ''
			let e = await this.getDeviceOfSensor(this.ifttt.sensorId)
			if(e.success){
				sensorDeviceName = e.device.name
			}

			let relayDeviceName = ''
			e = await this.getDeviceOfRelay(this.ifttt.relayId)
			if(e.success){
				relayDeviceName = e.device.name
			}

			let cron = this.parseRepeated(this.ifttt.cron)
			let time = this.parseTime(this.ifttt.onTime, this.ifttt.offTime)
			this.IFTTTTime = this.$t('components.widget.ifttt.at') + ' ' + time + ' [' + cron + ']'
			this.IFTTTValue = this.$t('components.widget.ifttt.if') + ' ' + sensorDeviceName + '[' + this.ifttt.sensorType.name + '] ' + this.ifttt.condition.expression 
				+ ' ' + this.ifttt.condition.value + ' (' + this.ifttt.sensorType.unit + ') ' + this.$t('components.widget.ifttt.then') + ' ' + relayDeviceName + '[' + this.ifttt.relayType.name + '] '
				+ (this.ifttt.action.isOn ? this.$t('components.widget.ifttt.on') : this.$t('components.widget.ifttt.off'))
				+ (this.ifttt.action.duration === 0 ? '' : (' ' + this.$t('components.widget.ifttt.in') + ' ' + this.ifttt.action.duration + ' ' + this.$t('components.widget.ifttt.minute')))
		},
		parseRepeated(cron) {
			let points = cron.split(' ')
			const s = points[0]
			const m = points[1]
			const H = points[2]
			const D = points[3]
			const M = points[4]
			const d = points[5]

			let repeatMode = this.$t('common.noRepeat')
			let days = []
			if(D === '*' && M === '*' && d === '*'){
				repeatMode = this.$t('common.everyday')
			}
			else if(D === '?'){
				days = d.split(',')
				let dat = []
				let date = moment()
				days.forEach(day => {
					date.day(day)
					dat.push(date.format('ddd'))
				})
				repeatMode = dat.join(' ')
			}
			return repeatMode
		},
		parseTime(startTime, endTime){
			let startDate = moment(startTime)
			let endDate = moment(endTime)
			return startDate.format('HH:mm:ss') + ' - ' + endDate.format('HH:mm:ss')
		}
	},
	mounted() {
		// console.log(this.ifttt)
		// console.log(this.index)
		// this.loadData()
		if(this.ifttt !== undefined){
			this.buildIFTTT()
		}
		if(this.index !== undefined){
			if(this.index < 0){
				this.index = 0
			}
			else if(this.index > this.colors.length){
				this.index = this.index % this.colors.length
			}
			this.color = this.colors[this.index]
		}
	},
	data() {
		return {
			isLoading: false,
			farmName: '',
			IFTTTTime: '',
			IFTTTValue: '',
			color: '',
			status: true,
			colors: ['','card-blue','card-green','card-red','card-orange','card-grey','card-purple','card-pink','card-cyan','card-teal'],
			editIfttt: {},
			bindEditDialogVisible: false,
			farms: [],
			devices: [],
			sensorOptions: [],
			relayOptions: [],
			sensors: [],
			relays: [],
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
					value: true
				},
				{
					name: this.$t('components.widget.ifttt.off'),
					value: false
				}
			],
			sensorUnit: '%'
		}
	}
})
export default class IFTTTCard extends Vue{
}
</script>

<style lang="stylus">
.ifttt-card-component
	box-shadow 2px 3px 10px #ccc
	border-radius 10px
	width 300px
	letter-spacing 0px
	padding 10px
	background-color #FFFFFF
	color #909399
	position relative
	margin-bottom 20px
	.card-title
		text-transform uppercase
		font-size 13px
		margin-bottom 20px
		margin-top 5px
		overflow hidden
		white-space nowrap
	.card-subtitle
		font-size 12px
		margin-bottom 20px
		margin-top 5px
		overflow hidden
		white-space nowrap
	.card-icon
		font-size 24px
		position absolute
		left 10px
		top 10px
	.card-value
		font-size 13px
		text-align center
		font-weight 500
		height 62px
		overflow-x hidden
	.card-unit
		font-size 12px
		margin-left 5px
	.el-divider
		margin 10px 0px
	.el-form-item
		.el-form-item__content
			display: flex
.card-blue
	background-color #409EFF
	color #FFFFFF !important
.card-green
	background-color #67C23A
	color #FFFFFF !important
.card-orange
	background-color #E6A23C
	color #FFFFFF !important
.card-red
	background-color #F56C6C
	color #FFFFFF !important
.card-grey
	background-color #909399
	color #FFFFFF !important
.card-purple
	background-color #9C27B0
	color #FFFFFF !important
.card-pink
	background-color #E91E63
	color #FFFFFF !important
.card-cyan
	background-color #00BCD4
	color #FFFFFF !important
.card-teal
	background-color #009688
	color #FFFFFF !important
</style>
