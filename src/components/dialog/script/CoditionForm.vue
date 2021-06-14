<template lang="pug">
el-dialog(title="Triggering conditions" :visible="isShowCoditionForm"  width="28%" top="10vh" custom-class="bulb-dialog"
lock-scroll center append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false")
	el-form(:span="24" type="flex" align="middle" justify="center" :model="codition" label-width="100px"  center status-ico)
		el-form-item(label="Trigger time")
			el-time-picker.time-picker(v-model="codition.startExec" placeholder="Please select the time to trigger the instruction")
		el-form-item(label="Weather conditions")
			codition-weather(:weather.sync="codition.weather")
		el-form-item(label="Conditional relationship")
			el-tooltip(content="If it is turned on, all the above conditions will be met before the instruction will be executed; otherwise, as long as one of them is met" :disabled="disableCount===3")
				el-switch(v-model="codition.relation" @change="disableCount++" active-color="#ff4949" inactive-color="#13ce66" active-text="All established" inactive-text="Meet alone")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="primary" @click="submitForm") Save
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import CoditionWeather from '~/scripts/CoditionWeather'
import notice from '@/utils/ui/notice'
import { mapMutations } from 'vuex'

@Component({
  components:{
    CoditionWeather
  },
	props:{
		isShowCoditionForm:{
			type:Boolean,
			required:false,
			default:false
		},
		codition:{
			type:Object,
			required:true
		}
	},
	methods:{
		...mapMutations('ui',['finishScriptForm'])
	}
})
export default class CoditionForm extends Vue{
	disableCount = 0
	verify(){
		if(!this.codition.startExec && !this.codition.weather.length){
			return false
		}
		return true
	}
	submitForm(){
		if(!this.verify()){
			return notice.warning('Please select a condition')
		}
		if(this.codition.weather && this.codition.weather.length > 0){
			if(this.codition.weather.includes('Sunny day') && this.codition.weather.includes('Cloudy day')){
				return notice.warning('You cannot choose sunny and cloudy at the same time')
			}
		}
		this.finishScriptForm({isFinish:true,id:2})

		this.$emit('update:codition',this.codition)
		this.$emit('update:isShowCoditionForm', false)

	}
}
</script>

<style lang="stylus">
.time-picker
	width 99% !important
</style>
