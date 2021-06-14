<template lang="pug">
.plant-admin-component
	el-row(:gutter="20")
		el-col(:span="4")
			el-input(type="text" v-model="query.name" :placeHolder="$t('admin.plant.plantNameHint')" size="small")
		el-col(:span="3")
			el-button(type="primary" icon="el-icon-search" @click="searchPlant()" round style="width:100%" size="small")
				| {{ $t('common.search') }}
		el-col(:span="3")
			el-button(type="success" icon="el-icon-circle-plus-outline" @click="$router.push({name:'PlantAdd'})" round style="width:100%" size="small")
				| {{ $t('admin.plant.addPlant') }}
	el-table.group-admin-table(:data="plants" stripe height="400" v-loading="loading" size="small")
		el-table-column(prop="avatar" :label="$t('common.avatar')")
			template(slot-scope="scope")
				el-avatar(:size="64" :src="scope.row.avatar" fit="fill")
					img(src="/img/no-image.png" style="width:100%")
		el-table-column(prop="name" :label="$t('common.name')")
		el-table-column(prop="status" :label="$t('common.status')")
			template(slot-scope="scope")
				el-tag(size="mini")
						|{{ scope.row.status ? $t('common.enabled') : $t('common.disabled') }}
		el-table-column(fixed="right" :label="$t('common.options')" width="230" header-align="center")
			template(slot-scope="scope")
				el-tooltip(:content="$t('common.edit')" placement="top")
					el-button(@click.native.prevent="handleEditPlant(scope.$index)" type="text" size="medium" round)
						i.el-icon-edit-outline
				el-tooltip(:content="$t('common.crops')" placement="top")
					el-button(@click.native.prevent="handleViewCrop(scope.$index)" type="text" size="medium" round)
						i.el-icon-data-line
				el-tooltip(:content="$t('common.delete')" placement="top")
					el-button(@click.native.prevent="deletePlant(scope.$index)" type="text" size="medium" round)
						i.el-icon-delete
	// .when-bulbs-is-null(v-else :span="24" type="flex" align="middle" justify="center")
	//	| You currently do not have your own device
	//	.plant-add(:span="24" type="flex" align="middle" justify="center")
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
		...mapActions('plant',['gets','get','search','delete']),
		async loadData() {
			this.loading = true
	  		this.gets().then(e => {
	  			this.loading = false
	  			if(e.success) {
	  				this.plants = e.plants
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
	  	searchPlant() {
	  		console.log(this.query)
	  		this.loading = true
	  		this.gets(this.query).then(e => {
	  			this.loading = false
	  			if(e.success) {
	  				this.plants = e.plants
	  			}else {
	  				notice.error(e.message, this.$t('common.error'))
	  			}
	  		})
	  	},
	  	handleEditPlant(index) {
	  		this.$router.push({ name:'PlantEdit', params: {id: this.plants[index].id} })
	  	},
	  	handleViewCrop(index) {
	  		this.$router.push({ name:'CropManage', query: {plantId: this.plants[index].id} })
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
			query: {
				name: ''
			},
			plants: []
		}
	}
})
export default class plantAdmin extends Vue{
	deletePlant(index){
		let fn = this
		this.$confirm(this.$t('admin.plant.confirmDeletePlant'), this.$t('common.confirm'),{
			confirmButtonText: this.$t('common.confirm'),
			cancelButtonText: this.$t('common.cancel')
		}).then(e => {
			console.log(e)
			fn.delete(fn.plants[index].id).then(e=>{
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
.plant-admin-component
	margin-top 20px
	padding 0px
	// font-beautify()
.plant-add
	margin-top 50px
.when-bulbs-is-null
	margin 150px auto 50px
.plants-admin-table
	border-radius 5px
	margin-top 20px
</style>
