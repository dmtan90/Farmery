<template lang="pug">
.crop-timeline-card-component()
	i.el-icon-odometer.card-icon
	.card-title(:span="24" type="flex" align="middle" justify="center")
		|Crop Timeline
	el-row(:gutter="20")
		el-col(:span="3")
			el-select(v-model="query.farmIds" multiple placeholder="Select device" size="small" @change="handleChangeFarm")
				el-option(v-for="item in farms" :key="item.id" :label="item.name" :value="item.id")
		el-col(:span="3")
			el-select(v-model="query.cropIds" multiple placeholder="Select sensors" size="small" @change="handleChangeCrop")
				el-option(v-for="item in crops" :key="item._id" :label="item.name" :value="item._id")
		el-col(:span="3")
			el-select(v-model="query.status" placeholder="Select granularity" size="small" @change="handleChangeStatus")
				el-option(v-for="item in states" :key="item.value" :label="item.name" :value="item.value")
		el-col(:span="9")
			el-date-picker(v-model="query.time" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" size="small")
		el-col(:span="3")
			el-button(type="primary" icon="el-icon-search" @click="loadSensorSeries()" round style="width:100%" size="small")
				|Filter
	el-row(:gutter="20" style="margin-top: 20px")
		el-col(:span="24")
			div.calendar-app-main()
				div.show-weekend()
					el-switch(v-model="calendarOptions.weekends" active-text="Show weekends")
				FullCalendar.calendar-app-calendar(ref="fullCalendar" :options="calendarOptions")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapState,mapActions } from 'vuex'
import FullCalendar from '@fullcalendar/vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

@Component({
	components:{
		FullCalendar
	},
	computed:{
		...mapState('farm',['gets']),
		...mapState('crop',['gets'])
	},
	props:{
	},
	watch:{
	},
	methods:{
		handleChangeFarm() {
			
		},

		handleChangeCrop() {
			
		},

		handleWeekendsToggle() {
	      	this.showWeekend = !this.showWeekend
	      	this.calendarOptions.weekends = this.showWeekend // update a property
	    },
	    handleEvents(events) {
	      	this.currentEvents = []
	      	events.forEach(event => {
	        	const d = new Date(event.startStr)
	        	const startStr = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
	        	const tmpEvent = {
	          		id: event.id,
	          		startStr: startStr,
	          		title: event.title
	        	}
	        	this.currentEvents.push(tmpEvent)
	      	})
	    },
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			showWeekend: true,
			farms: [],
			crops: [],
			states: [
				{
					name: 'Operating',
					value: true
				},
				{
					name: 'Archived',
					value: false
				}
			],
			query: {
				farmIds: [],
				cropIds: [],
				sensors: [],
				status: true,
				startDate: 0,
				endDate: 0,
				time: 0
			},
			currentEvents: [],
			calendarOptions: {
		        plugins: [
		          	resourceTimelinePlugin,
		          	dayGridPlugin,
		          	timeGridPlugin,
		          	interactionPlugin // needed for dateClick
		        ],
		        headerToolbar: {
		          	left: 'prev,next',
		          	center: 'title',
		          	right: ''
		        },
		        initialView: 'resourceTimelineMonth',
		        aspectRatio: 1.0,
		        editable: false,
		        selectable: true,
		        selectMirror: true,
		        dayMaxEvents: true,
		        weekends: true,
		        allDayDefault: true,
		        eventsSet: this.handleEvents,
		        resourceAreaWidth: '20%',
		        resourceGroupField: 'farmName',
		        dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
		        resourceAreaColumns: [
		        	{
			            field: 'zoneName',
			            headerContent: 'Zones'
			        },
		          	{
		            	field: 'title',
		            	headerContent: 'Crops'
		          	}
		        ],
		        resources: [
		        	{
		        		id: '0',
		        		farmName: 'Farm 1',
		        		zoneName: 'Zone 1',
		        		title: 'Crop 0'
		        	},
		        	{
		        		id: '1',
		        		farmName: 'Farm 1',
		        		zoneName: 'Zone 1',
		        		title: 'Crop 1'
		        	},
		        	{
		        		id: '2',
		        		farmName: 'Farm 1',
		        		zoneName: 'Zone 2',
		        		title: 'Crop 2'
		        	},
		        	{
		        		id: '3',
		        		farmName: 'Farm 2',
		        		zoneName: 'Zone 2',
		        		title: 'Crop 3'
		        	},
		        	{
		        		id: '4',
		        		farmName: 'Farm 2',
		        		zoneName: 'Zone 1',
		        		title: 'Crop 4'
		        	},
		        	{
		        		id: '5',
		        		farmName: 'Farm 3',
		        		zoneName: 'Zone 1',
		        		title: 'Crop 5'
		        	},{
		        		id: '6',
		        		farmName: 'Farm 3',
		        		zoneName: 'Zone 1',
		        		title: 'Crop 6'
		        	}
		        ],
		        events: [
		        	{
		        		id: '0',
			            title: 'Operating 20%',
			            start: (new Date("2021-01-02")).toJSON(),
			            end: (new Date("2021-02-02")).toJSON(),
			            resourceId: '0',
			            allDay: true
		        	},
		        	{
		        		id: '1',
			            title: 'Operating 50%',
			            start: (new Date("2021-01-02")).toJSON(),
			            end: (new Date("2021-03-02")).toJSON(),
			            resourceId: '1',
			            allDay: true
		        	},
		        	{
		        		id: '2',
			            title: 'Operating 50%',
			            start: (new Date("2021-02-02")).toJSON(),
			            end: (new Date("2021-03-02")).toJSON(),
			            resourceId: '3',
			            allDay: true
		        	},
		        	{
		        		id: '3',
			            title: 'Operating 10%',
			            start: (new Date("2021-02-02")).toJSON(),
			            end: (new Date("2021-03-02")).toJSON(),
			            resourceId: '4',
			            allDay: true
		        	},
		        	{
		        		id: '4',
			            title: 'Operating 50%',
			            start: (new Date("2021-02-02")).toJSON(),
			            end: (new Date("2021-03-02")).toJSON(),
			            resourceId: '6',
			            allDay: true
		        	},
		        	{
		        		id: '5',
			            title: 'Operating 0%',
			            start: (new Date("2021-02-02")).toJSON(),
			            end: (new Date("2021-03-02")).toJSON(),
			            resourceId: '5',
			            allDay: true
		        	}
		        ]
		    },
		}
	}
})
export default class CropTimelineCard extends Vue{
}
</script>

<style lang="stylus">
.crop-timeline-card-component
	box-shadow 2px 3px 10px #ccc
	border-radius 10px
	width 100%
	padding 20px
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
