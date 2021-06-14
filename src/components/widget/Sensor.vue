<template lang="pug">
.sensor-card-component(:class="color" @click="handleSelectSensor")
	i.el-icon-odometer.card-icon
	.card-title(:span="24" type="flex" align="middle" justify="center")
		el-tooltip(v-if="name.length > 10" :content="name" placement="top")
			span()
				| {{ name }}
		span(v-else)
			| {{ name }}
	el-row.card-value
		el-col(:span="24")
			|{{ value }}
			sup.card-unit
				|{{ unit }}
	el-row.card-time
		el-col(:span="24")
			span
				i.el-icon-refresh
				| {{ lastUpdate }}
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapState, mapActions } from 'vuex'
import { formatTime } from '@/utils/global'

@Component({
	components:{

	},
	computed:{
		...mapState('ui',['units'])
	},
	props:{
		sensor: Object,
		index: Number
	},
	watch:{
		sensor: function(value, oldValue){
			if(value && value.name && value.value && value.unit){
				this.sensor = value
				this.name = this.sensor.name
				this.value = this.sensor.value
				this.unit = this.sensor.unit
				this.lastUpdate = formatTime(this.sensor.meta.updatedAt)
				this.unitConverter()
			}
		},
		index: function(value, oldValue){
			if(value < 0){
				value = 0
			}
			else if(value > this.colors.length){
				value = value % this.colors.length
			}
			this.color = this.colors[value]
		}
	},
	methods:{
		handleSelectSensor(){
			this.$emit('click', this.sensor._id)
		},
		unitConverter(){
			if(this.unit === '*C' && this.units.temp === false){
				this.value = parseInt(this.value + 32)
				this.unit = '*F'
			}
			else if(this.unit === 'mS/cm' && this.units.ec === false){
				this.value = parseInt(this.value * 500)
				this.unit = 'ppm'
			}
		}
	},
	mounted() {
		// console.log(this.sensor)
		// console.log(this.index)
		if(this.sensor !== undefined){
			this.name = this.sensor.name
			this.value = this.sensor.value
			this.unit = this.sensor.unit
			this.lastUpdate = formatTime(this.sensor.meta.updatedAt)
			this.unitConverter()
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
			name: '',
			value: 0,
			unit: '',
			type: 0,
			color: '',
			lastUpdate: 'N/A',
			colors: ['','card-blue','card-green','card-red','card-orange','card-grey','card-purple','card-pink','card-cyan','card-teal']
		}
	}
})
export default class SensorCard extends Vue{
}
</script>

<style lang="stylus">
.sensor-card-component
	box-shadow 2px 3px 10px #ccc
	border-radius 10px
	width 100%
	height 120px
	padding 10px
	background-color #FFFFFF
	color #909399
	position relative
	.card-title
		text-transform uppercase
		font-size 13px
		margin-bottom 20px
		margin-left	30px
		margin-top 5px
		overflow hidden
		white-space nowrap
	.card-icon
		font-size 24px
		position absolute
		left 10px
		top 10px
	.card-value
		font-size 24px
		text-align center
		font-weight 500
	.card-unit
		font-size 12px
		margin-left 5px
	.card-time
		font-size 10px
		position absolute
		left 10px
		bottom 10px

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
