<template lang="pug">
.crop-admin-component
	el-row(:gutter="10")
		el-col(:xs="12" :sm="6" :md="3")
			el-button-group
				el-tooltip(:content="$t('admin.crop.ganttView')" placement="top")
					el-button(:type="viewMode === 'gantt' ? 'primary' : ''" icon="el-icon-data-line" size="small" @click="changeView('gantt')")
				el-tooltip(:content="$t('admin.crop.tableView')" placement="top")
					el-button(:type="viewMode === 'table' ? 'primary' : ''" icon="el-icon-notebook-2" size="small" @click="changeView('table')")
		el-col(:xs="12" :sm="6" :md="3" v-if="viewMode === 'table'")
			el-input(type="text" v-model="this.query.name" :placeHolder="$t('admin.crop.cropNameHint')" size="small")
		el-col(:xs="12" :sm="6" :md="3" v-if="viewMode === 'table'")
			el-select(v-model="query.farmIds" multiple :placeholder="$t('admin.crop.selectFarms')" size="small")
				el-option(v-for="item in farms" :key="item.id" :label="item.name" :value="item.id")
		el-col(:xs="12" :sm="6" :md="3" v-if="viewMode === 'table'")
			el-select(v-model="query.zoneIds" multiple :placeholder="$t('admin.crop.selectZones')" size="small")
				el-option(v-for="item in zones" :key="item.id" :label="item.name" :value="item.id")
		el-col(:xs="12" :sm="6" :md="3" v-if="viewMode === 'table'")
			el-select(v-model="query.plantIds" multiple :placeholder="$t('admin.crop.selectPlants')" size="small")
				el-option(v-for="item in plants" :key="item.id" :label="item.name" :value="item.id")
		el-col(:xs="24" :sm="24" :md="4" v-if="viewMode === 'table'")
			el-date-picker(v-model="query.time" type="daterange" range-separator="-" :start-placeholder="$t('common.startDate')" :end-placeholder="$t('common.endDate')" size="small" style="width: 100%")
		el-col(:xs="12" :sm="6" :md="2" v-if="viewMode === 'table'")
			el-button(type="primary" icon="el-icon-search" @click="searchCrop()" round style="width:100%" size="small")
				| {{ $t('common.search') }}
		el-col(:xs="12" :sm="6" :md="2")
			el-button(type="success" icon="el-icon-circle-plus-outline" @click="$router.push({name:'CropAdd'})" round style="width:100%" size="small")
				| {{ $t('admin.crop.addCrop') }}
	el-container(v-show="viewMode === 'gantt'" style="margin-top: 10px")
		crop-progress-card()
	el-container(v-show="viewMode === 'table'")
		el-table.crops-admin-table(v-loading="loading" :data="crops" stripe height="450" size="small")
			el-table-column(prop="name" :label="$t('common.name')")
			el-table-column(prop="zone" :label="$t('common.zone')")
				template(slot-scope="scope")
					el-tag(size="mini")
							|{{ scope.row.zone.name }}
			el-table-column(prop="plant" :label="$t('common.plant')")
				template(slot-scope="scope")
					el-tag(size="mini")
							|{{ scope.row.plant.name }}
			el-table-column(prop="size" :label="$t('common.size')")
				template(slot-scope="scope")
					|{{scope.row.size.value}} ({{scope.row.size.unit.name}})
			el-table-column(prop="status" :label="$t('common.status')")
				template(slot-scope="scope")
					el-tag(size="mini")
							|{{ scope.row.status ? $t('common.operating') : $t('common.archived') }}
			el-table-column(prop="startDate" :label="$t('common.startDate')")
				template(slot-scope="scope")
					|{{ getTime(scope.row.startDate) }}
			el-table-column(prop="endDate" :label="$t('common.endDate')")
				template(slot-scope="scope")
					|{{ getTime(scope.row.endDate) }}
			el-table-column(fixed="right" :label="$t('common.options')" width="200" header-align="center")
				template(slot-scope="scope")
					el-tooltip(:content="$t('common.edit')" placement="top")
						el-button(type="text" @click.native.prevent="editCrop(scope.$index)" size="small" round)
							i.el-icon-edit-outline
					el-tooltip(:content="$t('common.archive')" placement="top")
						el-button(type="text" @click.native.prevent="archiveCrop(scope.$index)" size="small" round)
							i.el-icon-receiving
					el-tooltip(:content="$t('common.delete')" placement="top")
						el-button(type="text" @click.native.prevent="deleteCrop(scope.$index)" size="small" round)
							i.el-icon-delete
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState,mapActions } from 'vuex'
import notice from '@/utils/ui/notice'
import moment from 'moment'
import CropProgressCard from '~/widget/CropProgress'

