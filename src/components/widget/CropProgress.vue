<template lang="pug">
.crop-timeline-card-component()
	i.el-icon-odometer.card-icon
	.card-title(:span="24" type="flex" align="middle" justify="center")
		| {{ $t('components.widget.cropTimeline.title') }}
	el-button-group.card-filter()
		el-tooltip(:content="$t('components.widget.cropTimeline.showHideFilter')" placement="top")
			el-button(icon="el-icon-s-operation" :type="showFilter ? 'primary' : ''" @click="changeFilterState" size="small")
		el-tooltip(:content="$t('components.widget.cropTimeline.showHideList')" placement="top")
			el-button(icon="el-icon-s-unfold" :type="this.options.taskList.display ? 'primary' : ''" @click="toggleTaskList" size="small")
	el-row(v-if="showFilter" :gutter="20")
		el-col(:xs="24" :sm="12" :md="3" style="margin-bottom:10px")
			el-select(v-model="query.farmIds" multiple :placeholder="$t('components.widget.cropTimeline.selectFarms')" size="small" style="width:100%")
				el-option(v-for="item in farms" :key="item.id" :label="item.name" :value="item.id")
		el-col(:xs="24" :sm="12" :md="3" style="margin-bottom:10px")
			el-select(v-model="query.zoneIds" multiple :placeholder="$t('components.widget.cropTimeline.selectZones')" size="small" style="width:100%")
				el-option(v-for="item in zones" :key="item._id" :label="item.name" :value="item._id")
		el-col(:xs="24" :sm="12" :md="3" style="margin-bottom:10px")
			el-select(v-model="query.plantIds" multiple :placeholder="$t('components.widget.cropTimeline.selectPlants')" size="small" style="width:100%")
				el-option(v-for="item in plants" :key="item._id" :label="item.name" :value="item._id")
		el-col(:xs="24" :sm="12" :md="3" style="margin-bottom:10px")
			el-select(v-model="query.status" :placeholder="$t('components.widget.cropTimeline.selectGranularity')" size="small" style="width:100%")
				el-option(v-for="item in states" :key="item.value" :label="item.name" :value="item.value")
		el-col(:xs="24" :sm="12" :md="6" style="margin-bottom:10px")
			el-date-picker(v-model="query.time" type="daterange" range-separator="-" :start-placeholder="$t('common.startDate')" :end-placeholder="$t('common.endDate')" size="small" style="width:100%")
		el-col(:xs="24" :sm="12" :md="3" style="margin-bottom:10px")
			el-button(type="primary" icon="el-icon-search" @click="loadCrops" round style="width:100%" size="small")
				| {{ $t('common.filter') }}
		<!-- el-col(:xs="24" :sm="12" :md="3" style="margin-bottom:10px")
			el-button(type="primary" icon="el-icon-menu" @click="toggleTaskList" round style="width:100%" size="small")
				|{this.options.taskList.display ? 'Hide Tasks' : 'Show Tasks'} -->
	el-row(:gutter="20" style="margin-top: 20px" v-loading="loading")
		el-col(:span="24" style="overflow-x: scroll")
			div.calendar-app-main()
				gantt-elastic(ref="gantt" :tasks="tasks" :options="options")
	el-dialog(:title="cropName" :visible.sync="dialogCropVisible")
		crop-timeline(:id.sync="cropId")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapState,mapActions } from 'vuex'
import GanttElastic from "gantt-elastic"
import CropTimeline from './CropTimeline'
// import GanttHeader from "gantt-elastic-header";
import dayjs from "dayjs"

import notice from '@/utils/ui/notice'
import Moment from 'moment-timezone'

// just helper to get current dates
function getDate(hours) {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;
	const currentDay = currentDate.getDate();
	const timeStamp = new Date(`${currentYear}-${currentMonth}-${currentDay} 00:00:00`).getTime();
	return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
}

const tasks = [
	{
		id: 0,
		label: 'Default',
		start: getDate(0),
		duration: 365 * 24 * 60 * 60 * 1000,
		progress: 100,
		type: 'project'
	}
];

