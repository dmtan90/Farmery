<template lang="pug">
.device-model-select
	el-select(v-model="devType" placeholder="Please choose device model" @change="$emit('update:devType', devType)")
		el-option(v-for="model in models" :key="model.uid" :label="model.name" :value="model.uid")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState, mapActions } from 'vuex'

@Component({
	props:{
		devType: Number
	},
	watch: {
		devType: function(value, oldValue){
			this.devType = value
		}
	},
	methods:{
		...mapActions({
			'getModels': 'devicemodel/gets',
		}),
		loadData(){
			this.getModels().then(e => {
				if(e.success){
					this.models = e.models
				}
			})
		}
	},
	mounted(){
		this.loadData()
	},
	data() {
		return {
			models: []
		}
	}
})
export default class DeviceModelSelect extends Vue{
	
}
</script>
