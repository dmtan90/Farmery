<template lang="pug">
.farm-detail-component
	el-tabs(v-model="activeTab" tab-click="handleTabClick")
		el-tab-pane(:label="$t('admin.farm.info')" name="info")
			el-form.farm-form(:model="farm" label-width="200px" action="" center status-ico)
				el-row(:gutter="20")
					el-col(:xs="24" :md="8")
						avatar-upload.avatar-upload-component(:avatar.sync="farm.avatar" :is-init="false" :disabled="!isOwner")
					el-col(:xs="24" :md="16")
						el-form-item(:label="$t('admin.farm.org')")
							el-select(v-model="farm.orgId" :placeholder="$t('admin.farm.orgHint')" size="small")
								el-option(v-for="(item, index) in orgs" :key="index" :label="item.name" :value="item._id")
						el-form-item(:label="$t('admin.farm.farmName')")
							el-input(v-model="farm.name" type="text" :placeholder="$t('admin.farm.farmNameHint')" clearable @change="existHandle" :disabled="!isOwner" size="small")
						el-form-item(:label="$t('common.status')")
							el-select(v-model="enabled" :placeholder="$t('common.status')" size="small")
								el-option(v-for="item in enabledOptions" :key="item.value" :label="item.label" :value="item.value")
						el-form-item(:label="$t('common.address')")
							customer-address(:value="farm.address" @change="changeAddress" size="medium" hide-map="false" :disabled="!isOwner")
			el-row(:span="24" type="flex" align="middle" justify="center")
				el-button(type="success" @click.native.prevent="handleUpdateFarm" :loading="isLoading" round style="width:150px" :disabled="!isOwner" size="small") {{ $t('common.update') }}	
		el-tab-pane(:label="$t('common.members')" name="member")
			el-row(:gutter="20")
				el-col(:span="3")
					el-button(type="success" icon="el-icon-circle-plus-outline" @click="bindMemberDialogVisible = true" round style="width:100%" :disabled="!isAdmin" size="small")
						| {{ $t('admin.farm.addMembers') }}
			el-table.group-admin-table(:data="users" stripe height="250" v-loading="isLoading" size="small")
				el-table-column(prop="avatar" :label="$t('common.avatar')")
					template(slot-scope="scope")
						el-avatar(:size="64" :src="scope.row.avatar" fit="fill" @error="errorHandler")
							img(src="/img/no-image.png" style="width:100%")
				el-table-column(prop="name" :label="$t('common.name')")
				el-table-column(prop="email" :label="$t('common.email')")
				el-table-column(prop="role" :label="$t('common.role')")
					template(slot-scope="scope")
						el-tag(size="mini")
								|{{ scope.row.role }}
				el-table-column(fixed="right" :label="$t('common.options')" width="100" header-align="center")
					template(slot-scope="scope")
						el-tooltip(:content="$t('common.delete')" placement="top")
							el-button(@click.native.prevent="handleRemoveUser(scope.$index)" type="text" size="medium" :disabled="!isOwner")
								i.el-icon-delete
		el-tab-pane(:label="$t('common.zones')" name="zone")
			el-table.group-admin-table(:data="zones" stripe height="400" v-loading="isLoading" size="small")
				el-table-column(prop="avatar" :label="$t('common.avatar')")
					template(slot-scope="scope")
						el-avatar(:size="64" :src="scope.row.avatar" fit="fill" @error="errorHandler")
							img(src="/img/no-image.png" style="width:100%")
				el-table-column(prop="name" :label="$t('common.name')")
				el-table-column(prop="cultivationType.name" :label="$t('common.avatar')")
				el-table-column(prop="zoneType.name" :label="$t('common.type')")
				el-table-column(prop="zoneSize" :label="$t('common.size')")
					template(slot-scope="scope")
						|{{scope.row.zoneSize.value}} ({{scope.row.zoneSize.name}})
				el-table-column(prop="status" :label="$t('common.enabled')")
					template(slot-scope="scope")
						el-tag(size="mini")
								|{{ scope.row.status ? 'true' : 'false' }}
				el-table-column(:label="$t('common.options')" width="100" header-align="center")
					template(slot-scope="scope")
						el-tooltip(:content="$t('common.view')" placement="top")
							el-button(@click.native.prevent="handleViewZone(scope.$index)" type="text" size="medium")
								i.el-icon-edit-outline
		el-tab-pane(:label="$t('common.crops')" name="crop")
			el-table.group-admin-table(:data="crops" stripe height="400" v-loading="isLoading" size="small")
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
				el-table-column(:label="$t('common.options')" width="100" header-align="center")
					template(slot-scope="scope")
						el-tooltip(:content="$t('common.view')" placement="top")
							el-button(@click.native.prevent="handleViewCrop(scope.$index)" type="text" size="medium")
								i.el-icon-data-line
		el-tab-pane(:label="$t('common.devices')" name="device")
			el-row(:gutter="20")
				el-col(:span="3")
					el-button(type="success" icon="el-icon-circle-plus-outline" @click="bindDeviceDialogVisible = true" round style="width:100%" :disabled="!isAdmin" size="small")
						| {{ $t('admin.farm.bindDevices') }}
			el-table.group-admin-table(:data="farm.devices" stripe height="400" v-loading="isLoading" size="small")
				el-table-column(prop="uid" :label="$t('common.serial')")
				el-table-column(prop="name" :label="$t('common.name')")
				el-table-column(prop="model" :label="$t('common.model')")
					template(slot-scope="scope")
						|{{ getModel(scope.row.model) }}
				el-table-column(prop="ownerId" :label="$t('common.owner')")
				el-table-column(:label="$t('common.options')" width="100" header-align="center")
					template(slot-scope="scope")
						el-tooltip(:content="$t('common.remove')" placement="top")
							el-button(@click.native.prevent="handleUnbindDevice(scope.$index)" type="text" size="medium" :disabled="!checkDevicePermission(scope.row)")
								i.el-icon-delete
	el-dialog(:title="$t('admin.farm.bindDevices')" :visible.sync="bindDeviceDialogVisible" width="30%" @open="handleLoadDevices")
		el-form(v-model="farm.deviceIds" label-width="100px")
			el-form-item(:label="$t('common.devices')")
				el-select(v-model="farm.deviceIds" :placeholder="$t('admin.farm.selectDevices')" size="small" multiple)
					el-option(v-for="item in devices" :key="item.id" :label="item.name" :value="item.id")
		span(slot="footer" class="dialog-footer")
			el-button(@click="bindDeviceDialogVisible = false" size="small") {{ $t('common.cancel') }}
			el-button(type="primary" @click="handleBindDevices" :disabled="isLoading" :loading="isLoading" size="small") {{ $t('common.confirm') }}
	el-dialog(:title="$t('common.inviteMembers')" :visible.sync="bindMemberDialogVisible" width="50%" @open="handleLoadUsers")
		el-form(v-model="farm" label-width="100px")
			el-row
				el-col(:xs="24" :md="12")
					el-form-item(:label="$t('common.admins')")
						el-select(v-if="farm.share !== undefined" v-model="farm.share.adminIds" :placeholder="$t('common.selectAdmins')" size="small" multiple)
							el-option(v-for="item in allUsers.admins" :key="item.email" :label="item.name" :value="item.email")
				el-col(:xs="24" :md="12")
					el-form-item(:label="$t('common.users')")
						el-select(v-if="farm.share !== undefined" v-model="farm.share.userIds" :placeholder="$t('common.selectUsers')" size="small" multiple)
							el-option(v-for="item in allUsers.users" :key="item.email" :label="item.name" :value="item.email")
		span(slot="footer" class="dialog-footer")
			el-button(@click="bindMemberDialogVisible = false" size="small") {{ $t('common.cancel') }}
			el-button(type="primary" @click="handleAddMembers" :disabled="isLoading" :loading="isLoading" size="small") {{ $t('common.confirm') }}
