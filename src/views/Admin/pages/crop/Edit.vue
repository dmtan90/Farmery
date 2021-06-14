<template lang="pug">
.crop-add-component
	el-form.crop-add-form(:model="crop" label-width="100px"  center status-ico)
		el-form-item(:label="$t('common.name')")
			el-input(type="text" v-model="crop.name" :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable size="small")
		el-form-item(:label="$t('common.zone')")
			el-select(v-model="crop.zoneId" :placeholder="$t('admin.crop.selectZone')" size="small")
				el-option(v-for="item in zones" :key="item.id" :label="item.name" :value="item.id")
		el-form-item(:label="$t('common.plant')")
			el-select(v-model="crop.plantId" :placeholder="$t('admin.crop.selectPlant')" size="small")
				el-option(v-for="item in plants" :key="item.id" :label="item.name" :value="item.id")
		el-form-item(:label="$t('common.time')")
			el-date-picker(v-model="crop.time" type="daterange" range-separator="-" :start-placeholder="$t('common.startDate')" :end-placeholder="$t('common.endDate')" size="small" style="width: 100%")
		el-form-item(:label="$t('common.status')")
			el-select(v-model="crop.status" :placeholder="$t('common.status')" size="small")
				el-option(v-for="item in statusOptions" :key="item.value" :label="item.name" :value="item.value")
		el-form-item(:label="$t('common.size')")
			el-row(:gutter="20" type="flex")
				el-col(:span="8")
					el-input(type="number" v-model.trim="crop.size.value" placeholder="E.g. 100" clearable size="small")
				el-col(:span="16")
					el-select(v-model="crop.size.unit.value" :placeholder="$t('admin.crop.selectUnit')" size="small")
						el-option(v-for="item in unitOptions" :key="item.value" :label="item.name" :value="item.value")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" size="small" @click="submitForm" :loading="isLoading" round style="width: 150px") {{ $t('common.add') }}
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
//import DeviceModelSelect from '~/device/ModelSelect'
// import BulbCheckBox from '~/bulb/CheckBox'
// import BulbColorSelect from '~/bulb/ColorSelect'

import { mapActions, mapState } from 'vuex'
import notice from '@/utils/ui/notice'

@Component({
	components: {
	
	},
	props: ['id'],
	methods: {
		...mapActions({
            'getPlants': 'plant/gets',
            'getZones': 'zone/gets',
        }),
		...mapActions('crop', ['update', 'get', 'getUnits']),
		loadData() {
			this.getPlants().then(e => {
				if(e.success){
					this.plants = e.plants
				}
			})

			this.getZones().then(e => {
				if(e.success){
					this.zones = e.zones
				}
			})

			this.getUnits().then(e => {
				if(e.success){
					this.unitOptions = e.units
				}
			})

			this.get(this.id).then(e => {
				if(e.success){
					this.crop = e.crop
					let startDate = new Date(this.crop.startDate)
					let endDate = new Date(this.crop.endDate)
					this.crop.time = [startDate, endDate]
				}
			})
		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			unitOptions: [],
			zones: [],
			plants: [],
			isLoading: false,
			statusOptions: [
				{
					name: this.$t('common.operating'),
					value: true
				},
				{
					name: this.$t('common.archived'),
					value: false
				}
			],
			crop: {
				name: '',
				zoneId: '',
				plantId: '',
				startDate: 0,
				endDate: 0,
				time: [],
				status: true,
				size: {
					name: '',
					value: 100,
					unit: 1
				}
			}
		}
	}
})
export default class DeviceAdd extends Vue{
	submitForm() {
		// e.g AA:BB:CC:DD:EE:FF
		if(!this.crop.zoneId){
			return notice.warning(this.$t('admin.crop.selectZoneHintError'))
		}
		if(!this.crop.plantId){
			return notice.warning(this.$t('admin.crop.selectPlantHintError'))
		}

		if(!this.crop.name || this.crop.name.length > 64 || this.crop.name === ''){
			return notice.warning(this.$t('admin.crop.cropNameHintError'))
		}
		this.crop.name = this.crop.name.toUpperCase()

		this.unitOptions.forEach(unit => {
			if(unit.value === this.crop.size.unit) {
				this.crop.size.name = unit.name
			}
		})

		if(this.crop.time == undefined || this.crop.time === '' || this.crop.time.length != 2){
			return notice.warning(this.$t('admin.crop.cropTimeHintError'))
		}

		this.crop.startDate = (new Date(this.crop.time[0])).getTime()
		this.crop.endDate = (new Date(this.crop.time[1])).getTime()

		console.log(this.crop)

		this.isLoading = true
		// this.bulb.showStatus = this.bulb.status ? 'ON' : 'OFF'
		this.update(this.crop).then(e=>{
			this.isLoading = false
			if(e.success){
				notice.success(e.message, this.$t('common.info'))
				this.$router.push({name: 'CropManage'})
			}else{
				notice.error(e.message, this.$t('common.error'))
			}
		})
	}
}
</script>

<style lang="stylus">
.crop-add-component
	margin 30px 100px 100px
	// font-beautify()
	.device-checkbox
		transform translateX(-100px)
.crop-add-form
	max-width 500px
	margin-left auto
	margin-right auto
</style>
