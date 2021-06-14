<template lang="pug">
.electric-add-component
	el-form.zone-add-form(:model="zone" label-width="150px"  center status-ico)
		el-row(:gutter="20")
			el-col(:xs="24" :md="8")
				avatar-upload.avatar-upload-component(:avatar.sync="zone.avatar" :is-init="true")
			el-col(:xs="24" :md="16")
				el-form-item.electric-form-input(:label="$t('common.name')")
					el-input(type="text" v-model="zone.name" :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable size="small")
				el-form-item.electric-form-input(:label="$t('common.farm')")
					el-select(v-model="zone.farmId" :placeholder="$t('common.selectFarm')" size="small")
						el-option(v-for="item in farms" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.status')")
					el-select(v-model="zone.status" :placeholder="$t('admin.zone.selectZoneStatus')" size="small")
						el-option(v-for="item in statusOptions" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.type')")
					el-select(v-model="zone.zoneType.value" :placeholder="$t('admin.zone.selectZoneType')" size="small")
						el-option(v-for="item in typeOptions" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.cultivation')")
					el-select(v-model="zone.cultivationType.value" :placeholder="$t('admin.zone.selectCultivationMethod')" size="small")
						el-option(v-for="item in cultivationOptions" :key="item.value" :label="item.name" :value="item.value")
				el-form-item(:label="$t('common.size')")
					el-row(:gutter="20" type="flex")
						el-col(:span="8")
							el-input(type="number" v-model.trim="zone.zoneSize.value" placeholder="E.g. 100" clearable size="small")
						el-col(:span="16")
							el-select(v-model="zone.zoneSize.unit" :placeholder="$t('admin.zone.selectUnit')" size="small")
								el-option(v-for="item in unitOptions" :key="item.value" :label="item.name" :value="item.value")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('common.create') }}
	.zone-add-tip
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import AvatarUpload from '~/form/AvatarUpload'
import { mapActions, mapState } from 'vuex'
import notice from '@/utils/ui/notice'

@Component({
	components: {
		AvatarUpload
	},
	props: ['id'],
	methods: {
		...mapActions('farm', ['getOwnFarms','getShareAdminFarms']),
		...mapActions('zone', ['get','update','getTypes','getUnits','getCultivations']),
		async loadData() {
			//get zone
			console.log(this.id)
			this.get(this.id).then(e => {
				if(e.success){
					this.zone = e.zone
				}
			})
			//load farms
			this.getOwnFarms().then(e => {
				if(e.success){
					const farms = e.farms
					farms.forEach(farm => {
						const item = {
							name: farm.name,
							value: farm.id
						}
						this.farms.push(item)
					})
				}
			})

			this.getShareAdminFarms().then(e => {
				if(e.success){
					const farms = e.farms
					farms.forEach(farm => {
						const item = {
							name: farm.name,
							value: farm.id
						}
						this.farms.push(item)
					})
				}
			})

			this.getTypes().then(e => {
				if(e.success){
					this.typeOptions = e.types
				}
			})

			this.getUnits().then(e => {
				if(e.success){
					this.unitOptions = e.units
				}
			})

			this.getCultivations().then(e => {
				if(e.success){
					this.cultivationOptions = e.cultivations
				}
			})
		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			statusOptions: [
				{
					name: this.$t('common.enabled'),
					value: true
				},
				{
					name: this.$t('common.disabled'),
					value: false
				},
			],
			typeOptions: [],
			cultivationOptions: [],
			unitOptions: [],
			farms: [],
			isLoading: false,
			zone: {
				name: '',
				farmId: '',
				avatar: '',
				cultivationType: {
					name: '',
					value: 1
				},
				zoneType: {
					name: '',
					value: 1
				},
				zoneSize: {
					name: '',
					value: 100,
					unit: 1
				}
			}
		}
	}
})
export default class zoneAdd extends Vue{	
	submitForm() {
		console.log(this.zone)
		// e.g AA:BB:CC:DD:EE:FF
		if(!this.zone.farmId){
			return notice.warning(this.$t('admin.zone.chooseFarmHint'))
		}
		if(!this.zone.name || this.zone.name.length > 64 || this.zone.name === ''){
			return notice.warning(this.$t('admin.zone.zoneNameHintError'))
		}
		this.zone.name = this.zone.name.toUpperCase()

		this.unitOptions.forEach(unit => {
			if(unit.value === this.zone.zoneSize.unit) {
				this.zone.zoneSize.name = unit.name
			}
		})

		this.cultivationOptions.forEach(cul => {
			if(cul.value === this.zone.cultivationType.value) {
				this.zone.cultivationType.name = cul.name
			}
		})

		this.typeOptions.forEach(type => {
			if(type.value === this.zone.zoneType.value) {
				this.zone.zoneType.name = type.name
			}
		})

		this.isLoading = true
		// this.bulb.showStatus = this.bulb.status ? 'ON' : 'OFF'
		this.update(this.zone).then(e => {
			this.isLoading = false
			if(e.success){
				notice.success(e.message, this.$t('common.info'))
				this.$router.go(-1)
			}else{
				notice.error(e.message, this.$t('common.error'))
			}
		})
	}
}
</script>

<style lang="stylus">
.electric-add-component
	position relative
	height 400px
	overflow-y scroll
	overflow-x hidden
	margin 30px
.zone-add-form
	margin-left auto
	margin-right auto
.zone-add-tip
	font-size .8em
	margin-bottom 20px
	& *
		padding 5px 0
.electric-form-input
	width 86%
</style>
