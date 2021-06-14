<template lang="pug">
.device-setting-component(v-loading="loading")
	div.timer-list-container(v-if="showHomePage" v-loading="loading")
		el-tabs(v-model="activeTab")
			el-tab-pane(:label="$t('common.sensorThreshold')" name="threshold" v-if="device !== undefined && device.control.sensors.length > 0")
				el-button(type="success" icon="el-icon-circle-plus-outline" @click="showPage('addThreshold')" round style="width:150px" size="small")
					| {{ $t('common.addThreshold') }}
				el-table(:data="thresholds" stripe height="300" size="small")
					el-table-column(prop="sensorId" :label="$t('common.sensor')" width="150")
						template(slot-scope="scope")
							|{{ getSensorName(scope.row.sensorId) }}
					el-table-column(prop="cron" :label="$t('common.repeated')" width="150")
						template(slot-scope="scope")
							|{{ parseRepeated(scope.row.cron) }}
					el-table-column(prop="onTime" :label="$t('common.from')" width="100")
						template(slot-scope="scope")
							|{{ parseTime(scope.row.onTime) }}
					el-table-column(prop="threshold" :label="$t('common.threshold')" width="200")
						template(slot-scope="scope")
							|{{ parseThreshold(scope.row.sensorId, scope.row.threshold) }}
							p(v-if="showPercentage(scope.row.sensorId)")
								|{{ parsePercentage(scope.row.percentage) }}
					el-table-column(prop="status" :label="$t('common.enabled')" width="100")
						template(slot-scope="scope")
							el-switch(v-model="scope.row.status" @change="handleSwitchThresholdStatus(scope.$index)")
					el-table-column(fixed="right" :label="$t('common.options')" width="150")
						template(slot-scope="scope")
							el-tooltip(:content="$t('common.edit')" placement="top")
								el-button(@click="editThreshold(scope.$index)" type="text" size="small" round)
									i.el-icon-edit-outline
							el-tooltip(:content="$t('common.delete')" placement="top")
								el-button(@click="deleteThres(scope.$index)" type="text" size="small" round)
									i.el-icon-delete
			el-tab-pane(:label="$t('common.relayTimer')" name="timer" v-if="device !== undefined && device.control.relays.length > 0")
				el-button(type="success" icon="el-icon-circle-plus-outline" @click="showPage('addTimer')" round style="width:150px" size="small")
					|Add Timer
				el-table(:data="timers" stripe height="300" size="small")
					el-table-column(prop="relayId" :label="$t('common.relay')" width="150")
						template(slot-scope="scope")
							|{{ getRelayName(scope.row.relayId) }}
					el-table-column(prop="type" :label="$t('common.type')" width="100")
						template(slot-scope="scope")
							el-tag(size="mini")
								|{{ scope.row.type == 0 ? $t('common.cycle') : $t('common.schedule') }}
					el-table-column(prop="cron" :label="$t('common.repeated')" width="150")
						template(slot-scope="scope")
							|{{ parseRepeated(scope.row.cron) }}
					el-table-column(prop="onTime" :label="$t('common.period')" width="200")
						template(slot-scope="scope")
							|{{ parseTime(scope.row.onTime, scope.row.offTime) }}
					el-table-column(prop="cycle" :label="$t('common.continuous')" width="200")
						template(slot-scope="scope" v-if="scope.row.cycle !== undefined")
							|{{ scope.row.cycle.onTime }} ({{ $t('common.mins') }}) / {{ scope.row.cycle.offTime }} ({{ $t('common.mins') }})
					el-table-column(prop="status" :label="$t('common.enabled')" width="100")
						template(slot-scope="scope")
							el-switch(v-model="scope.row.status" @change="handleSwitchTimerStatus(scope.$index)")
					el-table-column(fixed="right" :label="$t('common.options')" width="150")
						template(slot-scope="scope")
							el-tooltip(:content="$t('common.edit')" placement="top")
								el-button(@click="editT(scope.$index)" type="text" size="small" round)
									i.el-icon-edit-outline
							el-tooltip(:content="$t('common.delete')" placement="top")
								el-button(@click="deleteT(scope.$index)" type="text" size="small" round)
									i.el-icon-delete
	div.timer-add-container(v-if="showAddTimer")
		el-page-header(@back="showPage('showHomePage')" :content="$t('common.addTimer')")
		el-form(v-model="newTimerForm" label-width="130px" style="margin-top: 20px")
			el-form-item(:label="$t('common.relay')" v-if="device.control.relays.length > 0")
				el-select(v-model="newTimerForm.relayId" :placeholder="$t('admin.device.selectRelay')" size="small")
					el-option(v-for="relay in device.control.relays" :key="relay._id" :label="relay.name" :value="relay._id")
			el-form-item(:label="$t('common.timerMode')")
				el-select(v-model="newTimerForm.type" :placeholder="$t('admin.device.selectType')" size="small")
					el-option(v-for="item in timerTypes" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.repeated')")
				el-select(v-model="newTimerForm.repeat" :placeholder="$t('admin.device.selectType')" size="small")
					el-option(v-for="item in repeatTypes" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.dayOfWeek')" v-if="newTimerForm.repeat === 2")
				el-select(v-model="newTimerForm.days" :placeholder="$t('admin.device.selectType')" size="small" multiple)
					el-option(v-for="item in dayOfWeek" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.workingTime')")
				el-time-picker(is-range v-model="newTimerForm.time" range-separator="-" :start-placeholder="$t('common.onTime')" :end-placeholder="$t('common.offTime')" size="small" width="250px")
			el-form-item(:label="$t('common.onOffMinutes')" v-if="newTimerForm.type === 0")
				el-input-number(size="mini" v-model="newTimerForm.cycle.onTime" :min="0" :max="100" :placeholder="$t('common.onDuration')")
				el-input-number(size="mini" v-model="newTimerForm.cycle.offTime" :min="0" :max="100" :placeholder="$t('common.offDuration')" style="margin-left:20px")
		div(slot="footer" class="dialog-footer")
			el-button(type="primary" @click="handleAddTimer" :disabled="loading" :loading="loading" size="small") {{ $t('common.create') }}
	div.timer-add-container(v-if="showEditTimer")
		el-page-header(@back="showPage('showHomePage')" :content="$t('common.editTimer')")
		el-form(v-model="editTimerForm" label-width="130px" style="margin-top: 20px")
			el-form-item(:label="$t('common.relay')" v-if="device.control.relays.length > 0")
				el-select(v-model="editTimerForm.relayId" :placeholder="$t('admin.device.selectRelay')" size="small" disabled="true")
					el-option(v-for="relay in device.control.relays" :key="relay._id" :label="relay.name" :value="relay._id")
			el-form-item(:label="$t('common.timerMode')")
				el-select(v-model="editTimerForm.type" :placeholder="$t('admin.device.selectType')" size="small")
					el-option(v-for="item in timerTypes" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.repeated')")
				el-select(v-model="editTimerForm.repeat" :placeholder="$t('admin.device.selectType')" size="small")
					el-option(v-for="item in repeatTypes" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.dayOfWeek')" v-if="editTimerForm.repeat === 2")
				el-select(v-model="editTimerForm.days" :placeholder="$t('admin.device.selectType')" size="small" multiple)
					el-option(v-for="item in dayOfWeek" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.workingTime')")
				el-time-picker(is-range v-model="editTimerForm.time" range-separator="-" :start-placeholder="$t('common.onTime')" :end-placeholder="$t('common.offTime')" size="small" width="250px")
			el-form-item(:label="$t('common.onOffMinutes')" v-if="editTimerForm.type === 0")
				el-input-number(size="mini" v-model="editTimerForm.cycle.onTime" :min="0" :max="100" :placeholder="$t('common.onDuration')")
				el-input-number(size="mini" v-model="editTimerForm.cycle.offTime" :min="0" :max="100" :placeholder="$t('common.offDuration')" style="margin-left:20px")
		div(slot="footer" class="dialog-footer")
			el-button(type="primary" @click="handleEditTimer" :disabled="loading" :loading="loading" size="small") {{ $t('common.update') }}
	div.timer-add-container(v-if="showAddThreshold")
		el-page-header(@back="showPage('showHomePage')" :content="$t('common.addThreshold')")
		el-form(v-model="newThresholdForm" label-width="200px" style="margin-top: 20px")
			el-form-item(:label="$t('common.sensor')")
				el-select(v-model="newThresholdForm.sensorId" :placeholder="$t('admin.device.selectSensor')" size="small" @change="handleChangeSensor")
					el-option(v-for="sensor in device.control.sensors" :key="sensor._id" :label="sensor.name" :value="sensor._id")
			el-form-item(:label="$t('common.nutrientFormula')" v-if="newThresholdForm.percentage !== undefined")
				el-row(:gutter="20" style="margin-left: 0px; margin-right: 0px")
					el-col(:xs="24" :sm="12" :md="6" style="padding-left: 0px;")
						div(class="sub-title") A (%)
						el-input-number(size="mini" v-model="newThresholdForm.percentage.a" :min="0" :max="100000" placeholder="A (%)")
					el-col(:xs="24" :sm="12" :md="6")
						div(class="sub-title") B (%)
						el-input-number(size="mini" v-model="newThresholdForm.percentage.b" :min="0" :max="100000" placeholder="B (%)")
					el-col(:xs="24" :sm="12" :md="6")
						div(class="sub-title") C (%)
						el-input-number(size="mini" v-model="newThresholdForm.percentage.c" :min="0" :max="100000" placeholder="C (%)")
					el-col(:xs="24" :sm="12" :md="6" style="padding-right: 0px")
						div(class="sub-title") D (%)
						el-input-number(size="mini" v-model="newThresholdForm.percentage.d" :min="0" :max="100000" placeholder="D (%)")
			el-form-item(:label="$t('common.dosingTime')" v-if="newThresholdForm.percentage !== undefined")
				el-input-number(size="mini" v-model="newThresholdForm.percentage.dosing_time" :min="0" :max="10000" :placeholder="$t('common.dosingTime')")
			el-form-item(:label="$t('common.dosingInterval')" v-if="newThresholdForm.percentage !== undefined")
				el-input-number(size="mini" v-model="newThresholdForm.percentage.dosing_interval" :min="0" :max="10000" :placeholder="$t('common.dosingInterval')")
			el-form-item(:label="$t('common.repeated')")
				el-select(v-model="newThresholdForm.repeat" :placeholder="$t('admin.device.selectType')" size="small")
					el-option(v-for="item in repeatTypes" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.dayOfWeek')" v-if="newThresholdForm.repeat === 2")
				el-select(v-model="newThresholdForm.days" :placeholder="$t('admin.device.selectType')" size="small" multiple)
					el-option(v-for="item in dayOfWeek" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.workingTime')")
				el-time-picker(v-model="newThresholdForm.time" :placeholder="$t('common.startTime')" size="small" width="250px")
			el-form-item(:label="newThresholdForm.unit")
				el-row(:gutter="20" style="margin-left: 0px; margin-right: 0px")
					el-col(:xs="24" :sm="12" :md="6" style="padding-left: 0px;")
						div(class="sub-title") {{ $t('common.minValue') }}
						el-input-number(size="mini" v-model="newThresholdForm.threshold.minValue" :min="0" :max="100000" :placeholder="$t('common.minValue')")
					el-col(:xs="24" :sm="12" :md="6")
						div(class="sub-title") {{ $t('common.maxValue') }}
						el-input-number(size="mini" v-model="newThresholdForm.threshold.maxValue" :min="0" :max="100000" :placeholder="$t('common.maxValue')")
		div(slot="footer" class="dialog-footer")
			el-button(type="primary" @click="handleAddThreshold" :disabled="loading" :loading="loading" size="small") {{ $t('common.create') }}
	div.timer-add-container(v-if="showEditThreshold")
		el-page-header(@back="showPage('showHomePage')" :content="$t('common.editThreshold')")
		el-form(v-model="editThresholdForm" label-width="200px" style="margin-top: 20px")
			el-form-item(:label="$t('common.sensor')")
				el-select(v-model="editThresholdForm.sensorId" :placeholder="$t('admin.device.selectSensor')" size="small" @change="handleChangeSensor" disabled="true")
					el-option(v-for="sensor in device.control.sensors" :key="sensor._id" :label="sensor.name" :value="sensor._id")
			el-form-item(:label="$t('common.nutrientFormula')" v-if="showPercentage(editThresholdForm.sensorId)")
				el-row(:gutter="20" style="margin-left: 0px; margin-right: 0px")
					el-col(:xs="24" :sm="12" :md="6" style="padding-left: 0px;")
						div(class="sub-title") A (%)
						el-input-number(size="mini" v-model="editThresholdForm.percentage.a" :min="0" :max="100000" placeholder="A (%)")
					el-col(:xs="24" :sm="12" :md="6")
						div(class="sub-title") B (%)
						el-input-number(size="mini" v-model="editThresholdForm.percentage.b" :min="0" :max="100000" placeholder="B (%)")
					el-col(:xs="24" :sm="12" :md="6")
						div(class="sub-title") C (%)
						el-input-number(size="mini" v-model="editThresholdForm.percentage.c" :min="0" :max="100000" placeholder="C (%)")
					el-col(:xs="24" :sm="12" :md="6" style="padding-right: 0px")
						div(class="sub-title") D (%)
						el-input-number(size="mini" v-model="editThresholdForm.percentage.d" :min="0" :max="100000" placeholder="D (%)")
			el-form-item(:label="$t('common.dosingTime')" v-if="showPercentage(editThresholdForm.sensorId)")
				el-input-number(size="mini" v-model="editThresholdForm.percentage.dosing_time" :min="0" :max="10000" :placeholder="$t('common.dosingTime')")
			el-form-item(:label="$t('common.dosingInterval')" v-if="showPercentage(editThresholdForm.sensorId)")
				el-input-number(size="mini" v-model="editThresholdForm.percentage.dosing_interval" :min="0" :max="10000" :placeholder="$t('common.dosingInterval')")
			el-form-item(:label="$t('common.repeated')")
				el-select(v-model="editThresholdForm.repeat" :placeholder="$t('admin.device.selectType')" size="small")
					el-option(v-for="item in repeatTypes" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.dayOfWeek')" v-if="editThresholdForm.repeat === 2")
				el-select(v-model="editThresholdForm.days" :placeholder="$t('admin.device.selectType')" size="small" multiple)
					el-option(v-for="item in dayOfWeek" :key="item.value" :label="item.name" :value="item.value")
			el-form-item(:label="$t('common.workingTime')")
				el-time-picker(v-model="editThresholdForm.time" :placeholder="$t('common.startTime')" size="small" width="250px")
			el-form-item(:label="editThresholdForm.unit")
				el-row(:gutter="20" style="margin-left: 0px; margin-right: 0px")
					el-col(:xs="24" :sm="12" :md="6" style="padding-left: 0px;")
						div(class="sub-title") {{ $t('common.minValue') }}
						el-input-number(size="mini" v-model="editThresholdForm.threshold.minValue" :min="0" :max="100000" :placeholder="$t('common.minValue')")
					el-col(:xs="24" :sm="12" :md="6")
						div(class="sub-title") {{ $t('common.maxValue') }}
						el-input-number(size="mini" v-model="editThresholdForm.threshold.maxValue" :min="0" :max="100000" :placeholder="$t('common.maxValue')")
		div(slot="footer" class="dialog-footer")
			el-button(type="primary" size="small" @click="handleEditThreshold" :disabled="loading" :loading="loading") {{ $t('common.update') }}
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import { mapActions, mapState } from 'vuex'
import notice from '@/utils/ui/notice'
import moment from 'moment'

@Component({
	props: ['id', 'isInit'],
	watch: {
		isInit: function(value, oldValue){
			// console.log(value)
			if(value){
				this.loadData()
				this.showPage('showHomePage')
			}
		},
		id: function(value){
			if(value){
				this.loadData()
				this.showPage('showHomePage')
			}
		}
	},
	methods: {
		...mapActions('device', ['get','update']),
		...mapActions('sensor',['getThresholds','setThreshold','updateThreshold','deleteThreshold','getThresholdsByDeviceId']),
		...mapActions('relay',['setState','getTimers','setTimer','updateTimer','deleteTimer','getTimersByDeviceId']),
		loadData() {
			this.get(this.id).then(e => {
				if(e.success){
					this.device = e.device
					// console.log(this.device)

					if(this.device.control.sensors.length > 0){
						this.activeTab = 'threshold'
					}
					else{
						this.activeTab = 'timer'
					}
				}
			})

			this.handleLoadTimers()
			this.handleLoadThresholds()
		},
		handleLoadTimers() {
			this.getTimersByDeviceId(this.id).then(e => {
				if(e.success){
					this.timers = e.timers
					// console.log(this.timers)
				}
			})
		},
		handleLoadThresholds() {
			this.getThresholdsByDeviceId(this.id).then(e => {
				if(e.success){
					this.thresholds = e.thresholds
					// console.log(this.thresholds)
				}
			})
		},
		handleAddTimer() {
			console.log(this.newTimerForm)
			if(this.newTimerForm.relayId === '') {
				return notice.warning(this.$t('admin.device.chooseRelayHintError'))
			}
			let time = this.newTimerForm.time
			if(time === undefined || time.length !== 2){
				return notice.warning(this.$t('admin.device.chooseTimeRangeHintError'))
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
			if(this.newTimerForm.repeat === 0){// no repeat
				cron = date.format("s m H D M d")
			}
			else if(this.newTimerForm.repeat === 1){ // repeat everyday
				cron = date.format("s m H * * *")
			}
			else if(this.newTimerForm.repeat === 2){ // repeat specific day of week
				if(this.newTimerForm.days.length == 0){
					return notice.warning(this.$t('components.widget.ifttt.dayOfWeekHintError'))
				}
				cron = date.format("s m H ? * ") + this.newTimerForm.days.join(',')
			}

			let params = {
				relayId: this.newTimerForm.relayId,
				cron: cron,
				type: this.newTimerForm.type,
				onTime: startTime.valueOf(),
				offTime: endTime.valueOf(),
				status: true,
				cycle: this.newTimerForm.cycle
			}
			this.loading = true
			//console.log(params)
			this.setTimer(params).then(e => {
				this.loading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.handleLoadTimers()
					this.showPage('showHomePage')
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		},
		handleEditTimer() {
			console.log(this.editTimerForm)
			if(this.editTimerForm.relayId === '') {
				return notice.warning(this.$t('admin.device.chooseRelayHintError'))
			}
			let time = this.editTimerForm.time
			if(time === undefined || time.length !== 2){
				return notice.warning(this.$t('admin.device.chooseTimeRangeHintError'))
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
			if(this.editTimerForm.repeat === 0){// no repeat
				cron = date.format("s m H D M d")
			}
			else if(this.editTimerForm.repeat === 1){ // repeat everyday
				cron = date.format("s m H * * *")
			}
			else if(this.editTimerForm.repeat === 2){ // repeat specific day of week
				if(this.editTimerForm.days.length == 0){
					return notice.warning(this.$t('components.widget.ifttt.dayOfWeekHintError'))
				}
				cron = date.format("s m H ? * ") + this.editTimerForm.days.join(',')
			}

			let params = {
				_id: this.editTimerForm._id,
				cron: cron,
				type: this.editTimerForm.type,
				onTime: startTime.valueOf(),
				offTime: endTime.valueOf(),
				status: true,
				cycle: this.editTimerForm.cycle
			}

			this.loading = true

			//console.log(params)
			this.updateTimer(params).then(e => {
				this.loading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.handleLoadTimers()
					this.showPage('showHomePage')
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		},
		handleSwitch(e) {
			//fn.$emit('update:change', fn.state)
			//this.relay.state = this.state
			this.loading = true
			const params = {
				_id: this.relay._id,
				state: this.state
			}
			this.setState(params).then(e => {
				this.loading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
			//this.$emit('change', this.relay)
		},
		handleSwitchTimerStatus(index) {
			let timerId = this.timers[index]._id
			let status = this.timers[index].status
			let params = {
				_id: timerId,
				status: status
			}

			console.log(params)
			this.updateTimer(params).then(e => {
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.handleLoadTimers()
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		},
		deleteT(index) {
			let fn = this
			let timerId = this.timers[index]._id
			this.$confirm(this.$t('admin.device.confirmDeleteTimer'), this.$t('common.confirm'),{
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel')
			}).then(e => {
				console.log(e)
				if(e === 'confirm') {
					fn.deleteTimer(timerId).then(e=>{
						if(e.success){
							notice.success(e.message, this.$t('common.info'))
							fn.handleLoadTimers()
						}else{
							notice.error(e.message, this.$t('common.error'))
						}
					})
				}
			}).catch(()=>{})
		},
		editT(index) {
			let timer = this.timers[index]

			let points = timer.cron.split(' ')
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
				days = d.split(',')
				repeatMode = 2
			}

			this.editTimerForm = {
				relayId: timer.relayId,
				repeat: repeatMode,
				days: days,
				time: [new Date(timer.onTime), new Date(timer.offTime)],
				_id: timer._id,
				relayId: timer.relayId,
				cron: timer.cron,
				type: timer.type,
				onTime: timer.onTime,
				offTime: timer.offTime,
				status: timer.status,
				cycle: {
					onTime: timer.cycle !== undefined ? timer.cycle.onTime : 5,
					offTime: timer.cycle !== undefined ? timer.cycle.offTime : 5
				}
			}

			console.log(this.editTimerForm)
			this.showPage('editTimer')
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
			if(endTime !== undefined){
				let endDate = moment(endTime)
				return startDate.format('HH:mm:ss') + ' - ' + endDate.format('HH:mm:ss')
			}
			else{
				return startDate.format('HH:mm:ss')
			}
		},
		parsePercentage(percentage){
			return percentage.a + '%(A) - ' + percentage.b + '%(B) - ' + percentage.c + '%(C) - ' + percentage.d + '%(D)' 
		},
		showPage(page) {
			this.showHomePage = false
			this.showAddTimer = false
			this.showAddThreshold = false
			this.showEditTimer = false
			this.showEditThreshold = false
			if(page === 'showHomePage'){
				this.showHomePage = true
				this.resetForms()
			}
			else if(page === 'addTimer'){
				this.showAddTimer = true
			}
			else if(page === 'editTimer'){
				this.showEditTimer = true
			}
			else if(page === 'addThreshold'){
				this.showAddThreshold = true
			}
			else if(page === 'editThreshold'){
				this.showEditThreshold = true
			}
		},
		editThreshold(index) {
			let threshold = this.thresholds[index]

			let points = threshold.cron.split(' ')
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
				days = d.split(',')
				repeatMode = 2
			}

			console.log(threshold.onTime)

			this.editThresholdForm = {
				sensorId: threshold.sensorId,
				repeat: repeatMode,
				days: days,
				time: new Date(threshold.onTime),
				_id: threshold._id,
				cron: threshold.cron,
				onTime: threshold.onTime,
				status: threshold.status,
				unit: 'Threshold',
				threshold: {
					minValue: threshold.threshold !== undefined ? threshold.threshold.minValue : 0,
					maxValue: threshold.threshold !== undefined ? threshold.threshold.maxValue : 0
				},
				percentage: threshold.percentage
			}

			console.log(this.editThresholdForm)
			this.showPage('editThreshold')
			this.handleChangeSensor(threshold.sensorId)
		},
		deleteThres(index){
			let fn = this
			let thresholdId = this.thresholds[index]._id
			this.$confirm(this.$t('admin.device.confirmDeleteThreshold'), this.$t('common.confirm'),{
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel')
			}).then(e => {
				console.log(e)
				if(e === 'confirm'){
					fn.deleteThreshold(thresholdId).then(e=>{
						if(e.success){
							notice.success(e.message, this.$t('common.info'))
							fn.handleLoadThresholds()
						}else{
							notice.error(e.message, this.$t('common.error'))
						}
					})
				}
			}).catch(()=>{})
		},
		handleAddThreshold() {
			console.log(this.newThresholdForm)
			if(this.newThresholdForm.sensorId === '') {
				return notice.warning(this.$t('admin.script.sensorHintError'))
			}
			let time = this.newThresholdForm.time
			if(time === undefined){
				return notice.warning(this.$t('admin.script.timeHintError'))
			}
			if(this.newThresholdForm.threshold.minValue > this.newThresholdForm.threshold.maxValue){
				return notice.warning(this.$t('admin.device.minMaxValueHintError'))
			}

			let startTime = moment(time)
			//cron format second - minute - hour - day of month - month - day of week
			let date = moment()
			date.second(startTime.second())
			date.minute(startTime.minute())
			date.hour(startTime.hour())
			date.date(startTime.date())
			date.month(startTime.month())
			date.day(startTime.day())

			let cron = ''
			if(this.newThresholdForm.repeat === 0){// no repeat
				cron = date.format("s m H D M d")
			}
			else if(this.newThresholdForm.repeat === 1){ // repeat everyday
				cron = date.format("s m H * * *")
			}
			else if(this.newThresholdForm.repeat === 2){ // repeat specific day of week
				if(this.newThresholdForm.days.length == 0){
					return notice.warning(this.$t('components.widget.ifttt.dayOfWeekHintError'))
				}
				cron = date.format("s m H ? * ") + this.newThresholdForm.days.join(',')
			}

			let params = {
				sensorId: this.newThresholdForm.sensorId,
				cron: cron,
				onTime: startTime.valueOf(),
				status: true,
				threshold: this.newThresholdForm.threshold,
				percentage: this.newThresholdForm.percentage
			}
			this.loading = true

			console.log(params)
			this.setThreshold(params).then(e => {
				this.loading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.handleLoadThresholds()
					this.showPage('showHomePage')
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		},
		handleSwitchThresholdStatus(index) {
			let thresholId = this.thresholds[index]._id
			let status = this.thresholds[index].status
			let params = {
				_id: thresholId,
				status: status
			}

			console.log(params)
			this.updateThreshold(params).then(e => {
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.handleLoadThresholds()
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		},
		handleEditThreshold() {
			console.log(this.editThresholdForm)
			if(this.editThresholdForm.sensorId === '') {
				return notice.warning(this.$t('admin.script.sensorHintError'))
			}
			//this.editThresholdForm.sensorId = this.editThresholdForm.sensor._id
			let time = this.editThresholdForm.time
			if(time === undefined){
				return notice.warning(this.$t('admin.script.timeHintError'))
			}
			if(this.editThresholdForm.threshold.minValue > this.editThresholdForm.threshold.maxValue){
				return notice.warning(this.$t('admin.device.minMaxValueHintError'))
			}
			let startTime = moment(time)
			//cron format second - minute - hour - day of month - month - day of week
			let date = moment()
			date.second(startTime.second())
			date.minute(startTime.minute())
			date.hour(startTime.hour())
			date.date(startTime.date())
			date.month(startTime.month())
			date.day(startTime.day())

			let cron = ''
			if(this.editThresholdForm.repeat === 0){// no repeat
				cron = date.format("s m H D M d")
			}
			else if(this.editThresholdForm.repeat === 1){ // repeat everyday
				cron = date.format("s m H * * *")
			}
			else if(this.editThresholdForm.repeat === 2){ // repeat specific day of week
				if(this.editThresholdForm.days.length == 0){
					return notice.warning(this.$t('components.widget.ifttt.dayOfWeekHintError'))
				}
				cron = date.format("s m H ? * ") + this.editThresholdForm.days.join(',')
			}

			let params = {
				_id: this.editThresholdForm._id,
				cron: cron,
				onTime: startTime.valueOf(),
				status: true,
				threshold: this.editThresholdForm.threshold,
				percentage: this.editThresholdForm.percentage
			}
			this.loading = true
			console.log(params)
			this.updateThreshold(params).then(e => {
				this.loading = false
				if(e.success){
					notice.success(e.message, this.$t('admin.info'))
					this.handleLoadThresholds()
					this.showPage('showHomePage')
				}else{
					notice.error(e.message, this.$t('admin.error'))
				}
			})
		},
		handleChangeSensor(value) {
			this.newThresholdForm.unit = ''
			this.editThresholdForm.unit = ''
			this.newThresholdForm.percentage = undefined
			const sensors = this.device.control.sensors
			for(let i = 0; i < sensors.length; i++){
				const sensor = sensors[i]
				if(sensor._id === value){
					// console.log(sensor)
					this.newThresholdForm.unit = this.$t('common.threshold') + ' (' + sensor.unit + ')'
					this.editThresholdForm.unit = this.$t('common.threshold') + ' (' + sensor.unit + ')'

					// EC water sensor
					if(sensor.type === 9){
						this.newThresholdForm.percentage = {
							a: 50,
							b: 50,
							c: 0,
							d: 0,
							dosing_time: 60,
							dosing_interval: 60
						}	
					}
					break
				}
			}
		},
		resetForms() {
			this.newTimerForm = {
				relayId: '',
				repeat: 0,
				days: [],
				time: [new Date(), new Date()],
				cron: '* * * * * *',
				type: 0,
				onTime: 0,
				offTime: 0,
				status: true,
				cycle: {
					onTime: 0,
					offTime: 0
				}
			};

			this.editTimerForm = {
				relayId: '',
				repeat: 0,
				days: [],
				time: [new Date(), new Date()],
				_id: '',
				cron: '* * * * * *',
				type: 0,
				onTime: 0,
				offTime: 0,
				status: true,
				cycle: {
					onTime: 0,
					offTime: 0
				}
			};

			this.newThresholdForm = {
				sensorId: '',
				repeat: 0,
				days: [],
				time: new Date(),
				cron: '* * * * * *',
				onTime: 0,
				status: true,
				unit: this.$t('common.threshold'),
				threshold: {
					minValue: 0,
					maxValue: 0
				}
			};

			this.editThresholdForm = {
				_id: '',
				sensorId: '',
				repeat: 0,
				days: [],
				time: new Date(),
				cron: '* * * * * *',
				onTime: 0,
				status: true,
				unit: this.$t('common.threshold'),
				threshold: {
					minValue: 0,
					maxValue: 0
				}
			};
		},
		getSensorName(sensorId) {
			let sensorName = ''
			const sensors = this.device.control.sensors
			for(let i = 0; i < sensors.length; i++){
				const sensor = sensors[i]
				if(sensorId === sensor._id){
					sensorName = sensor.name
					break
				}
			}
			return sensorName
		},
		getRelayName(relayId) {
			let relayName = ''
			const relays = this.device.control.relays
			for(let i = 0; i < relays.length; i++){
				const relay = relays[i]
				if(relayId === relay._id){
					relayName = relay.name
					break
				}
			}
			return relayName
		},
		parseThreshold(sensorId, threshold) {
			let sensorUnit = ''
			const sensors = this.device.control.sensors
			for(let i = 0; i < sensors.length; i++){
				const sensor = sensors[i]
				if(sensorId === sensor._id) {
					sensorUnit = sensor.unit
					break
				}
			}
			return threshold.minValue + ' - ' + threshold.maxValue + '(' + sensorUnit + ')'
		},
		showPercentage(sensorId){
			let isShow = false
			const sensors = this.device.control.sensors
			for(let i = 0; i < sensors.length; i++){
				const sensor = sensors[i]
				if(sensorId === sensor._id && sensor.type === 9){
					isShow = true
					break
				}
			}
			return isShow
		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			loading: false,
			activeTab: 'threshold',
			showHomePage: true,
			showAddTimer: false,
			showEditTimer: false,
			showAddThreshold: false,
			showEditThreshold: false,
			device: undefined,
			thresholds: [],
			timers: [],
			timerTypes: [
				{
					name: this.$t('common.cycleTimer'),
					value: 0
				},
				{
					name: this.$t('common.scheduleTimer'),
					value: 1
				}
			],
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
			newTimerForm: {
				relayId: '',
				repeat: 0,
				days: [],
				time: [new Date(), new Date()],
				cron: '* * * * * *',
				type: 0,
				onTime: 0,
				offTime: 0,
				status: true,
				cycle: {
					onTime: 0,
					offTime: 0
				}
			},

			editTimerForm: {
				relayId: '',
				repeat: 0,
				days: [],
				time: [new Date(), new Date()],
				_id: '',
				cron: '* * * * * *',
				type: 0,
				onTime: 0,
				offTime: 0,
				status: true,
				cycle: {
					onTime: 0,
					offTime: 0
				}
			},

			newThresholdForm: {
				sensorId: '',
				sensor: undefined,
				repeat: 0,
				days: [],
				time: new Date(),
				cron: '* * * * * *',
				onTime: 0,
				status: true,
				unit: this.$t('common.threshold'),
				threshold: {
					minValue: 0,
					maxValue: 0
				}
			},

			editThresholdForm: {
				_id: '',
				sensorId: '',
				sensor: undefined,
				repeat: 0,
				days: [],
				time: new Date(),
				cron: '* * * * * *',
				onTime: 0,
				status: true,
				unit: this.$t('common.threshold'),
				threshold: {
					minValue: 0,
					maxValue: 0
				}
			},
		}
	}
})
export default class DeviceAdd extends Vue{
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
		const params = {
			_id: this.device._id,
			uid: this.device.uid,
			name: this.device.name,
			model: this.device.model,
			stream: this.device.stream,
			status: this.device.status,
			relays: this.device.control.relays,
			sensors: this.device.control.sensors
		}
		this.update(params).then(e=>{
			this.isLoading = false
			if(e.success){
				notice.success(e.message, this.$t('common.info')).then(()=>{
					//this.$router.push({name:'DeviceManage'})
				})
			}else{
				notice.error(e.message, this.$t('common.error'))
			}
		})
	}
}
</script>

<style lang="stylus">
.device-setting-component
	.dialog-footer
		text-align center
</style>
