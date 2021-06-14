<template lang="pug">
.sensor-chart-card-component()
	i.el-icon-odometer.card-icon
	.card-title(:span="24" type="flex" align="middle" justify="center")
		| {{ $t('components.widget.sensorChart.sensorStatistics') }}
	el-row(:gutter="20")
		<!-- el-col(:span="6")
			el-select(v-model="query.sensorIds" multiple placeholder="$t('components.widget.sensorChart.sensorHint')" size="small" @change="handleChangeSensor" style="width: 100%")
				el-option(v-for="item in sensors" :key="item._id" :label="item.name" :value="item._id") -->
		el-col(:xs="24" :sm="12" :md="4" style="margin-bottom:10px")
			el-select(v-model="query.granId" :placeholder="$t('components.widget.sensorChart.granularityHint')" size="small" @change="handleChangeGranularity" style="width: 100%")
				el-option(v-for="item in granularities" :key="item.value" :label="item.name" :value="item.value")
		el-col(:xs="24" :sm="12" :md="4" style="margin-bottom:10px")
			el-date-picker(v-model="query.time" type="daterange" range-separator="-" :start-placeholder="$t('common.startDate')" :end-placeholder="$t('common.endDate')" size="small" :picker-options="pickerOptions" style="width:100%")
		el-col(:xs="12" :sm="12" :md="3" style="margin-bottom:10px")
			el-button(type="primary" icon="el-icon-search" @click="handleLoadSensorSeries()" round style="width:100%" size="small")
				| {{ $t('common.filter') }}
		el-col(:xs="12" :sm="12" :md="3" style="margin-bottom:10px")
			el-button(type="primary" icon="el-icon-printer" :loading="exportLoading" @click="handleExportSensorSeries" round style="width:100%" size="small")
				| {{ $t('common.export') }}
	el-row(:gutter="20" style="margin-top: 20px" v-loading="loading")
		el-col(:xs="24" :sm="24" :md="12" v-for="(sensor,index) in charts" :key="index" :value="sensor._id")
			ve-line(:ref="sensor._id"
				:data="chartLineDatas[sensor._id]"
				:title="getChartTitle(sensor)"
				:toolbox="chartToolbox"
				:settings="chartSettings"
				:data-zoom="dataZoom"
				:tooltip="chartTooltip"
				:mark-line="markLine"
				:y-axis="genYAxis(sensor)"
				autoresize)
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { mapState, mapActions } from 'vuex'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import notice from '@/utils/ui/notice'
import Moment from 'moment-timezone'
import { downloadFileWithBlob } from '@/utils/global'