@Component({
	components:{
		CropProgressCard
	},
	computed:{
	
	},
	methods:{
		...mapActions({
            'getFarms': 'farm/gets',
            'getPlants': 'plant/gets',
            'getZones': 'zone/gets',
        }),
		/*...mapActions('farm',['gets']),
		...mapActions('plant',['gets']),
		...mapActions('zone',['gets']),*/
		...mapActions('crop',['gets','get','search','update','delete']),
		async loadData() {
			//get farms
			this.getFarms().then(e => {
				if(e.success){
					this.farms = e.farms
				}
			})

			//get zones
			this.getZones().then(e => {
				if(e.success){
					this.zones = e.zones
				}
			})

			//get plants
			this.getPlants().then(e => {
				if(e.success){
					this.plants = e.plants
				}
			})

			this.gets().then(e => {
				if(e.success){
					this.crops = e.crops
				}
			})
		},
		handleSizeChange(val) {
	    	console.log(`${val} items per page`);
	  	},
	  	handleCurrentChange(val) {
	    	console.log(`current page: ${val}`);
	  	},
	  	searchCrop() {
	  		console.log(this.query)
	  		this.loading = true
	  		this.search(this.query).then(e => {
	  			this.loading = false
	  			if(e.success){
	  				this.crops = e.crops
	  			}
	  		})
	  	},
	  	editCrop(index) {
	  		this.$router.push({ name:'CropEdit', params: {id: this.crops[index].id} })
	  	},
	  	archiveCrop(index) {
	  		let fn = this
	  		this.$confirm(this.$t('admin.crop.confirmArchievedCrop'), this.$t('common.confirm'),{
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel')
			}).then(e => {
				console.log(e)
				const params = fn.crops[index]
				params.status = false
				this.loading = true
				fn.update(params).then(e=>{
					this.loading = false
					if(e.success){
						fn.crops[index] = e.crop
						notice.success(e.message,'success')
						//this.searchCrop()
					}else{
						notice.error(e.message,'error')
					}
				})
			}).catch(()=>{})
	  	},
	  	getTime(ms) {
	  		let time = moment(ms).format('MM/DD/YYYY')
	  		return time
	  	},
	  	changeView(view){
	  		this.viewMode = view
	  	}
	},
	mounted() {
		const zoneId = this.$route.query.zoneId
		const plantId = this.$route.query.plantId
		if(zoneId !== undefined) {
			this.query.zoneIds = [zoneId]
		}

		if(plantId !== undefined) {
			this.query.plantIds = [plantId]
		}

		this.loadData()
	},
	data() {
		return {
			loading: false,
			totalDevice: 100,
			currentPage: 5,
			viewMode: 'gantt',
			farms: [],
			zones: [],
			plants: [],
			crops: [],
			query: {
				name: '',
				farmIds: [],
				zoneIds: [],
				plantIds: [],
				time: '',
				startTime: 0,
				endTime: 0
			}
		}
	}
})
export default class cropAdmin extends Vue{
	deleteCrop(index){
		let fn = this
		this.$confirm(this.$t('admin.crop.confirmDeleteCrop'), this.$t('common.confirm'),{
			confirmButtonText: this.$t('common.confirm'),
			cancelButtonText: this.$t('common.cancel')
		}).then(e => {
			console.log(e)
			fn.loading = true
			fn.delete(fn.crops[index].id).then(e=>{
				fn.loading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		}).catch(()=>{})
	}
}
</script>

<style lang="stylus">
.crop-admin-component
	margin-top 20px
	padding 0px
	// font-beautify()
.crop-add
	margin-top 50px
.when-bulbs-is-null
	margin 150px auto 50px
.crops-admin-table
	border-radius 5px
	margin-top 20px
</style>
