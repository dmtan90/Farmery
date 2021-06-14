<template lang="pug">
el-dialog(title="Duration" :visible="isShowDurationForm" width="35%" top="10vh" custom-class="bulb-dialog"
lock-scroll center append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false")
	el-form(:model="duration" label-width="100px"  center status-ico)
		el-form-item(label="Begin execution")
			el-cascader(:disabled="duration.specificDuration!==null" v-model="duration.startDuration" placeholder="Please select the time to execute the instruction" :options="times" clearable)
		el-form-item(label="End execution")
			el-tooltip(content="If this option is not selected, there is no end time by default")
				el-cascader(:disabled="duration.startDuration.length<2 || duration.specificDuration!==null" v-model="duration.endDuration" placeholder="Please select the time to end the order" :options="weaks" clearable)
		el-form-item(label="Specified execution")
			el-tooltip(content="If this option is set, the above two items are invalid by default")
				el-date-picker(v-model="duration.specificDuration" :picker-options="pickerOptions"
				type="daterange" start-placeholder="Start date" end-placeholder="End date")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="primary" @click="submitForm") Save
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapMutations } from 'vuex'
import notice from '@/utils/ui/notice'
import task from '@/utils/task'
@Component({
	props:{
		isShowDurationForm:{
			type:Boolean,
			required:false,
			default:false
		},
		duration:{
			type:Object,
			required:true
		}
	},
	methods:{
		...mapMutations('ui',['finishScriptForm'])
	}
})
export default class DurationForm extends Vue{
	firstSave = false
	pickerOptions = {
		disabledDate(time) {
			return time.getTime() < Date.now()
		}
	}
	weaks = [{
			value:'Every Monday',label:'Every Monday'
		},{
			value:'Every Tuesday',label:'Every Tuesday'
		},{
			value:'Every Wednesday',label:'Every Wednesday'
		},{
			value:'Every Thursday',label:'Every Thursday'
		},{
			value:'Every Friday',label:'Every Friday'
		},{
			value:'Every Saturday',label:'Every Saturday'
		},{
			value:'Every Sunday',label:'Every Sunday'
	}]
	times = [
		{value:'Every Day',label:'Every Day'},
		{value:'Weekly',label:'Weekly',
			children:[{
					value:'Every Monday',label:'Every Monday'
				},{
					value:'Every Tuesday',label:'Every Tuesday'
				},{
					value:'Every Wednesday',label:'Every Wednesday'
				},{
					value:'Every Thursday',label:'Every Thursday'
				},{
					value:'Every Friday',label:'Every Friday'
				},{
					value:'Every Saturday',label:'Every Saturday'
				},{
					value:'Every Sunday',label:'Every Sunday'
			}]
		}
	]
	verify(){
		if(!this.duration.startDuration && !this.duration.specificDuration){
			return false
		}
		return true
	}
	submitForm(){
		if(!this.verify()){
			return notice.warning('Please choose a time')
		}
		if(this.duration.startDuration && this.duration.startDuration.length === 2){
			if(this.duration.endDuration && this.duration.endDuration.length){
				const start = this.duration.startDuration[1]
				const end = this.duration.endDuration[0]
				if(task.filterWeek(start) >= task.filterWeek(end)){
					return notice.warning('Choose the week from big to small')
				}
			}
		}

		console.log(this.duration.specificDuration)

		this.finishScriptForm({isFinish:true,id:3})
		this.$emit('update:isShowDurationForm', false)
		this.$emit('update:duration',this.duration)
		!this.firstSave && notice.success('Saved successfully!','success') && (this.firstSave = true)
	}
}
</script>

<style lang="stylus">

</style>
