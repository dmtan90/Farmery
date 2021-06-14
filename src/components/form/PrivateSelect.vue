<template lang="pug">
el-tooltip(content="After selecting certain items, the information will not be disclosed to the public, in order to avoid information leakage when invited into the family" placement="bottom"  :disabled="disabled")
	el-select.private-select(v-model="selections" multiple placeholder="Please choose" @change="selected")
		el-option(v-for="item in options" :key="item.value" :label="item.label" :value="item.value")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'

@Component
export default class PrivateSelect extends Vue{
	selections = ''
	disabled = false
	options = [{
		value:'avatar',
		label:'Avatar'
	},{
		value: 'address',
		label: 'Address'
	},{
		value:'public',
		label: 'Public all'
	}]
	selected(){
		this.disabled = true
		if(this.selections.includes('public')){
			this.selections = ['public']
		}
		this.$emit('update:private',this.selections)
	}
}
</script>

<style lang="stylus">
.private-select
	width 100%
</style>
