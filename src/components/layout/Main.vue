<template lang="pug">
el-main.main(:style="{ height: (windowHeight - 60) + 'px' }")
	transition(v-if="isHome" :name="animation")
		.home-main
			div
				span.header-bar()
					| {{ $t('admin.dashboard.summary') }}
				el-row(:span="24" :gutter="20" align="middle")
					el-col(:xs="24" :sm="12" :md="3" style="margin-top:10px")
						statistic-card(:data="org")
					el-col(:xs="24" :sm="12" :md="3" style="margin-top:10px")
						statistic-card(:data="user")
					el-col(:xs="24" :sm="12" :md="3" style="margin-top:10px")
						statistic-card(:data="farm")
					el-col(:xs="24" :sm="12" :md="3" style="margin-top:10px")
						statistic-card(:data="plant")
					el-col(:xs="24" :sm="12" :md="3" style="margin-top:10px")
						statistic-card(:data="zone")
					el-col(:xs="24" :sm="12" :md="3" style="margin-top:10px")
						statistic-card(:data="crop")
					el-col(:xs="24" :sm="12" :md="3" style="margin-top:10px")
						statistic-card(:data="device")
				el-divider()
			div(style="margin-top:20px")
				span.header-bar()
					| {{ $t('admin.dashboard.devices') }}
				el-row(:span="24" :gutter="20" align="middle" style="margin-top:20px")
					el-col(:xs="24" :sm="24" :md="24")
						device-card()
				el-divider()
			<!-- div(style="margin-top:20px")
				span.header-bar()
					| {{ $t('admin.dashboard.cropTimeline') }}
				el-row(:span="24" :gutter="20" align="middle" style="margin-top:20px")
					el-col(:xs="24" :sm="24" :md="24")
						crop-timeline-card()
				el-divider() -->
			div(style="margin-top:20px")
				span.header-bar()
					| {{ $t('admin.dashboard.cropTimeline') }}
				el-row(:span="24" :gutter="20" align="middle" style="margin-top:20px")
					el-col(:xs="24" :sm="24" :md="24")
						crop-progress-card()
				el-divider()
			div(style="margin-top:20px")
				span.header-bar()
					| {{ $t('admin.dashboard.analysis') }}
				el-row(:span="24" :gutter="20" align="middle" style="margin-top:20px")
					el-col(:xs="24" :sm="24" :md="8")
						weather-card
					<!-- el-col(:xs="24" :sm="24" :md="16")
						sensor-chart-card(:devices.sync="devices" :sensorId.sync="sensorId" :granularity.sync="granId") -->
				el-divider()

	transition(v-else :name="animation")
		router-view(:key="Date.now()")
</template>

<script>
import { Component,Vue } from 'vue-property-decorator'
import { mapState, mapActions } from 'vuex'
import { getRandomAnimation } from '@/utils/ui/animation'
import i18n from '@/lang/i18n'
// import SummaryCard from '~/summary/Card'
import WeatherCard from '~/weather/Card'

import StatisticCard from '~/widget/Statistic'
import DeviceCard from '~/widget/Device'
import SensorCard from '~/widget/Sensor'
import SensorChartCard from '~/widget/SensorChart'
// import CropTimelineCard from '~/widget/CropTimeline'
import CropProgressCard from '~/widget/CropProgress'
import RelayCard from '~/widget/Relay'

// import ElectricCard from '~/electric/Card'
// import UsagelogChart from '~/Usagelog/Chart'
// import ConsumptionCard from '~/consumption/Card'
// import AudioRecorder from '~/audio/Recorder'

@Component({
	components:{
		StatisticCard,
		DeviceCard,
		SensorCard,
		RelayCard,
		WeatherCard,
		SensorChartCard,
		CropProgressCard
		//ElectricCard,
		//UsagelogChart,
		//ConsumptionCard,
		//AudioRecorder
	},
	computed:{
		...mapState('ui',['isHome']),

	},
	watch:{
		'$route'(to,from){
			this.changeAnimation()
		}
	},
	methods: {
		...mapActions({
            'countOrg': 'org/count',
            'countUser': 'org/countUser',
            'countFarm': 'farm/count',
            'countPlant': 'plant/count',
            'countZone': 'zone/count',
            'countCrop': 'crop/count',
            'countDevice': 'device/count'
        }),
		...mapActions('device',['gets']),
		loadData() {
			/* this.gets().then(e => {
				if(e.success) {
					this.devices = e.devices
					this.sensors = []
					this.relays = []
					this.devices.forEach(dev => {
						if(dev.control.sensors) {
							Array.prototype.push.apply(this.sensors, dev.control.sensors)
						}

						if(dev.control.relays) {
							Array.prototype.push.apply(this.relays, dev.control.relays)
						}
					})
				}
			}) */
		},
		loadStatisticData() {
			let fn = this
			this.countOrg().then(e => {
				if(e.success){
					fn.org.total = e.count
				}
			})

			this.countUser().then(e => {
				if(e.success){
					fn.user.total = e.count
				}
			})

			this.countFarm().then(e => {
				if(e.success){
					fn.farm.total = e.count
				}
			})

			this.countPlant().then(e => {
				if(e.success){
					fn.plant.total = e.count
				}
			})

			this.countZone().then(e => {
				if(e.success){
					fn.zone.total = e.count
				}
			})

			this.countCrop().then(e => {
				if(e.success){
					fn.crop.total = e.count
				}
			})

			this.countDevice().then(e => {
				if(e.success){
					fn.device.total = e.count
				}
			})
		},
		handleSwitchRelay(data) {
			console.log(data)
		},
		handleSenseChart(id) {
			console.log(id)
			this.sensorId = id
			this.granId = 'utm'
		},
		changeAnimation() {
			this.animation = getRandomAnimation()
		}
	},
	mounted() {
		const fn = this
		this.loadData()
		this.loadStatisticData()
		/*setInterval(function(){
			fn.loadData()
		}, 10000)*/
		
		window.onresize = () => {
	      this.windowHeight = window.innerHeight
	    }
	},
	data() {
		return {
			windowHeight: window.innerHeight,
			sensors: [],
			relays: [],
			devices: [],
			sensorId: '',
			granId: 'utm',
			bindSensorDialogVisible: false,
			org: {
				name: this.$t('admin.dashboard.organization'),
				icon: 'el-icon-office-building',
				total: 0,
				route: 'OrgManage'
			},
			farm: {
				name: this.$t('admin.dashboard.farm'),
				icon: 'el-icon-house',
				total: 0,
				route: 'FarmManage'
			},
			plant: {
				name: this.$t('admin.dashboard.plant'),
				icon: 'el-icon-apple',
				total: 0,
				route: 'PlantManage'
			},
			user: {
				name: this.$t('admin.dashboard.user'),
				icon: 'el-icon-user',
				total: 0,
				route: 'OrgManage'
			},
			zone: {
				name: this.$t('admin.dashboard.zone'),
				icon: 'el-icon-place',
				total: 0,
				route: 'ZoneManage'
			},
			crop: {
				name: this.$t('admin.dashboard.crop'),
				icon: 'el-icon-crop',
				total: 0,
				route: 'CropManage'
			},
			device: {
				name: this.$t('admin.dashboard.device'),
				icon: 'el-icon-monitor',
				total: 0,
				route: 'DeviceManage'
			},
			animation: getRandomAnimation()
		}
	}
})
export default class LayoutMain extends Vue{
}
</script>

<style lang="stylus">
.main
	background #F6F8F8
	overflow-y scroll
	.header-bar
		margin-bottom 20px
</style>