</template>

<script>
import { Component,Vue } from 'vue-property-decorator'
import { mapState, mapActions, mapMutations } from 'vuex'
import AvatarUpload from '~/form/AvatarUpload'
import CustomerAddress from '~/form/CustomerAddress'
import moment from 'moment'
import notice from '@/utils/ui/notice'
@Component({
	props: ['id'],
	components:{
		AvatarUpload,
		CustomerAddress
	},
	computed:{
		...mapState('user',['email'])
	},
	methods:{
		...mapActions({
            'getDevices': 'device/gets',
            'getModels': 'devicemodel/gets',
            'getMembers': 'user/getMembers',
            'getOrgs': 'org/gets',
        }),
		...mapActions('farm',['get', 'update', 'hasExisted']),
		...mapActions('zone',['getZoneByFarm']),
		...mapActions('crop',['getCropByFarm']),
		async loadData() {
			this.getOrgs().then(e => {
	  			this.isLoading = false
	  			if(e.success){
	  				this.orgs = e.orgs
	  			}
	  		})

			this.get(this.id).then(e => {
	  			if(e.success){
					this.farm = e.farm
					this.enabled = (this.farm.enabled ? 'true' : 'false')
					this.generateUsers()
					this.devices = this.farm.devices
					if(this.farm.ownerId === this.email) {
						this.isOwner = true
						this.isAdmin = true
					}
					else {
						if(this.farm.share.adminIds.indexOf(this.email) >= 0){
							this.isAdmin = true
						}

						if(this.farm.share.userIds.indexOf(this.email) >= 0){
							this.isUser = true
						}
					}
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
	  		})

	  		this.getZoneByFarm(this.id).then(e => {
	  			if(e.success) {
	  				this.zones = e.zones
	  			}else {
	  				notice.error(e.message, this.$t('common.error'))
	  			}
	  		})

	  		this.getCropByFarm(this.id).then(e => {
	  			if(e.success) {
	  				this.crops = e.crops
	  			}else {
	  				notice.error(e.message, this.$t('common.error'))
	  			}
	  		})

	  		this.getModels().then(e => {
	  			if(e.success){
	  				this.models = e.models
	  			}
	  		})
		},

		checkDevicePermission(device){
			let permission = false
			if(this.isOwner){
				permission = true
			}
			else if(this.email === device.ownerId){
				permission = true
			}
			return permission
		},

		errorHandler() {
			return true
		},
		
		handleTabClick(index) {

		},

		existHandle(){
			if(!this.farm.name){
				return
			}
			// console.log(1)
			this.isLoading = true
			this.hasExisted(this.farm.name).then(e=>{
				this.isLoading = false
				if(e.success){
					this.hasExistedWithName = e.hasExisted
					e.hasExisted && notice.warning(this.$t('admin.farm.farmNameExistedError'))
				}
			})
		},

		verifyFarm(){
			if(!this.farm.name){
				notice.warning(this.$t('admin.farm.farmNameHintError'))
				return false
			}
			if(this.farm.name.length > 64){
				notice.warning(this.$t('admin.farm.farmNameOverSize'))
				return false
			}
			if(this.farm.address === ''){
				notice.warning(this.$t('admin.farm.addressHintError'))
				return false
			}
			if(this.hasExistedWithName){
				notice.warning(this.$t('admin.farm.farmNameExistedError'))
				return false
			}
			return true
		},

		handleUpdateFarm() {
			if(!this.verifyFarm()){
				return
			}
			this.farm.enabled = (this.enabled === 'true' ? true : false)
			this.update(this.farm).then(e=>{
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
		},

		inviteAdmin() {

		},

		inviteUser() {

		},

		getTime(ms) {
	  		let time = moment(ms).format('MM/DD/YYYY')
	  		return time
	  	},

	  	handleViewZone(index) {

	  	},

	  	handleViewCrop(index) {

	  	},

	  	handleBindDevices() {
	  		let params = {
	  			_id: this.farm._id,
	  			deviceIds: this.farm.deviceIds
	  		}
	  		this.isLoading = true
	  		this.update(params).then(e => {
	  			this.isLoading = false
	  			if(e.success){
	  				this.farm = e.farm
	  				this.bindDeviceDialogVisible = false
	  			}else{
					notice.error(e.message, this.$t('common.error'))
				}
	  		})
	  	},

	  	handleUnbindDevice(index){
	  		this.$delete(this.farm.deviceIds, index)
	  		let params = {
	  			_id: this.farm._id,
	  			deviceIds: this.farm.deviceIds
	  		}
	  		this.isLoading = true
	  		this.update(params).then(e => {
	  			this.isLoading = false
	  			if(e.success){
	  				this.farm = e.farm
	  				this.bindDeviceDialogVisible = false
	  			}else{
					notice.error(e.message, this.$t('common.error'))
				}
	  		})
	  	},

	  	handleAddMembers() {
	  		let params = {
	  			_id: this.farm._id,
	  			share: this.farm.share
	  		}
	  		this.isLoading = true
	  		this.update(params).then(e => {
	  			this.isLoading = false
	  			if(e.success){
	  				this.farm = e.farm
	  				this.generateUsers()
	  				this.bindMemberDialogVisible = false
	  			}else{
					notice.error(e.message, this.$t('common.error'))
				}
	  		})
	  	},

	  	handleLoadDevices() {
	  		this.isLoading = true
	  		this.getDevices().then(e => {
	  			this.isLoading = false
	  			if(e.success){
	  				this.devices = e.devices
	  			}
	  		})
	  	},

	  	handleLoadUsers() {
	  		this.allUsers.admins = []
			this.allUsers.users = []
			this.orgs.forEach(org => {
				if(this.farm.orgId === org._id){
					org.members.admins.forEach(u => {
						this.allUsers.admins.push(u)
					})
					org.members.users.forEach(u => {
						this.allUsers.users.push(u)
					})
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

	  	generateUsers() {
	  		let admins = this.farm.share.admins
			let users = this.farm.share.users
			this.users = []
			admins.forEach(u => {
				u.role = 'admin'
				this.users.push(u)
			})
			users.forEach(u => {
				u.role = 'user'
				this.users.push(u)
			})
	  	},

	  	handleRemoveUser(index){
	  		let fn = this
	  		this.$confirm(this.$t('admin.farm.confirmDeleteUser'), this.$t('common.confirm'),{
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel')
			}).then(e => {
				console.log(e)
				if(e === 'confirm') {
					let user = fn.users[index]
			  		let users = null
			  		if(user.role === 'admin'){
			  			users = fn.farm.share.admins
			  		}
			  		else{
			  			users = fn.farm.share.users
			  		}
			  		
			  		for(let i = 0; i < users.length; i++){
		  				if(users[i]._id === user._id){
		  					users.splice(i, 1)
		  					if(user.role === 'admin'){
					  			fn.farm.share.adminIds.splice(i, 1)
					  		}
					  		else{
					  			fn.farm.share.userIds.splice(i, 1)
					  		}
		  					break
		  				}
		  			}

			  		let params = {
			  			_id: fn.farm._id,
			  			share: fn.farm.share
			  		}
			  		fn.isLoading = true
			  		fn.update(params).then(e => {
			  			fn.isLoading = false
			  			if(e.success){
			  				fn.farm = e.farm
			  				// this.generateUsers()
			  				fn.users.splice(index, 1)
			  			}else{
							notice.error(e.message, fn.$t('common.error'))
						}
			  		})
				}
			}).catch(()=>{})
	  	},

	  	changeAddress(value){
	    	console.log(value)
	    	this.farm.address = {
				country: value.address[0],
	    		city: value.address[1],
				latitude: value.latitude,
				longitude: value.longitude
	    	}
	    }
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			bindDeviceDialogVisible: false,
			bindMemberDialogVisible: false,
			isOwner: false,
			isAdmin: false,
			isUser: false,
			isLoading: false,
			activeTab: 'info',
			farm: {},
			enabled: 'true',
			orgs: [],
			admins: [],
			users: [],
			crops: [],
			zones: [],
			devices: [],
			models: [],
			allUsers: {
				admins: [],
				users: []
			},
			enabledOptions: [
				{
					name: this.$t('common.enabled'),
					value: 'true'
				},
				{
					name: this.$t('common.disabled'),
					value: 'false'
				}
			]
		}
	}
})

export default class FarmDetail extends Vue{
	created(){
	}
}
</script>

<style lang="stylus">
.farm-detail-component
	margin-top 30px
</style>
