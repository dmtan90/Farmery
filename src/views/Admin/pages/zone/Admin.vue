<template lang="pug">
.zone-admin-component
	el-row(:gutter="20")
		el-col(:span="4")
			el-input(type="text" v-model="query.name" :placeHolder="$t('admin.zone.inputZoneNameHint')" size="small")
		el-col(:span="4")
			el-select(v-model="query.farmIds" multiple :placeholder="$t('common.selectFarms')" size="small")
				el-option(v-for="item in farms" :key="item.id" :label="item.name" :value="item.id")
		el-col(:span="3")
			el-button(type="primary" icon="el-icon-search" @click="searchZone()" round style="width:100%" size="small")
				| {{ $t('common.search') }}
		el-col(:span="3")
			el-button(type="success" icon="el-icon-circle-plus-outline" @click="$router.push({name:'ZoneAdd'})" round style="width:100%" size="small")
				| {{ $t('admin.zone.addZone') }}
	el-table.group-admin-table(:data="zones" stripe height="400" v-loading="loading" size="small")
		el-table-column(prop="avatar" :label="$t('common.avatar')")
			template(slot-scope="scope")
				el-avatar(:size="64" :src="scope.row.avatar" fit="fill")
					img(src="/img/no-image.png" style="width:100%")
		el-table-column(prop="name" :label="$t('common.name')")
		el-table-column(prop="cultivationType.name" :label="$t('common.cultivation')")
		el-table-column(prop="zoneType.name" :label="$t('common.type')")
		el-table-column(prop="zoneSize" :label="$t('common.size')")
			template(slot-scope="scope")
				|{{scope.row.zoneSize.value}} ({{scope.row.zoneSize.name}})
		el-table-column(prop="status" :label="$t('common.status')")
			template(slot-scope="scope")
				el-tag(size="mini")
						|{{ scope.row.status ? $t('common.enabled') : $t('common.disabled') }}
		el-table-column(fixed="right" :label="$t('common.options')" width="230" header-align="center")
			template(slot-scope="scope")
				el-tooltip(:content="$t('common.edit')" placement="top")
					el-button(@click.native.prevent="handleEditZone(scope.$index)" type="text" size="medium" round)
						i.el-icon-edit-outline
				el-tooltip(:content="$t('common.crops')" placement="top")
					el-button(@click.native.prevent="handleViewCrop(scope.$index)" type="text" size="medium" round)
						i.el-icon-data-line
				el-tooltip(:content="$t('common.delete')" placement="top")
					el-button(@click.native.prevent="deleteZone(scope.$index)" type="text" size="medium" round)
						i.el-icon-delete
	// .when-bulbs-is-null(v-else :span="24" type="flex" align="middle" justify="center")
	//	| You currently do not have your own device
	//	.zone-add(:span="24" type="flex" align="middle" justify="center")
	//		el-button(type="success" @click.native.prevent="$router.push({name:'DeviceAdd'})" round) Add Device
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState,mapActions } from 'vuex'
import notice from '@/utils/ui/notice'

@Component({
	computed:{
		...mapState('user',['email'])
	},
	methods:{
		...mapActions({
            'getFarms': 'farm/gets',
        }),
		...mapActions('zone',['gets','get','search','delete']),
		async loadData() {
			//get farms
			this.loading = true
			this.getFarms().then(e => {
				if(e.success){
					this.farms = e.farms
				}
			})

	  		this.gets().then(e => {
	  			this.loading = false
	  			if(e.success) {
	  				this.zones = e.zones
	  			}else {
	  				notice.error(e.message, this.$t('common.error'))
	  			}
	  		})
		},
		handleSizeChange(val) {
	    	console.log(`${val} items per page`);
	  	},
	  	handleCurrentChange(val) {
	    	console.log(`current page: ${val}`);
	  	},
	  	searchZone() {
	  		this.search(this.query).then(e => {
	  			if(e.success) {
	  				this.zones = e.zones
	  			}else {
	  				notice.error(e.message, this.$t('common.error'))
	  			}
	  		})
	  	},
	  	handleEditZone(index) {
	  		this.$router.push({ name:'ZoneEdit', params: {id: this.zones[index].id} })
	  	},
	  	handleViewCrop(index) {
	  		this.$router.push({ name:'CropManage', params: {zoneId: this.zones[index].id} })
	  	}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			loading: false,
			totalZone: 100,
			currentPage: 5,
			farms: [],
			query: {
				name: '',
				farmIds: []
			},
			zones: []
		}
	}
})
export default class zoneAdmin extends Vue{
	deleteZone(index){
		let fn = this
		this.$confirm(this.$t('admin.zone.confirmDeleteZone'), this.$t('common.confirm'),{
			confirmButtonText: this.$t('common.confirm'),
			cancelButtonText: this.$t('common.cancel')
		}).then(e => {
			console.log(e)
			fn.delete(fn.zones[index].id).then(e=>{
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
.zone-admin-component
	margin-top 20px
	padding 0px
	// font-beautify()
.zone-add
	margin-top 50px
.when-bulbs-is-null
	margin 150px auto 50px
.zones-admin-table
	border-radius 5px
	margin-top 20px
</style>
