<template lang="pug">
.relay-card-component(v-loading="loading")
	i.el-icon-switch-button.card-icon
	.card-title(:span="24" type="flex" align="middle" justify="center")
		el-tooltip(v-if="name.length > 10" :content="name" placement="top")
			span()
				| {{ name }}
		span(v-else)
			| {{ name }}
	<!-- el-button.card-setting(icon="el-icon-setting" circle size="mini" @click="bindTimerDialogVisible = true") -->
	el-row.card-value
		el-col(:span="24")
			el-switch(v-model="state" @change="handleSwitch" :disabled="readOnly")
	el-row.card-time
		el-col(:span="24")
			span
				|{{ lastUpdate }}
	el-dialog(:title="name" :visible.sync="bindTimerDialogVisible" width="40%" @open="handleLoadTimers")
		div.timer-list-container(v-if="showTimers")
			el-button(type="success" icon="el-icon-circle-plus-outline" @click="showPage('addTimer')" round style="width:150px" size="small")
				| {{ $t('components.widget.relay.addTimer') }}
			el-table(:data="timers" stripe height="300" size="small")
				el-table-column(prop="type" :label="$t('common.type')" width="100")
					template(slot-scope="scope")
						el-tag(size="mini")
							|{{ scope.row.type == 0 ? $t('common.cycle') : $t('common.schedule') }}
				el-table-column(prop="cron" :label="$t('common.repeated')" width="150")
					template(slot-scope="scope")
						| {{ parseRepeated(scope.row.cron) }}
				el-table-column(prop="onTime" :label="$t('common.period')" width="200")
					template(slot-scope="scope")
						| {{ parseTime(scope.row.onTime, scope.row.offTime) }}
				el-table-column(prop="cycle" :label="$t('common.continuous')" width="200")
					template(slot-scope="scope" v-if="scope.row.cycle !== undefined")
						| {{ scope.row.cycle.onTime }} ({{ $t('common.minutes') }}) / {{ scope.row.cycle.offTime }} ({{ $t('common.minutes') }})
				el-table-column(prop="status" :label="$t('common.status')" width="100")
					template(slot-scope="scope")
						el-switch(v-model="scope.row.status" @change="handleSwitchTimerStatus(scope.$index)")
				el-table-column(:label="$t('common.options')" width="250")
					template(slot-scope="scope")
						el-tooltip(:content="$t('common.edit')" placement="top")
							el-button(@click="editT(scope.$index)" type="text" size="small" round)
								i.el-icon-edit-outline
						el-tooltip(:content="$t('common.delete')" placement="top")
							el-button(@click="deleteT(scope.$index)" type="text" size="small" round)
								i.el-icon-delete
			el-row(:span="24")
				el-col(:span="24" style="text-align: right")
					el-button(@click="bindTimerDialogVisible = false") {{ $t('common.cancel') }}
		div.timer-add-container(v-if="showAddForm")
			el-page-header(@back="showPage('timers')" :content="$t('components.widget.relay.addTimer')")
			el-form(v-model="newTimerForm" label-width="130px" style="margin-top: 20px")
				el-form-item(:label="$t('common.timerMode')")
					el-select(v-model="newTimerForm.type" :placeholder="$t('common.selectType')" size="small")
						el-option(v-for="item in timerTypes" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.repeated')")
					el-select(v-model="newTimerForm.repeat" :placeholder="$t('common.selectType')" size="small")
						el-option(v-for="item in repeatTypes" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.dayOfWeek')" v-if="newTimerForm.repeat === 2")
					el-select(v-model="newTimerForm.days" :placeholder="$t('common.selectType')" size="small" multiple)
						el-option(v-for="item in dayOfWeek" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.workingTime')")
					el-time-picker(is-range v-model="newTimerForm.time" range-separator="-" :start-placeholder="$t('common.onTime')" :end-placeholder="$t('common.offTime')" size="small" width="250px")
				el-form-item(:label="$t('common.onOffMinutes')" v-if="newTimerForm.type === 0")
					el-input-number(size="mini" v-model="newTimerForm.cycle.onTime" :min="0" :max="100" :placeholder="$t('common.onDuration')")
					el-input-number(size="mini" v-model="newTimerForm.cycle.offTime" :min="0" :max="100" :placeholder="$t('common.offDuration')")
			el-row(:span="24")
				el-col(:span="24" style="text-align: right")
					el-button(type="primary" @click="handleAddTimer" :disabled="loading" :loading="loading") {{ $t('common.confirm') }}
		div.timer-edit-container(v-if="showEditForm")
			el-page-header(@back="showPage('timers')" :content="$t('components.widget.relay.editTimer')")
			el-form(v-model="editTimerForm" label-width="130px" style="margin-top: 20px")
				el-form-item(:label="$t('common.timerMode')")
					el-select(v-model="editTimerForm.type" :placeholder="$t('common.selectType')" size="small")
						el-option(v-for="item in timerTypes" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.repeated')")
					el-select(v-model="editTimerForm.repeat" :placeholder="$t('common.selectType')" size="small")
						el-option(v-for="item in repeatTypes" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.dayOfWeek')" v-if="editTimerForm.repeat === 2")
					el-select(v-model="editTimerForm.days" :placeholder="$t('common.selectType')" size="small" multiple)
						el-option(v-for="item in dayOfWeek" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.workingTime')")
					el-time-picker(is-range v-model="editTimerForm.time" range-separator="-" :start-placeholder="$t('common.onTime')" :end-placeholder="$t('common.offTime')" size="small" width="250px")
				el-form-item(:label="$t('common.onOffMinutes')" v-if="editTimerForm.type === 0")
					el-input-number(size="mini" v-model="editTimerForm.cycle.onTime" :min="0" :max="100" :placeholder="$t('common.onDuration')")
					el-input-number(size="mini" v-model="editTimerForm.cycle.offTime" :min="0" :max="100" :placeholder="$t('common.offDuration')")
			el-row(:span="24")
				el-col(:span="24" style="text-align: right")
					el-button(type="primary" @click="handleEditTimer" :disabled="loading" :loading="loading") {{ $t('common.confirm') }}			
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapState,mapActions } from 'vuex'
import notice from '@/utils/ui/notice'
import moment from 'moment'
import { formatTime } from '@/utils/global'

@Component({
	components:{

	},
	computed:{
		//...mapState('org',['count'])
	},
	props:{
		relay: Object,
		allowAction: Boolean
	},
	watch:{
		relay: function(value, oldValue){
			//console.log(value)
			//console.log(oldValue)
			if(value){
				this.relay = value
				this.name = this.relay.name
				this.state = this.relay.state
				this.lastUpdate = formatTime(this.relay.meta.updatedAt)
			}
		},
		allowAction: function(value, oldValue){
			if(value === true){
				this.readOnly = false
			}
			else{
				this.readOnly = true
			}
		}
	},
	methods:{
		...mapActions('relay',['setState','getTimers','setTimer','updateTimer','deleteTimer']),
		handleLoadTimers() {
			this.getTimers(this.relay._id).then(e => {
				if(e.success){
					this.timers = e.timers
				}
			})
		},
		handleAddTimer() {
			//console.log(this.newTimerForm)
			let time = this.newTimerForm.time
			if(time === undefined || time.length !== 2){
				return notice.warning(this.$t('components.widget.relay.chooseTimeHint'))
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
					return notice.warning(this.$t('components.widget.relay.chooseDayOfWeek'))
				}
				cron = date.format("s m H ? * ") + this.newTimerForm.days.join(',')
			}

			let params = {
				relayId: this.relay._id,
				cron: cron,
				type: this.newTimerForm.type,
				onTime: startTime.valueOf(),
				offTime: endTime.valueOf(),
				status: true,
				cycle: this.newTimerForm.cycle
			}

			//console.log(params)
			this.setTimer(params).then(e => {
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.handleLoadTimers()
					this.showPage('timers')
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
			//this.setTimer().then()
		},
		handleEditTimer() {
			//console.log(this.editTimerForm)
			let time = this.editTimerForm.time
			if(time === undefined || time.length !== 2){
				return notice.warning(this.$t('components.widget.relay.chooseTimeHint'))
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
					return notice.warning(this.$t('components.widget.relay.chooseDayOfWeek'))
				}
				cron = date.format("s m H ? * ") + this.editTimerForm.days.join(',')
			}

			let params = {
				_id: this.editTimerForm._id,
				relayId: this.relay._id,
				cron: cron,
				type: this.editTimerForm.type,
				onTime: startTime.valueOf(),
				offTime: endTime.valueOf(),
				status: true,
				cycle: this.editTimerForm.cycle
			}

			//console.log(params)
			this.updateTimer(params).then(e => {
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.handleLoadTimers()
					this.showPage('timers')
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
		addTimer() {
			this.showTimers = false
			this.showAddForm = true,
			this.showEditForm = false
		},
		handleSwitchTimerStatus(index) {
			let timerId = this.timers[index]._id
			let status = this.timers[index].status
			let params = {
				_id: timerId,
				status: status
			}

			//console.log(params)
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
			this.$confirm(this.$t('components.widget.relay.confirmDeleteTimerHint'), this.$t('common.confirm'),{
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel')
			}).then(e => {
				//console.log(e)
				fn.deleteTimer(timerId).then(e=>{
					if(e.success){
						notice.success(e.message, this.$t('common.info'))
						fn.handleLoadTimers()
					}else{
						notice.error(e.message, this.$t('common.error'))
					}
				})
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

			//console.log(this.editTimerForm)
			this.showPage('editTimer')
		},
		showPage(page) {
			if(page === 'timers'){
				this.showTimers = true
				this.showAddForm = false,
				this.showEditForm = false
			}
			else if(page === 'addTimer'){
				this.showTimers = false
				this.showAddForm = true,
				this.showEditForm = false
			}
			else if(page === 'editTimer'){
				this.showTimers = false
				this.showAddForm = false,
				this.showEditForm = true
			}
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
		//this.loadData()
		//console.log(this.relay)
		if(this.relay){
			this.name = this.relay.name
			this.state = this.relay.state
		}
		if(this.allowAction !== undefined){
			if(this.allowAction === true){
				this.readOnly = false
			}
			else{
				this.readOnly = true	
			}
		}
	},
	data() {
		return {
			name: '',
			state: false,
			type: 0,
			loading: false,
			bindTimerDialogVisible: false,
			timers: [],
			showTimers: true,
			showAddForm: false,
			showEditForm: false,
			readOnly: false,
			lastUpdate: '',
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
				repeat: 0,
				days: [],
				time: [new Date(), new Date()],
				relayId: '',
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
				repeat: 0,
				days: [],
				time: [new Date(), new Date()],
				_id: '',
				relayId: '',
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
		}
	}
})
export default class RelayCard extends Vue{
}
</script>

<style lang="stylus">
.relay-card-component
	box-shadow 2px 3px 10px #ccc
	border-radius 10px
	width 100%
	height 120px
	padding 10px
	background-color #FFFFFF
	position relative
	.card-title
		text-transform uppercase
		font-size 13px
		margin-bottom 20px
		margin-left	30px
		margin-top 5px
		color #909399
		overflow hidden
		white-space nowrap
	.card-icon
		font-size 24px
		position absolute
		color #409EFF
		left 10px
		top 10px
	.card-setting
		position absolute
		right 10px
		top 10px
	.card-value
		font-size 32px
		text-align center
		color #606266
		font-weight 500
	.card-time
		font-size 10px
		position absolute
		left 10px
		bottom 10px
	.el-dialog
		width 40%
		max-width 500px

</style>
