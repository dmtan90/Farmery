<template lang="pug">
.device-admin-component
	el-tabs(v-model="activeTab" tab-click="handleTabClick")
		el-tab-pane(:label="$t('common.devices')" name="devices")
			el-row(:gutter="20" style="display:flex")
				el-col(:span="24")
					el-button-group(style="width:150px")
						el-tooltip(:content="$t('admin.device.controlView')" placement="top")
							el-button(icon="el-icon-set-up" :type="activeView === 'control' ? 'primary' : ''" size="small" @click="handleChangeView('control')")
						el-tooltip(:content="$t('admin.device.tableView')" placement="top")
							el-button(icon="el-icon-notebook-2" :type="activeView === 'table' ? 'primary' : ''" size="small" @click="handleChangeView('table')")
						el-tooltip(:content="$t('admin.device.mapsView')" placement="top")
							el-button(icon="el-icon-map-location" :type="activeView === 'maps' ? 'primary' : ''" size="small" @click="handleChangeView('maps')")
					el-input(type="text" v-model="query.name" :placeHolder="$t('admin.device.deviceNameHint')" size="small" style="width: 200px; margin-left:10px")
					el-button(type="primary" icon="el-icon-search" @click="searchDevice()" round style="width:100px;margin-left:10px" size="small")
						| {{ $t('common.search') }}
					el-button(type="success" icon="el-icon-circle-plus-outline" @click="$router.push({name:'DeviceAdd'})" round style="width:100px;margin-left:10px" size="small")
						| {{ $t('admin.device.addDevice') }}
			div(v-show="activeView === 'control'")
				device-card()
			div(v-show="activeView === 'table'")
				el-table.devices-admin-table(:data="devices" stripe height="450" size="small" v-loading="loading")
					el-table-column(prop="uid" :label="$t('common.id')")
					el-table-column(prop="name" :label="$t('common.name')")
					el-table-column(prop="ownerId" :label="$t('common.owner')")
					el-table-column(prop="model" :label="$t('common.model')")
						template(slot-scope="scope")
							|{{ getModel(scope.row.model) }}
					el-table-column(prop="status" :label="$t('common.enabled')")
						template(slot-scope="scope")
							el-tag(size="mini")
								|{{ scope.row.status ? 'true' : 'false' }}
					el-table-column(fixed="right" :label="$t('common.options')" width="300" header-align="center")
						template(slot-scope="scope")
							el-tooltip(:content="$t('common.setting')" placement="top")
								el-button(type="text" :disabled="!isOwnerOrAdmin(scope.row)" @click.native.prevent="settingDevice(scope.$index)" size="medium" round icon="el-icon-setting")
							el-tooltip(:content="$t('common.share')" placement="top")
								el-button(type="text" :disabled="!isOwner(scope.row)" @click.native.prevent="openShareDevice(scope.$index)" size="medium" round icon="el-icon-share")
							el-tooltip(:content="$t('common.edit')" placement="top")
								el-button(type="text" :disabled="!isOwner(scope.row)" @click.native.prevent="editDevice(scope.$index)" size="medium" round icon="el-icon-edit-outline")
							el-tooltip(:content="$t('common.delete')" placement="top")
								el-button(type="text" :disabled="!isOwner(scope.row)" @click.native.prevent="deleteDevice(scope.$index)" size="medium" round icon="el-icon-delete")
			div(v-show="activeView === 'maps'")
				div(ref="choicemap" class="map" v-loading="loading")
		el-tab-pane(:label="$t('common.models')" name="models")
			el-row(:gutter="20")
				el-col(:span="4")
					el-input(type="text" v-model="query.name" :placeHolder="$t('common.deviceModelNameHint')" size="small")
				el-col(:span="3")
					el-button(type="primary" icon="el-icon-search" @click="searchDeviceModel()" round style="width:100%" size="small")
						| {{ $t('common.search') }}
				el-col(:span="3")
					el-button(type="success" icon="el-icon-circle-plus-outline" @click="$router.push({name:'DeviceModelAdd'})" round style="width:100%" size="small" :disabled="!isAdmin")
						|Add Model
			el-table.devices-admin-table(:data="models" stripe height="450" size="small")
				el-table-column(prop="avatar" :label="$t('common.avatar')")
					template(slot-scope="scope")
						el-avatar(:size="64" :src="scope.row.avatar" fit="fill")
							img(src="/img/no-image.png" style="width:100%")
				el-table-column(prop="uid" :label="$t('common.id')" width="50")
				el-table-column(prop="name" :label="$t('common.name')" width="200")
				el-table-column(prop="sensors" :label="$t('common.sensors')")
					template(slot-scope="scope")
						el-tag.tag-micro(v-for="(sensor,index) in scope.row.sensors" :key="index" size="mini")
							|{{ sensor.name }}
				el-table-column(prop="relays" :label="$t('common.relays')")
					template(slot-scope="scope")
						el-tag.tag-micro(v-for="(relay,index) in scope.row.relays" :key="index" size="mini")
							|{{ relay.name }}
				el-table-column(prop="status" :label="$t('common.enabled')" width="100")
					template(slot-scope="scope")
						el-tag(size="mini")
							|{{ scope.row.status ? 'true' : 'false' }}
				el-table-column(prop="dataFormat" :label="$t('admin.device.dataFormat')" width="200")
				el-table-column(fixed="right" :label="$t('common.options')" width="150" header-align="center")
					template(slot-scope="scope")
						el-tooltip(:content="$t('common.edit')" placement="top")
							el-button(type="text" @click.native.prevent="editDeviceModel(scope.$index)" size="small" round :disabled="!isAdmin" icon="el-icon-edit-outline")
						el-tooltip(:content="$t('common.delete')" placement="top")
							el-button(type="text" @click.native.prevent="deleteDeviceModel(scope.$index)" size="small" round :disabled="!isAdmin" icon="el-icon-delete")
	el-dialog(:title="deviceName" :visible.sync="seetingDeviceDialogVisible" width="60%")
		device-setting(:id="deviceId")
		span(slot="footer" class="dialog-footer")
			el-button(size="small" round @click="seetingDeviceDialogVisible = false") {{ $t('common.cancel') }}
	el-dialog(:title="deviceName" :visible.sync="shareDeviceDialogVisible" width="40%")
		el-form(v-if="shareDevice" :model="shareDevice" label-width="150px"  center status-ico)
			el-form-item(:label="$t('admin.device.deviceId')")
				el-input(type="text" v-model.trim="shareDevice.uid" :placeholder="$t('admin.device.deviceIdHint')" clearable size="small" :disabled="true")
			el-form-item(:label="$t('common.admins')")
				el-input(type="textarea" v-model.trim="shareDevice.adminStrIds" :placeholder="$t('admin.device.shareEmailAdminHint')" clearable size="small")
			el-form-item(:label="$t('common.users')")
				el-input(type="textarea" v-model.trim="shareDevice.userStrIds" :placeholder="$t('admin.device.shareEmailUserHint')" clearable size="small")
			.device-share-tip
				h3.device-share-tip-title: | {{ $t('admin.device.tips2.title') }}
				el-row
					| {{ $t('admin.device.tips2.contents[0]') }}
				el-row
					| {{ $t('admin.device.tips2.contents[1]') }}
				el-row
					| {{ $t('admin.device.tips2.contents[2]') }}
				el-row
					| {{ $t('admin.device.tips2.contents[3]') }}
		span(slot="footer" class="dialog-footer")
			el-button(size="small" @click="shareDeviceDialogVisible = false") {{ $t('common.cancel') }}
			el-button(size="small" type="primary" @click="handleUpdateDevice()") {{ $t('common.share') }}
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState,mapActions } from 'vuex'
import notice from '@/utils/ui/notice'
import DeviceSetting from './Setting'
import DeviceCard from '~/widget/Device'
import { getGoogleMap, parseTime } from '@/utils/global'


