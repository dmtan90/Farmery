<template lang="pug">
el-dialog(title="Operation instruction" :visible="isShowOperatingForm"  width="28%" top="10vh" custom-class="bulb-dialog"
lock-scroll center append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false")
	el-form(:span="24" type="flex" align="middle" justify="center" :model="operating" label-width="100px"  center status-ico)
		el-form-item(label="Status")
			bulb-check-box(:status.sync="operating.status")
		el-form-item(label="Brightness")
			el-slider(v-model="operating.brightness")
		el-form-item(label="Color")
			bulb-color-select(:color.sync="operating.color")
		el-form-item(label="IDs")
			bulb-selection(:select-bulbs.sync="operating.ids" :bulbs="bulbs")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="primary" @click="submitForm") Save instruction
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import BulbCheckBox from '~/bulb/CheckBox'
import BulbSelection from '~/bulb/Selection'
import BulbColorSelect from '~/bulb/ColorSelect'
import { mapState,mapMutations } from 'vuex'
import notice from '@/utils/ui/notice'
@Component({
	props:{
		isShowOperatingForm:{
			type:Boolean,
			required:false,
			default:false
		},
		operating:{
			type:Object,
			required:true
		}
	},
	components: {
		BulbCheckBox,
		BulbSelection,
		BulbColorSelect
	},
	computed:{
		...mapState('electrics',['bulbs'])
	},
	methods:{
		...mapMutations('ui',['finishScriptForm'])
	}
})
export default class OperatingForm extends Vue{
	verify(){
		if(!this.operating.ids.length){
			return false
		}
		return true
	}
	submitForm(){
		if(!this.verify()){
			return notice.warning('Please select an appliance')
		}
		if(!this.operating.ids.includes('0')){
			this.operating.ids.forEach(id=>{
				const { name } = this.bulbs.find(bulb=>bulb.id === id)
				this.operating.name.push(name)
			})
		}else{
			this.bulbs.forEach(bulb=>{
				this.operating.name.push(bulb.name)
			})
		}

		this.finishScriptForm({isFinish:true,id:1})
		this.$emit('update:operating',this.operating)
		this.$emit('update:isShowOperatingForm', false)
	}
}
</script>

<style lang="stylus">

</style>
