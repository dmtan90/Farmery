<template lang="pug">
.farm-admin-component
	el-row(:gutter="20" style="margin-bottom: 20px")
		el-col(:span="24" style="display:flex")
			el-button-group(style="width:100px")
				el-tooltip(:content="$t('admin.device.tableView')" placement="top")
					el-button(icon="el-icon-notebook-2" :type="activeView === 'table' ? 'primary' : ''" size="small" @click="handleChangeView('table')")
				el-tooltip(:content="$t('admin.device.mapsView')" placement="top")
					el-button(icon="el-icon-map-location" :type="activeView === 'maps' ? 'primary' : ''" size="small" @click="handleChangeView('maps')")
			el-input(type="text" v-model="query.name" :placeholder="$t('common.upTo64Chars')" maxlength="64" size="small" style="width:200px; margin-left:10px")
			el-select(v-model="query.roles" multiple :placeholder="$t('common.selectRole')" size="small" style="width:200px; margin-left:10px")
				el-option(v-for="(item, index) in roleOptions" :key="index" :label="item.name" :value="item.id")
			el-button(type="primary" icon="el-icon-search" @click="searchFarm()" round style="width:100px;margin-left:10px" size="small")
				| {{ $t('common.search') }}
			el-button(type="success" icon="el-icon-circle-plus-outline" @click="$router.push({name:'FarmAdd'})" round style="width:100px; margin-left:10px" size="small")
				| {{ $t('admin.farm.addFarm') }}
	div(v-show="activeView === 'table'")
		el-table.farm-admin-table(:data="farms" stripe height="450" v-loading="loading" size="small")
			el-table-column(prop="avatar" :label="$t('common.avatar')")
				template(slot-scope="scope")
					el-avatar(:size="64" :src="scope.row.avatar" fit="fill" @error="errorHandler")
						img(src="/img/no-image.png" style="width:100%")
			el-table-column(prop="name" :label="$t('common.name')")
			el-table-column(prop="address.city" :label="$t('common.address')")
			el-table-column(prop="ownerId" :label="$t('common.owner')")
				template(slot-scope="scope")
					el-tag(size="mini")
						|{{ scope.row.ownerId }}
			el-table-column(prop="share.admins" :label="$t('common.admins')")
				template(slot-scope="scope")
					el-tag(v-for="(tag, index) in scope.row.share.admins" size="mini" :key="index")
						|{{ tag.name }}
			el-table-column(prop="share.users" :label="$t('common.users')")
				template(slot-scope="scope")
					el-tag(v-for="(tag, index) in scope.row.share.users" size="mini" :key="index")
						|{{ tag.name }}
			el-table-column(prop="enabled" :label="$t('common.enabled')")
				template(slot-scope="scope")
					el-tag(size="mini")
						|{{ scope.row.enabled ? 'true' : 'false' }}
			el-table-column(fixed="right" :label="$t('common.options')" width="100" header-align="center")
				template(slot-scope="scope")
					el-tooltip(:content="$t('common.edit')" placement="top")
						el-button(@click.native.prevent="handleViewFarm(scope.$index)" type="text" size="medium" round)
							i.el-icon-edit-outline
					// el-button(@click.native.prevent="handleRenameFarm(scope.$index)" type="success" size="mini") Invite
					// el-button(@click.native.prevent="handleDeleteFarm(scope.$index)" type="danger" size="mini" round) Delete
	div(v-show="activeView === 'maps'")
		div(ref="choicemap" class="map")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState,mapActions } from 'vuex'
import notice from '@/utils/ui/notice'
import { getGoogleMap } from '@/utils/global'
import { MessageBox } from 'element-ui'