@Component({
	components:{
		DeviceSetting,
		DeviceCard
	},
	computed:{
		...mapState('user',['role', 'email'])
	},
	methods:{
		...mapActions({
			'getModels': 'devicemodel/gets',
			'deleteModel': 'devicemodel/delete'
		}),
		...mapActions('device',['gets','delete','update']),
		loadData(){
			this.loading = true
			this.initGmap()
			this.getModels().then(e => {
				if(e.success){
					this.models = e.models
				}

				this.gets().then(e => {
					this.loading = false
					if(e.success){
						this.devices = e.devices
						for(let i = 0; i < this.markers.length; i++){
							let marker = this.markers[i]
							marker.setMap(null)
						}
						this.markers = []
						if(this.map !== undefined){
							this.devices.forEach(device => {
								this.addMarker(device)
							})
						}
					}
				})
			})

			if(this.role === 0){
				this.isAdmin = true
			}
		},
		handleSizeChange(val) {
	    	console.log(`${val} items per page`);
	  	},
	  	handleCurrentChange(val) {
	    	console.log(`current page: ${val}`);
	  	},
	  	searchDevice() {
	  		//console.log(this.searchVal)
	  		this.gets(this.query).then(e => {
				if(e.success){
					this.devices = e.devices
				}
			})
	  	},
	  	getModel(val){
	  		let model = 'Unknown'
	  		if(this.models){
	  			this.models.forEach(m => {
		  			if(m.uid === val){
		  				model = m.name
		  			}
		  		})
	  		}
	  		return model
	  	},
	  	editDevice(index) {
	  		this.$router.push({ name:'DeviceEdit', params: {id: this.devices[index].id} })
	  	},
	  	deleteDevice(index) {
	  		let fn = this
	  		this.$confirm(this.$t('admin.device.confirmDeleteDevice'), this.$t('common.confirm'),{
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel')
			}).then(e => {
				console.log(e)
				fn.delete(fn.devices[index].id).then(e=>{
					if(e.success){
						notice.success(e.message, this.$t('common.info'))
						fn.searchDevice()
					}else{
						notice.error(e.message, this.$t('common.error'))
					}
				})
			}).catch(()=>{})
	  	},
	  	editDeviceModel(index) {
	  		this.$router.push({ name:'DeviceModelEdit', params: {id: this.models[index].id} })
	  	},
	  	deleteDeviceModel(index) {
	  		let fn = this
	  		this.$confirm(this.$t('admin.device.confirmDeleteModel'), this.this.$t('common.confirm'),{
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel')
			}).then(e => {
				console.log(e)
				fn.deleteModel(fn.models[index].id).then(e=>{
					if(e.success){
						notice.success(e.message, this.$t('common.info'))
						fn.loadData()
					}else{
						notice.error(e.message, this.$t('common.error'))
					}
				})
			}).catch(()=>{})
	  	},
	  	settingDevice(index) {
	  		this.deviceId = this.devices[index]._id
	  		this.deviceName = this.devices[index].name
	  		this.seetingDeviceDialogVisible = true
	  	},
	  	openShareDevice(index) {
	  		const device = this.devices[index]
	  		this.shareDevice = {
	  			_id: device._id,
	  			uid: device.uid,
	  			share: device.share,
	  			adminStrIds: device.share.adminIds.join(';'),
	  			userStrIds: device.share.userIds.join(';')
	  		}
	  		
	  		// this.deviceId = this.devices[index]._id
	  		this.deviceName = device.name
	  		this.shareDeviceDialogVisible = true
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
	  	addMarker(device){
	  		if(device.location && device.location.latitude !== 0 && device.location.longitude !== 0){
	  			let fn = this
	  			let point = { lat: device.location.latitude, lng: device.location.longitude }
		  		fn.map.setCenter(point)
		  		var marker = new GMap.maps.Marker({
		  			map: fn.map,
		  			position: point,
		  			title: device.name,
		  			draggable: true,
		  			animation: GMap.maps.Animation.DROP,
		  			device: device,
		  			id: device.id
			    })

			    // marker.setValues({farm: farm})
			    const latlng = device.location.latitude + ',' + device.location.longitude
			    const contentString =
					'<div id="content">' +
					'<div id="siteNotice">' +
					'</div>' +
					'<h3 id="firstHeading" class="firstHeading">' + device.name + '</h3>' +
					'<div id="bodyContent">' +
					'<p>' + this.$t('admin.device.uid') + ': '+ device.uid +'</p>' +
					'<p>' + this.$t('common.owner') + ': '+ device.ownerId + '</p>' +
					'<p>' + this.$t('admin.device.lastUpdate') + ': '+ parseTime(device.meta.updatedAt) +'</p>' +
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
		  			let device = marker.get('device')
		  			console.log(device)
					fn.$confirm(this.$t('admin.device.confirmUpdateDeviceLocation', device.name),
						this.$t('common.confirm'), {
							confirmButtonText: this.$t('common.ok'),
							cancelButtonText: this.$t('common.cancel'),
							type: 'warning'
						}).then(e => {
							device.location.latitude = marker.getPosition().lat()
							device.location.longitude = marker.getPosition().lng()

							const params = {
								_id: device._id,
								location: device.location
							}

							fn.update(params).then(e=>{
								if(e.success){
									notice.success(e.message, this.$t('common.success'))
								}else{
									notice.error(e.message, this.$t('common.error'))
								}
							})
						}).catch(e => {
							let point = { lat: device.location.latitude, lng: device.location.longitude }
							marker.setPosition(point)
						})
		  		})
		  		fn.markers.push(marker)
	  		}
	  	},
	  	isOwnerOrAdmin(device){
	  		if(device && (device.ownerId === this.email || device.share.adminIds.indexOf(this.email) >= 0)){
	  			return true
	  		}
	  		return false
	  	},
	  	isOwner(device){
	  		if(device && device.ownerId === this.email){
	  			return true
	  		}
	  		return false
	  	},
	  	handleUpdateDevice(){
	  		let adminIds = this.shareDevice.adminStrIds.trim().split(';')
	  		let userIds = this.shareDevice.userStrIds.trim().split(';')
	  		let params = {
	  			_id: this.shareDevice._id,
	  			share: {
	  				adminIds: adminIds,
	  				userIds: userIds
	  			}
	  		}
	  		this.update(params).then(e => {
	  			if(e.success){
	  				this.loadData()
	  				this.shareDeviceDialogVisible = false
	  			}
	  			else{
	  				notice.error(e.message, this.$t('common.error'))
	  			}
	  		})
	  	}
	},
	mounted(){
		this.loadData()
	},
	data() {
		return {
			totalDevice: 100,
			currentPage: 5,
			activeTab: 'devices',
			devices: [],
			models: [],
			isAdmin: false,
			deviceId: '',
			deviceName: '',
			shareDevice: null,
			seetingDeviceDialogVisible: false,
			shareDeviceDialogVisible: false,
			activeView: 'control',
			loading: true,
			markers: [],
			map: null,
			query: {
				name: ''
			}
		}
	}
})
export default class deviceAdmin extends Vue{
	
}
</script>

<style lang="stylus">
.device-admin-component
	margin-top 20px
	padding 0px
	.map
		height 500px
		margin-top 20px
	.device-card-component
		margin-left -20px
		box-shadow none
.device-add
	margin-top 50px
.devices-admin-table
	border-radius 5px
	margin-top 20px
.tag-micro
	font-size 8px !important
</style>