@Component({
	components:{

	},
	computed:{
		...mapState('ui',['units'])
	},
	props:{
		sensors: Array,
		sensorIds: Array,
		granularity: String
	},
	watch:{
		sensors: function(value, oldValue){
			if(value){
				// this.sensors = value
				let currentSensorIds = []
				let loadNewData = false
				this.sensors.forEach(sensor => {
					if(this.lastSensorIds.indexOf(sensor._id) < 0){
						loadNewData = true
					}
					currentSensorIds.push(sensor._id)
				})

				currentSensorIds = currentSensorIds.join(';')

				if(currentSensorIds != this.lastSensorIds){
					this.loadData()
					this.charts = this.sensors
				}

				this.lastSensorIds = currentSensorIds
				// console.log(this.lastSensorIds)
				if(this.charts === []){
					this.charts = this.sensors
				}
			}
		},
		sensorIds: function(value, oldValue){
			if(value){
				this.query.sensorIds = value
			}
		},
		granularity: function(value, oldValue){
			if(value){
				this.query.granId = value
			}
		}
	},
	methods:{
		...mapActions('sensor',['getSeries','exportSeries']),
		loadData(){
			// this.chartLineDatas = {}
			this.handleLoadSensorSeries()
		},
		handleChangeSensor() {
			console.log(this.query.sensorIds)
		},
		handleChangeGranularity() {
			console.log(this.query.granId)
		},
		round(value, decimals) {
			return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		},
		unitConverter(value, unit){
			let newValue = value
			let newUnit = unit
			if(unit === '*C' && this.units.temp === false){
				newValue = parseInt(value + 32)
				unit = '*F'
			}
			else if(unit === 'mS/cm' && this.units.ec === false){
				newValue = parseInt(value * 500)
				newUnit = 'ppm'
			}
			return {
				value: newValue,
				unit: newUnit
			}
		},
		handleLoadSensorSeries(sensorId) {
			let fn = this
			// console.log(this.query)
			if(!this.query.time || this.query.time.length != 2){
				return notice.error(this.$t('components.widget.sensorChart.chooseTimeHint'), this.$t('common.error'))
			}
			if(!this.query.granId){
				return notice.error(this.$t('components.widget.sensorChart.chooseGranularityHint'), this.$t('common.error'))
			}
			let startDate = Moment(this.query.time[0])
			let endDate = Moment(this.query.time[1])

			startDate.hour(0)
			startDate.minute(0)
			startDate.second(0)
			startDate.millisecond(0)

			endDate.hour(23)
			endDate.minute(59)
			endDate.second(59)
			endDate.millisecond(0)

			if(sensorId !== undefined){
				// only load specific chart
				let params = {
					_id: sensorId,
					granularity: this.query.granId,
					startTime: startDate.valueOf(),
					endTime: endDate.valueOf()
				}
				this.getSeries(params).then(e => {
					// this.loading = false
					if(e.success){
						// console.log(sensorId)
						const datas = e.data.data
						let chartLineDatas = fn.chartLineDatas[sensorId].rows
						// fn.chartLineDatas[sensorId] = fn.genChartData()
						// fn.chartSettings[sensorId] = fn.genChartSettings()
						// fn.chartLineDatas[sensorId].rows = []
						datas.forEach(row => {
							let date = Moment(row.meta.updatedAt)
							let point = {}
							if(params.granularity === 'utm'){
								point = {
									date: date.format('YYYY-MM-DD HH:mm:ss'),
									value: row.value
								}
							}
							else{
								if(row.aggregation.min !== -1000){
									point = {
										date: date.format('YYYY-MM-DD HH:mm'),
										min: Number(row.aggregation.min.toFixed(2)),
										max: Number(row.aggregation.max.toFixed(2)),
										avg: Number(row.aggregation.avg.toFixed(2))
									}
								}
							}
							let needPush = true
							for(let i = 0; i < chartLineDatas.length; i++){
								let item = chartLineDatas[i]
								if(item.date === point.date){
									needPush = false
									break
								}
							}
							if(needPush){
								chartLineDatas.push(point)
							}
						})
						fn.chartSettings = fn.genChartSettings()
						// console.log(fn.chartLineDatas[sensorId].rows)
						// fn.chartLineDatas[sensorId] = {}
						// console.log(this.chartSettings)
						// console.log(this.chartLineDatas[sensorId].rows)
					}
					else{
						notice.error(e.msg, 'error', 3000)
					}
				})
			}
			else{
				this.chartLineDatas = {}
				// this.chartSettings = {}
				this.loading = true
				this.sensors.forEach(sensor => {
					const _id = sensor._id
					let params = {
						_id: _id,
						granularity: this.query.granId,
						startTime: startDate.valueOf(),
						endTime: endDate.valueOf()
					}
					
					this.getSeries(params).then(e => {
						fn.loading = false
						if(e.success){
							//console.log(e.data)
							const datas = e.data.data
							fn.chartLineDatas[_id] = fn.genChartData()
							fn.chartSettings = fn.genChartSettings()
							datas.forEach(row => {
								// let unit = sensor.unit
								let date = Moment(row.meta.updatedAt)
								if(params.granularity === 'utm'){
									// let value = row.value
									let result = fn.unitConverter(row.value, sensor.unit)
									// this.unitConverter(value, unit)
									
									const point = {
										date: date.format('YYYY-MM-DD HH:mm:ss'),
										value: result.value
									}
									fn.chartLineDatas[_id].rows.push(point)	
								}
								else{
									if(row.aggregation.min !== -1000){
										let minResult = fn.unitConverter(row.aggregation.min.toFixed(2), sensor.unit)
										let maxResult = fn.unitConverter(row.aggregation.max.toFixed(2), sensor.unit)
										let avgResult = fn.unitConverter(row.aggregation.avg.toFixed(2), sensor.unit)

										fn.chartLineDatas[_id].rows.push({
											date: date.format('YYYY-MM-DD HH:mm'),
											min: Number(minResult.value),
											max: Number(maxResult.value),
											avg: Number(avgResult.value)
										})
									}
								}
							})
							// console.log(this.chartSettings)
							// console.log(this.chartLineDatas[sensorId].rows)
						}
						else{
							notice.error(e.msg, 'error', 3000)
						}
					})
				})
			}
		},
		handleExportSensorSeries(){
			let sensorIds = []
			this.sensors.forEach(sensor => {
				sensorIds.push(sensor._id)
			})

			if(!this.query.time || this.query.time.length != 2){
				return notice.error(this.$t('components.widget.sensorChart.chooseTimeHint'), this.$t('common.error'))
			}
			if(!this.query.granId){
				return notice.error(this.$t('components.widget.sensorChart.chooseGranularityHint'), this.$t('common.error'))
			}
			let startDate = Moment(this.query.time[0])
			let endDate = Moment(this.query.time[1])

			startDate.hour(0)
			startDate.minute(0)
			startDate.second(0)
			startDate.millisecond(0)

			endDate.hour(23)
			endDate.minute(59)
			endDate.second(59)
			endDate.millisecond(0)

			let params = {
				ids: sensorIds,
				granularity: this.query.granId,
				startTime: startDate.valueOf(),
				endTime: endDate.valueOf()
			}
			this.exportLoading = true
			this.exportSeries(params).then(e => {
				this.exportLoading = false
				if(e.success){
					let now = new Date()
					let filename = 'export_' + now.valueOf() + '.xlsx'
					let blob = new Blob([new Uint8Array(e.data.data)])
					downloadFileWithBlob(blob, filename)
				}
				else{
					return notice.error(e.message, this.$t('common.error'))
				}
			})
		},
		loadSensorSeries() {

		},
		genYAxis(sensor){
			let unit = sensor.unit
			let value = sensor.value
			let result = this.unitConverter(value, unit)
			return [
		        {
		            name: sensor.name + ' (' + result.unit + ')',
		            nameLocation: 'end',
		            nameTextStyle: {
		            	fontSize: 12,
		            	align: 'left',
		            	fontFamily: 'Questrial'
		            }
		        }
		    ]
		},
	    genChartData() {
	    	let data = {
				columns: [],
				rows: []
			}
			if(this.query.granId === 'utm'){
				data.columns = ['date', 'value']
			}
			else{
				data.columns = ['date', 'min', 'max', 'avg']
			}
			return data
	    },
	    genChartSettings() {
	    	let data = {
				labelMap: {},
				metrics: [],
				dimension: ['date'],
				showLine: []
			}
			if(this.query.granId === 'utm'){
				data.labelMap = {
					date: this.$t('components.widget.sensorChart.date'),
					value: this.$t('components.widget.sensorChart.value')
				}
				data.metrics = ['value'],
				data.showLine = ['value']
			}
			else{
				data.labelMap = {
					date: this.$t('components.widget.sensorChart.date'),
					min: this.$t('components.widget.sensorChart.min'),
					max: this.$t('components.widget.sensorChart.max'),
					avg: this.$t('components.widget.sensorChart.avg')
				}
				data.metrics = ['min', 'max', 'avg'],
				data.showLine = ['avg']
			}
			return data
	    },
	    getChartTitle(sensor){
	    	return {
	    		text: sensor.name,
			    show: false,
			    _id: sensor._id
	    	}
	    },
	    refreshChart(e){
	    	console.log(e)
  			try{
      			let title = e.option.title[0]
      			let _id = title._id
      			console.log(_id)
      			this.handleLoadSensorSeries(_id)
			}catch(ex){

			}
	    }
	},
	mounted() {
		// console.log(this.sensors)
		if(this.sensors !== undefined){
			this.chartLineDatas = {}
			this.sensors.forEach(sensor => {
				this.chartLineDatas[sensor._id] = this.genChartData()
				this.chartSettings = this.genChartSettings()
			})
			this.charts = this.sensors
		}
		if(this.granularity){
			this.query.granId = this.granularity
		}

		if(this.sensorIds){
			this.query.sensorIds = this.sensorIds
		}

		//this.loadData()
	},
	data() {
		let now = Moment()
		//let endDate = Moment().tz('Asia/Ho_Chi_Minh')
		let startTime = 0
		let endTime = 0
		now.hour(0)
		now.minute(0)
		now.second(0)
		now.millisecond(0)
		startTime = now.valueOf()

		now.hour(23)
		now.minute(59)
		now.second(59)
		now.millisecond(0)
		endTime = now.valueOf()

		return {
			loading: false,
			exportLoading: false,
			lastSensorIds: [],
			charts: [],
			query: {
				sensorIds: [],
				granId: 'utm',
				startDate: startTime,
				endDate: endTime,
				time: [new Date(startTime), new Date(endTime)]
			},
			granularities: [
				{
					name: this.$t('components.widget.sensorChart.utm'),
					value: 'utm'
				},
				{
					name: this.$t('components.widget.sensorChart.hourly'),
					value: 'hourly'
				},
				{
					name: this.$t('components.widget.sensorChart.daily'),
					value: 'daily'
				},
				{
					name: this.$t('components.widget.sensorChart.weekly'),
					value: 'weekly'
				},
				{
					name: this.$t('components.widget.sensorChart.monthly'),
					value: 'monthly'
				}
			],
			dataZoom: [{
		        type: 'inside',
		        start: 0,
		        end: 10
		    }, {
		        start: 0,
		        end: 10
		    }],
			markLine: { data: [ { name: this.$t('components.widget.sensorChart.avg'), type: 'average' } ] },
			chartToolbox: {
				show: true,
			    feature: {
			      	dataView: {
			      		title: this.$t('components.widget.sensorChart.dataView'),
			        	readOnly: false,
			        	lang: [this.$t('components.widget.sensorChart.dataView'), this.$t('common.close'), this.$t('common.refresh')]
			      	},
			      	magicType: {
			      		title: this.$t('components.widget.sensorChart.viewMode'),
			        	type: ['line', 'bar']
			      	},
			      	myRefresh: {
			      		show: true,
			      		title: this.$t('components.widget.sensorChart.reloadChart'),
			      		icon: 'path://M112.156,97.111c72.3-65.4,180.5-66.4,253.8-6.7l-58.1,2.2c-7.5,0.3-13.3,6.5-13,14c0.3,7.3,6.3,13,13.5,13 c0.2,0,0.3,0,0.5,0l89.2-3.3c7.3-0.3,13-6.2,13-13.5v-1c0-0.2,0-0.3,0-0.5v-0.1l0,0l-3.3-88.2c-0.3-7.5-6.6-13.3-14-13 c-7.5,0.3-13.3,6.5-13,14l2.1,55.3c-36.3-29.7-81-46.9-128.8-49.3c-59.2-3-116.1,17.3-160,57.1c-60.4,54.7-86,137.9-66.8,217.1 c1.5,6.2,7,10.3,13.1,10.3c1.1,0,2.1-0.1,3.2-0.4c7.2-1.8,11.7-9.1,9.9-16.3C36.656,218.211,59.056,145.111,112.156,97.111z M462.456,195.511c-1.8-7.2-9.1-11.7-16.3-9.9c-7.2,1.8-11.7,9.1-9.9,16.3c16.9,69.6-5.6,142.7-58.7,190.7 c-37.3,33.7-84.1,50.3-130.7,50.3c-44.5,0-88.9-15.1-124.7-44.9l58.8-5.3c7.4-0.7,12.9-7.2,12.2-14.7s-7.2-12.9-14.7-12.2l-88.9,8 c-7.4,0.7-12.9,7.2-12.2,14.7l8,88.9c0.6,7,6.5,12.3,13.4,12.3c0.4,0,0.8,0,1.2-0.1c7.4-0.7,12.9-7.2,12.2-14.7l-4.8-54.1 c36.3,29.4,80.8,46.5,128.3,48.9c3.8,0.2,7.6,0.3,11.3,0.3c55.1,0,107.5-20.2,148.7-57.4 C456.056,357.911,481.656,274.811,462.456,195.511z',
			      		onclick: this.refreshChart	
			      	},
			      	saveAsImage: {
			      		title: this.$t('components.widget.sensorChart.saveAsImage'),
			      	}			      	
			    }
			},
			chartSettings: {
				labelMap: {},
				metrics: [],
				dimension: ['date'],
				showLine: []
			},
			chartTooltip: {
		        trigger: 'axis',
		        position: function (pt) {
		            return [pt[0], '10%'];
		        }
		    },
			chartLineDatas: {},
			pickerOptions: {
	          	disabledDate(time) {
	            	return time.getTime() > Date.now();
	          	},
	          	shortcuts: [{
	            	text: 'Today',
	            	onClick(picker) {
	              		picker.$emit('pick', new Date());
	            	}
	          	}, 
	          	{
	            	text: 'Yesterday',
	            	onClick(picker) {
	              		const date = new Date();
	              		date.setTime(date.getTime() - 3600 * 1000 * 24);
	              		picker.$emit('pick', date);
	            	}
	          	}, 
	          	{
	            	text: 'A week ago',
	            	onClick(picker) {
	              		const date = new Date();
	              		date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
	              		picker.$emit('pick', date);
	            	}
	          	}]
	        },
		}
	}
})
export default class SensorChartCard extends Vue{
}
</script>

<style lang="stylus">
.sensor-chart-card-component
	box-shadow 2px 3px 10px #ccc
	border-radius 10px
	width 100%
	padding 10px
	background-color #FFFFFF
	position relative
	.card-title
		font-size 18px
		margin-bottom 20px
		color #909399
		overflow hidden
		white-space nowrap
	.card-icon
		font-size 24px
		position absolute
		color #409EFF
		left 10px
		top 10px
</style>