@Component({
	computed:{
	
	},
	methods:{
		...mapActions('farm',['get','gets','search','invite','update','delete']),
		loadData(){
			this.initGmap()
			this.gets().then(e => {
				if(e.success){
					this.farms = e.farms
					for(let i = 0; i < this.markers.length; i++){
						let marker = this.markers[i]
						marker.setMap(null)
					}
					this.markers = []
					if(this.map !== undefined){
						this.farms.forEach(farm => {
							this.addMarker(farm)
						})
					}
				}
			})
		},
		handleSizeChange(val) {
	    	console.log(`${val} items per page`);
	  	},
	  	handleCurrentChange(val) {
	    	console.log(`current page: ${val}`);
	  	},
	  	searchFarm() {
	  		console.log(this.query)
	  		const fn = this
	  		this.loading = true
	  		this.gets(this.query).then(e => {
	  			fn.loading = false
	  			if(e.success){
					notice.success(e.message, this.$t('common.info'))
					fn.farms = e.farms
					for(let i = 0; i < fn.markers.length; i++){
						let marker = fn.markers[i]
						marker.setMap(null)
					}
					fn.markers = []
					if(fn.map !== undefined){
						fn.farms.forEach(farm => {
							fn.addMarker(farm)
						})
					}
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
	  		})
	  	},
	  	handleViewFarm(index) {
	  		this.$router.push({name:'FarmView', params: {id: this.farms[index].id}})
	  	},
	  	handleChangeView(view){
	  		this.activeView = view
	  		if(view === 'maps'){

	  		} else {

	  		}
	  	},
	  	initGmap(){
	  		let fn = this
		    getGoogleMap()
			    .then(() => {
			        const point = { lat: 10.774362, lng: 106.6684306 }
			        var map = new GMap.maps.Map(fn.$refs.choicemap, {
			        	zoom: 10,
			        	center: point
			        })
			        fn.map = map
		    	})
	  	},
	  	addMarker(farm){
	  		if(farm.address && farm.address.latitude !== 0 && farm.address.longitude !== 0){
	  			let fn = this
	  			let point = { lat: farm.address.latitude, lng: farm.address.longitude }
		  		fn.map.setCenter(point)
		  		var marker = new GMap.maps.Marker({
		  			map: fn.map,
		  			position: point,
		  			title: farm.name,
		  			draggable: true,
		  			animation: GMap.maps.Animation.DROP,
		  			farm: farm,
		  			id: farm.id
			    })

			    // marker.setValues({farm: farm})
			    const latlng = farm.address.latitude + ',' + farm.address.longitude
			    const contentString =
					'<div id="content">' +
					'<div id="siteNotice">' +
					'</div>' +
					'<h3 id="firstHeading" class="firstHeading">' + farm.name + '</h3>' +
					'<div id="bodyContent">' +
					'<p>' + this.$t('common.city') + ': '+ farm.address.city +'</p>' +
					'<p>' + this.$t('common.country') + ': '+ farm.address.country +'</p>' +
					'<p>' + this.$t('common.organization') + ': '+ (farm.org ? farm.org.name : 'None') +'</p>' +
					'<div class="view-link"> <a target="_blank" jstcache="6" href="https://maps.google.com/maps?' + latlng + '&amp;z=12&amp;t=m&amp;hl=en-US&amp;gl=US&amp;mapclient=apiv3&amp;cid=8622579495958406782"> <span> View on Google Maps </span> </a> </div>' +
					'</div>' +
					'</div>'
				const infowindow = new GMap.maps.InfoWindow({
					content: contentString,
				})

				marker.addListener("click", () => {
		  			infowindow.open(fn.map, marker)
		  		})

		  		marker.addListener("dragend", (e) => {
		  			let farm = marker.get('farm')
		  			console.log(farm)
					fn.$confirm(this.$t('admin.device.confirmUpdateFarmLocation', farm.name),
						this.$t('common.confirm'), {
							confirmButtonText: this.$t('common.ok'),
							cancelButtonText: this.$t('common.cancel'),
							type: "warning"
						}).then(e => {
							farm.address.latitude = marker.getPosition().lat()
							farm.address.longitude = marker.getPosition().lng()

							fn.update(farm).then(e=>{
								if(e.success){
									notice.success(e.message, this.$t('common.info'))
								}else{
									notice.error(e.message, this.$t('common.error'))
								}
							})
						}).catch(e => {
							let point = { lat: farm.address.latitude, lng: farm.address.longitude }
							marker.setPosition(point)
						})
		  		})
		  		fn.markers.push(marker)
	  		}
	  	},
	  	generateAddress(address){
	  		return address.city + ', ' + address.country
	  	}
	},
	data() {
		return {
			loading: false,
			totalfarm: 100,
			currentPage: 5,
			activeView: 'table',
			farms: [],
			markers: [],
			map: null,
			query: {
				name: '',
				roles: []
			},
			roleOptions: [
				{
					name: this.$t('common.owner'),
					value: 'owner'
				},
				{
					name: this.$t('common.admin'),
					value: 'admin'
				},
				{
					name: this.$t('common.user'),
					value: 'user'
				}
			]
		}
	},
	mounted() {
	    this.loadData()
	},
})
export default class ElectricAdmin extends Vue{
	errorHandler() {
		return true
	}
	handleDeleteFarm(index){
		let fn = this
		const farmId = fn.farms[index].id
		this.$confirm(this.$t('admin.device.confirmDeleteFarm'), this.$t('common.confirm'),{
			confirmButtonText: this.$t('common.confirm'),
			cancelButtonText: this.$t('common.cancel')
		}).then(e => {
			console.log(e)
			fn.delete(farmId).then(e=>{
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					fn.loadData()
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		}).catch(()=>{})
	}
}
</script>

<style lang="stylus">
.farm-admin-component
	margin-top 20px
	padding 0px
	.map
		height 500px
	// font-beautify()
.farm-add
	margin-top 50px
.farm-admin-table
	border-radius 5px
	margin-top 20px
</style>