@Component({
	components:{
		GanttElastic,
		CropTimeline
	},
	computed:{
	},
	props:{
	},
	watch:{
	},
	methods:{
		...mapActions({
            'getFarms': 'farm/gets',
            'getPlants': 'plant/gets',
            'getZones': 'zone/gets',
            'getCrops': 'crop/gets'
        }),
		loadData() {
			this.loading = true
			this.getFarms().then(e => {
				if(e.success){
					this.farms = e.farms
				}
				else{
					return notice.error({
						message: this.$t('components.widget.cropTimeline.loadFarmError'),
						title: this.$t('common.error'),
						duration: 3000,
					})
				}
			})

			this.getZones().then(e => {
				if(e.success){
					this.zones = e.zones
				}
				else{
					return notice.error({
						message: this.$t('components.widget.cropTimeline.loadZoneError'),
						title: this.$t('common.error'),
						duration: 3000,
					})
				}
			})

			this.getPlants().then(e => {
				if(e.success){
					this.plants = e.plants
					this.loadCrops()
				}
				else{
					return notice.error({
						message: this.$t('components.widget.cropTimeline.loadPlantError'),
						title: this.$t('common.error'),
						duration: 3000,
					})
				}
			})
		},
		handleChangeFarm() {
			
		},

		handleChangeCrop() {
			
		},

		toggleTaskList(){
			this.options.taskList.display = !this.options.taskList.display
		},

		initView(){
			let ids = []
			
			let crops = this.crops.filter(crop => {
				ids.push(crop._id)
				ids.push(crop.zoneId)
				return true
			})

			let zones = this.zones.filter(zone => {
				if(ids.indexOf(zone._id) >= 0){
					ids.push(zone._id)
					ids.push(zone.farmId)
					return true
				}
				return false
			})

			let farms = this.farms.filter(farm => {
				if(ids.indexOf(farm._id) >= 0){
					return true	
				}
				return false
			})

			if(crops.length == 0){
				this.tasks = tasks
			}
			else{
				this.tasks = []	
			}

			farms.forEach(farm => {
				let assignTos = []
				assignTos.push(farm.ownerId)
				farm.share.adminIds.forEach(u => {
					assignTos.push(u)
				})

				farm.share.userIds.forEach(u => {
					assignTos.push(u)	
				})
				
				let html = ''
				console.log(assignTos)
				assignTos.forEach(u => {
					if (u !== undefined && u !== '' && duration !== '') {
						html += '<span class="el-tag el-tag--light el-tag--mini">' + u + '</span>'
					}
				})
				let now = Moment()
				let duration = now.valueOf() + 30 * 24 * 60 * 60 * 1000 - farm.meta.createdAt
				let percent = parseInt((now.valueOf() - farm.meta.createdAt) * 100 / duration)
				this.pushTask({
					id: farm._id,
					label: farm.name,
					assignTo: html,
					start: farm.meta.createdAt,
					duration: duration,
					progress: percent,
					type: 'project'
				})
			})

			zones.forEach(zone => {
				let notes = '<span class="el-tag el-tag--light el-tag--mini">' + zone.cultivationType.name + '</span>' +
							'<span class="el-tag el-tag--success el-tag--light el-tag--mini">' + zone.zoneSize.value + ' ' + zone.zoneSize.name + '</span>' +
							'<span class="el-tag el-tag--danger el-tag--light el-tag--mini">' + zone.zoneType.name + '</span>'
				let now = Moment()
				let duration = now.valueOf() + 30 * 24 * 60 * 60 * 1000 - zone.meta.createdAt
				let percent = parseInt((now.valueOf() - zone.meta.createdAt) * 100 / duration)
				// duration = parseInt(duration / (24 * 60 * 60 * 1000))
				this.pushTask({
					id: zone._id,
					parentId: zone.farmId,
					label: zone.name,
					notes: notes,
					start: zone.meta.createdAt,
					duration: duration,
					progress: percent,
					type: 'milestone',
					style: {
						base: {
							fill: '#1EBC61',
							stroke: '#0EAC51'
						}
					}
				})
			})

			this.crops.forEach(crop => {
				let now = Moment()
				let duration = crop.endDate - crop.startDate
				let percent = parseInt((now.valueOf() - crop.startDate) * 100 / duration)
				let notes = '<span class="el-tag el-tag--light el-tag--mini">' + crop.plant.name + '</span><span class="el-tag el-tag--success el-tag--light el-tag--mini">' + crop.size.value + ' ' + crop.size.unit.name + '</span>'
				let detail = '<button type="button" class="el-button el-button--text el-button--mini"><span>' + this.$t('common.detail') + '</span></button>'
				this.pushTask({
					id: crop._id,
					parentId: crop.zoneId,
					label: crop.name,
					detail: detail,
					notes: notes,
					start: crop.startDate,
					duration: duration,
					progress: percent,
					type: 'task',
					style: {
						base: {
							fill: '#8E44AD',
							stroke: '#7E349D'
						}
					}
				})
			})
		},

	    loadCrops(){
	    	let params = {
	    		status: this.query.status
	    	}

	    	if(this.query.farmIds.length > 0){
	    		params.farmIds = this.query.farmIds
	    	}

	    	if(this.query.zoneIds.length > 0){
	    		params.zoneIds = this.query.zoneIds
	    	}

	    	if(this.query.plantIds.length > 0){
	    		params.plantIds = this.query.plantIds
	    	}

	    	if(this.query.time.length === 2){
	    		let startDate = Moment(this.query.time[0])
	    		let endDate = Moment(this.query.time[1])
	    		params.startDate = startDate.valueOf()
	    		params.endDate = endDate.valueOf()
	    	}
	    	this.loading = true
	    	this.getCrops(params).then(e => {
	    		this.loading = false
	    		if(e.success){
	    			console.log(e.crops)
	    			this.crops = e.crops
	    			this.initView()
	    		}
	    		else{
	    			return notice.error({
						message: this.$t('components.widget.cropTimeline.loadCropError'),
						title: this.$t('common.error'),
						duration: 3000,
					})
	    		}
	    	})
	    },
	    tasksUpdate(tasks) {
	    	// this.tasks = tasks;
	    },
	    optionsUpdate(options) {
	    	this.options = options;
	    },
	    styleUpdate(style) {
	    	this.dynamicStyle = style;
	    },
	    pushTask(task) {
	    	let isExisted = false
	    	for(let i = 0; i < this.tasks.length; i++) {
	    		let item = this.tasks[i]
	    		if(item.id === task.id) {
	    			this.tasks[i] = task
	    			isExisted = true
	    			break
	    		}
	    	}
	    	if(!isExisted) {
	    		this.tasks.push(task)
	    	}
	    },
	    handleCropView(event, column) {
	    	this.cropName = event.data.label
	    	this.cropId = event.data.id
	    	console.log(event.data)
	    	this.dialogCropVisible = true
	    },
	    changeFilterState(){
	    	this.showFilter = !this.showFilter
	    }
	},
	mounted() {
		this.loadData()
		let ganttInstance = this.$refs.gantt

		let fn  = this

        /* ganttInstance.$on('tasks-changed', tasks => {
        	console.log('tasks updated', tasks)
        	fn.tasks = tasks
        });
        ganttInstance.$on('options-changed', options => {
        	//console.log('options updated', options)
        	fn.options = options
        });
        ganttInstance.$on('dynamic-style-changed', style => {
        	console.log('style updated', style)
        	fn.dynamicStyle = style
        });

        ganttInstance.$on('chart-task-mouseenter', ({ data, event }) => {
        	console.log('task mouse enter', { data, event })
        });
        ganttInstance.$on('updated', () => {
        	console.log('gantt view was updated')
        });
        ganttInstance.$on('destroyed', () => {
        	console.log('gantt was destroyed')
        });
        ganttInstance.$on('times-timeZoom-updated', () => {
        	console.log('time zoom changed')
        });
        ganttInstance.$on('taskList-task-click', ({ event, data, column }) => {
        	console.log('task list clicked! (task)', { data, column })
        }); */
	},
	beforeUnmount() {
	},
	data() {
		return {
			loading: false,
			tasks: tasks,
			options: {
				title: {
					label: this.$t('components.widget.cropTimeline.title'),
					html: false
				},
				taskList: {
					columns: [
					  	{
					  		id: 1,
					  		label: this.$t('components.widget.cropTimeline.id'),
					  		value: "id",
					  		width: 40
					  	},
					  	{
						    id: 2,
						    label: this.$t('components.widget.cropTimeline.crops'),
						    value: "label",
						    width: 150,
						    expander: true,
						    html: true
					  	},
					  	{
						    id: 3,
						    label: this.$t('common.detail'),
						    value: "detail",
						    width: 68,
						    html: true,
						    events: {
						    	click: this.handleCropView
						    }
					    },
					  	{
						    id: 3,
						    label: this.$t('components.widget.cropTimeline.asignedTo'),
						    value: "assignTo",
						    width: 130,
						    html: true
					    },
					  	{
						    id: 3,
						    label: this.$t('components.widget.cropTimeline.notes'),
						    value: "notes",
						    width: 130,
						    html: true
					    },
					  	{
						    id: 3,
						    label: this.$t('components.widget.cropTimeline.start'),
						    value: task => dayjs(task.start).format("YYYY-MM-DD"),
						    width: 78
					    },
					    {
						    id: 4,
						    label: this.$t('common.type'),
						    value: "type",
						    width: 68
					    },
					    {
					    	id: 5,
						    label: this.$t('components.widget.cropTimeline.progress'),
						    value: "progress",
						    width: 35,
						    style: {
						      	"task-list-header-label": {
						        	"text-align": "center",
						        	width: "100%"
						      	},
						      	"task-list-item-value-container": {
						        	"text-align": "center",
						        	width: "100%"
						        }
						    }
						}
					],
					display: true
				},
			  	locale: {
				    name: "en",
				    Now: "Now",
				    "X-Scale": "Zoom-X",
				    "Y-Scale": "Zoom-Y",
				    "Task list width": "Task list",
				    "Before/After": "Expand",
				    "Display task list": "Task list"
			  	}
			},
			dynamicStyle: {},
			lastId: 16,
			farms: [],
			zones: [],
			plants: [],
			crops: [],
			states: [
				{
					name: this.$t('common.operating'),
					value: true
				},
				{
					name: this.$t('common.archived'),
					value: false
				}
			],
			query: {
				farmIds: [],
				plantIds: [],
				zoneIds: [],
				status: true,
				startDate: 0,
				endDate: 0,
				time: 0
			},
			cropName: '',
			dialogCropVisible: false,
			showFilter: false,
			cropId: ''
		}
	}
})
export default class CropTimelineCard2 extends Vue{
}
</script>

<style lang="stylus">
.crop-timeline-card-component
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
	.card-filter
		position absolute
		right 10px
		top 10px
	.calendar-app-main
		flex-grow 1
		background #FFFFFF
		min-width 600px
		position relative
		.show-weekend
			position: absolute
			right 10px
			top 10px
	.fc
		margin 0 auto
		height 520px
		.fc-toolbar-title
			font-size 1.1em
		.fc-today-button
			display none
		.fc-resourceTimelineYear-button
			display none
</style>
