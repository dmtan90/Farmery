<template lang="pug">
.org-admin-component
	el-row(:gutter="20")
		el-col(:span="4")
			el-input(type="text" v-model="query.name" :placeHolder="$t('admin.org.inputOrgNameHint')" size="small")
		el-col(:span="3")
			el-button(type="primary" icon="el-icon-search" @click="searchOrg()" round style="width:100%" size="small")
				| {{ $t('common.search') }}
		el-col(:span="3")
			el-button(type="success" icon="el-icon-circle-plus-outline" @click="openAddOrgDialog()" round style="width:100%" size="small")
				| {{ $t('admin.org.addOrg') }}
		el-col(:span="3")
			el-button(type="success" icon="el-icon-circle-plus-outline" @click="$router.push({name:'OrgAddMember'})" round style="width:100%" size="small")
				| {{ $t('admin.org.addMember') }}
	el-container(style="border: 1px solid #eee; margin-top: 20px")
		el-aside.hidden-sm-and-down(width="200px" v-loading="loading" style="border-right: 1px solid #eee; padding: 20px")
			el-tree(:data="trees"
			  node-key="id"
			  default-expand-all
			  @node-drop="handleDrop"
			  draggable)
		el-container()
			el-table.group-admin-table(:data="orgs" stripe height="400" v-loading="loading" size="small")
				el-table-column(type="expand")
					template(slot-scope="scope")
						h4 {{ $t('common.members') }}
						el-table.group-admin-table(:data="scope.row.users" stripe size="mini")
							el-table-column(prop="avatar" :label="$t('common.avatar')")
								template(slot-scope="scope1")
									el-avatar(:size="48" :src="scope1.row.avatar" fit="fill" @error="errorHandler")
										img(src="/img/no-image.png" style="width:100%")
							el-table-column(prop="name" :label="$t('common.name')")
							el-table-column(prop="email" :label="$t('common.email')")
							el-table-column(prop="role" :label="$t('common.role')")
								template(slot-scope="scope1")
									el-tag(size="mini")
										| {{ getOrgRole(scope1.row.role) }}
							el-table-column(:label="$t('common.options')" width="150" header-align="center")
								template(slot-scope="scope1")
									el-tooltip(v-if="scope1.row.role > -1" :content="$t('admin.org.switchRole')" placement="top")
										el-button(@click.native.prevent="handleSwitchRole(scope.$index, scope1.$index, scope1.row.role)" type="text" size="small" round :disabled="!isOwner(scope.$index)")
											i.el-icon-refresh
									el-tooltip(v-if="scope1.row.role > -1" :content="$t('common.remove')" placement="top")
										el-button(@click.native.prevent="handleRemoveMember(scope.$index, scope1.$index, scope1.row.role)" type="text" size="small" round :disabled="!isOwner(scope.$index)")
											i.el-icon-close
						h4(style="margin-top: 20px") {{ $t('common.farms') }}
						el-table.group-admin-table(:data="scope.row.members.farms" stripe size="mini")
							el-table-column(prop="avatar" :label="$t('common.avatar')")
								template(slot-scope="scope1")
									el-avatar(:size="48" :src="scope1.row.avatar" fit="fill" @error="errorHandler")
										img(src="/img/no-image.png" style="width:100%")
							el-table-column(prop="name" :label="$t('common.name')")
							el-table-column(prop="address" :label="$t('common.address')")
								template(slot-scope="scope1")
									| {{ getAddress(scope1.row.address) }}
							el-table-column(:label="$t('common.options')" width="100" header-align="center")
								template(slot-scope="scope1")
									el-tooltip(:content="$t('common.detail')" placement="top")
										el-button(@click.native.prevent="handleViewFarm(scope.$index, scope1.$index)" type="text" size="medium" round)
											i.el-icon-monitor
				el-table-column(prop="avatar" :label="$t('common.avatar')")
					template(slot-scope="scope")
						el-avatar(:size="64" :src="scope.row.avatar" fit="fill" @error="errorHandler")
							img(src="/img/no-image.png" style="width:100%")
				el-table-column(prop="name" :label="$t('common.name')")
				el-table-column(prop="owner" :label="$t('common.owner')")
					template(slot-scope="scope")
						el-tag(size="mini")
								|{{scope.row.owner.name}} ({{scope.row.owner.email}})
				el-table-column(prop="members" :label="$t('common.members')")
					template(slot-scope="scope")
						el-tag(size="mini" style="margin-right:10px")
							| {{ scope.row.members.admins.length }} {{ $t('common.admins') }}
						el-tag(size="mini" style="margin-right:10px")
							| {{ scope.row.members.users.length }} {{ $t('common.users') }}
						el-tag(size="mini")
							| {{ scope.row.members.farms.length }} {{ $t('common.farms') }}
				el-table-column(prop="status" :label="$t('common.enabled')")
					template(slot-scope="scope")
						el-tag(size="mini")
								|{{ scope.row.status ? $t('common.enabled') : $t('common.disabled') }}
				el-table-column(fixed="right" :label="$t('common.options')" width="230" header-align="center")
					template(slot-scope="scope")
						el-tooltip(:content="$t('common.edit')" placement="top")
							el-button(@click.native.prevent="handleEditOrg(scope.$index)" type="text" size="medium" round :disabled="!isOwner(scope.$index)")
								i.el-icon-edit-outline
						el-tooltip(:content="$t('admin.org.addMember')" placement="top")
							el-button(@click.native.prevent="handleAddMemberOrg(scope.$index)" type="text" size="medium" round :disabled="!isOwnerOrAdmin(scope.$index)")
								i.el-icon-user
						el-tooltip(:content="$t('common.delete')" placement="top")
							el-button(@click.native.prevent="handleDeleteOrg(scope.$index)" type="text" size="medium" round :disabled="!isOwner(scope.$index)")
								i.el-icon-delete
	el-dialog(:title="$t('admin.org.addOrganization')" :visible.sync="bindAddDialogVisible" width="50%")
		el-form.org-add-form(:model="addOrg" label-width="150px" center)
			el-row(:gutter="20")
				el-col(:span="8")
					avatar-upload.avatar-upload-component(:avatar.sync="addOrg.avatar" :is-init="true")
				el-col(:span="16")
					el-form-item.org-form-input(:label="$t('common.name')")
						el-input(type="text" v-model="addOrg.name" :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable size="small")
		span(slot="footer" class="dialog-footer")
			el-button(@click="bindAddDialogVisible = false" size="small") {{ $t('common.cancel') }}
			el-button(type="primary" @click="submitAddOrg" :disabled="loading" :loading="loading" size="small") {{ $t('admin.org.addOrg') }}
	el-dialog(:title="$t('admin.org.editOrganization')" :visible.sync="bindEditDialogVisible" width="50%")
		el-form.org-add-form(:model="editOrg" label-width="150px"  center status-ico)
			el-row(:gutter="20")
				el-col(:span="8")
					avatar-upload.avatar-upload-component(:avatar.sync="editOrg.avatar" :is-init="true")
				el-col(:span="16")
					el-form-item.org-form-input(:label="$t('common.name')")
						el-input(type="text" v-model="editOrg.name" :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable size="small")
					el-form-item(:label="$t('common.enabled')")
						el-select(v-model="editOrg.status" :placeholder="$t('admin.org.selectOrgStatus')" size="small")
							el-option(v-for="item in statusOptions" :key="item.value" :label="item.name" :value="item.value")
		span(slot="footer" class="dialog-footer")
			el-button(@click="bindEditDialogVisible = false" size="small") {{ $t('common.cancel') }}
			el-button(type="primary" @click="submitEditOrg" :disabled="loading" :loading="loading" size="small") {{ $t('common.update') }}

</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState,mapActions } from 'vuex'
import notice from '@/utils/ui/notice'
import AvatarUpload from '~/form/AvatarUpload'

@Component({
	components: {
		AvatarUpload
	},
	computed:{
		...mapState('user',['email'])
	},
	methods:{
		...mapActions('org',['gets','get','search','delete','update','create']),
		async loadData() {
	  		this.gets().then(e => {
	  			if(e.success) {
	  				this.orgs = e.orgs
	  				this.handleTree()
	  				this.orgs.forEach(org => {
	  					org.owner.role = -1
	  					org.users = [org.owner]
	  					org.members.admins.forEach(admin => {
	  						admin.role = 0
	  						org.users.push(admin)
	  					})

	  					org.members.users.forEach(user => {
	  						user.role = 1
	  						org.users.push(user)
	  					})
	  				})
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
	  	searchOrg() {
	  		console.log(this.query)
	  		this.gets(this.query).then(e => {
	  			if(e.success) {
	  				this.orgs = e.orgs
	  				this.handleTree()
	  				this.orgs.forEach(org => {
	  					org.owner.role = -1
	  					org.users = [org.owner]
	  					org.members.admins.forEach(admin => {
	  						admin.role = 0
	  						org.users.push(admin)
	  					})

	  					org.members.users.forEach(user => {
	  						user.role = 1
	  						org.users.push(user)
	  					})
	  				})
	  			}else {
	  				notice.error(e.message, this.$t('common.error'))
	  			}
	  		})
	  	},
	  	handleEditOrg(index) {
	  		this.editOrg = this.orgs[index]
	  		this.bindEditDialogVisible = true
	  		// this.$router.push({ name:'OrgEdit', params: {id: this.orgs[index].id} })
	  	},
	  	isOwner(index) {
	  		const org = this.orgs[index]
	  		if(org.ownerId === this.email) {
	  			return true
	  		}
	  		return false
	  	},
	  	isOwnerOrAdmin(index) {
	  		const org = this.orgs[index]
	  		if(org.ownerId === this.email) {
	  			return true
	  		}
	  		return false
	  	},
	  	errorHandler() {
	  		return true
	  	},
	  	handleAddMemberOrg(index) {
	  		const orgId = this.orgs[index].id
	  		this.$router.push({name:'OrgAddMember', params: {id: orgId}})
	  	},
	  	handleTree(){
	  		let flatList = []
	  		// const copyOrgs = Object.assign({}, this.orgs)
	  		this.orgs.forEach(org => {
	  			const parentId = org.parentId
	  			const node = {
	  				id: org._id,
					label: org.name,
					parentId: parentId
	  			}
	  			flatList.push(node)
	  		})
	  		this.trees = this.buildTree(flatList)
	  		this.bindTreeDialogVisible = true
	  	},
	  	flatTree(tree, path = [], result = []){
	  		if(!tree.children.length)
	  			result.push(path.concat(tree.id))
	  		for(const child of tree.children)
	  			this.flatTree(child, path.concat(tree.id), result)
	  		return result
	  	},
	  	buildTree(list){
	  		var map = {}, node, roots = [], i = 0
  
			for (i = 0; i < list.length; i += 1) {
				map[list[i].id] = i // initialize the map
				list[i].children = [] // initialize the children
			}

			for (i = 0; i < list.length; i += 1) {
				node = list[i]
				if (node.parentId != undefined && node.parentId !== "") {
					// if you have dangling branches check that map[node.parentId] exists
					list[map[node.parentId]].children.push(node)
				} else {
					roots.push(node)
				}
			}
			return roots
	  	},
	  	getOrgRole(role){
	  		let nameRole = this.$t('common.owner')
	  		if(role === 0){
				nameRole = this.$t('common.admin')
	  		}
	  		else if(role === 1){
	  			nameRole = this.$t('common.user')
	  		}
	  		return nameRole
	  	},
	  	getAddress(address){
	  		let name = ''
	  		if(address.city){
	  			name += address.city
	  		}

	  		if(address.country){
	  			name += ', ' + address.country
	  		}
	  		return name
	  	},
	  	handleSwitchRole(orgIdx, memberIdx, role) {
	  		// ignore owner index
	  		/* memberIdx = memberIdx - 1
	  		console.log(orgIdx)
	  		console.log(memberIdx)
	  		console.log(role) */
	  		const originOrg = this.orgs[orgIdx]
	  		let org = this.orgs[orgIdx]
	  		let user = org.users[memberIdx]
	  		// find real index of user
	  		let index = 0

	  		if(role === 0){
	  			for(let i = 0; i < org.members.admins.length; i++){
	  				if(org.members.admins[i].email === user.email){
	  					index = i
	  					break
	  				}
	  			}
	  			
	  			user = org.members.admins[index]
	  			org.members.admins.splice(index, 1)
	  			org.members.users.push(user)
	  		}
	  		else if(role === 1){
	  			for(let i = 0; i < org.members.users.length; i++){
	  				if(org.members.users[i].email === user.email){
	  					index = i
	  					break
	  				}
	  			}

	  			user = org.members.users[index]
	  			org.members.users.splice(index, 1)
	  			org.members.admins.push(user)
	  		}

	  		org.members.adminIds = []
	  		org.members.admins.forEach(u => {
	  			if(u){
	  				org.members.adminIds.push(u.email)
	  			}
			})

	  		org.members.userIds = []
			org.members.users.forEach(u => {
				if(u){
					org.members.userIds.push(u.email)
				}
			})

	  		const params = {
	  			_id: org._id,
	  			members: {
	  				adminIds: org.members.adminIds,
	  				userIds: org.members.userIds
	  			}
	  		}

	  		this.update(params).then(e => {
	  			if(e.success) {
	  				org = e.org
	  			}else {
	  				notice.error(e.message, this.$t('common.error'))
	  				org = originOrg
	  			}
	  			org.owner.role = -1
	  			org.users = [org.owner]
				org.members.admins.forEach(admin => {
					admin.role = 0
					org.users.push(admin)
				})

				org.members.users.forEach(user => {
					user.role = 1
					org.users.push(user)
				})

				this.orgs[orgIdx].users = org.users
				this.orgs[orgIdx].members.userIds = org.members.userIds
				this.orgs[orgIdx].members.adminIds = org.members.adminIds
				this.orgs[orgIdx].members.users = org.members.users
				this.orgs[orgIdx].members.admins = org.members.admins
	  		})
	  	},
	  	handleRemoveMember(orgIdx, memberIdx, role) {
	  		// ignore owner index
	  		/* memberIdx = memberIdx - 1
	  		console.log(orgIdx)
	  		console.log(memberIdx)
	  		console.log(role) */
	  		const originOrg = this.orgs[orgIdx]
	  		let org = this.orgs[orgIdx]
	  		let user = org.users[memberIdx]
	  		// find real index of user
	  		let index = 0

	  		if(role === 0){
	  			for(let i = 0; i < org.members.admins.length; i++){
	  				if(org.members.admins[i].email === user.email){
	  					index = i
	  					break
	  				}
	  			}
	  			org.members.admins.splice(index, 1)
	  		}
	  		else if(role === 1){
	  			for(let i = 0; i < org.members.users.length; i++){
	  				if(org.members.users[i].email === user.email){
	  					index = i
	  					break
	  				}
	  			}
	  			org.members.users.splice(index, 1)
	  		}

	  		org.members.adminIds = []
	  		org.members.admins.forEach(u => {
	  			if(u){
	  				org.members.adminIds.push(u.email)
	  			}
			})

	  		org.members.userIds = []
			org.members.users.forEach(u => {
				if(u){
					org.members.userIds.push(u.email)
				}
			})

	  		const params = {
	  			_id: org._id,
	  			members: {
	  				adminIds: org.members.adminIds,
	  				userIds: org.members.userIds
	  			}
	  		}
	  		
	  		this.update(params).then(e => {
	  			if(e.success) {
	  				org = e.org
	  			}
	  			else{
	  				notice.error(e.message, this.$t('common.error'))
	  				org = originOrg
	  			}
	  			org.owner.role = -1
	  			org.users = [org.owner]
				org.members.admins.forEach(admin => {
					admin.role = 0
					org.users.push(admin)
				})

				org.members.users.forEach(user => {
					user.role = 1
					org.users.push(user)
				})

				this.orgs[orgIdx].users = org.users
				this.orgs[orgIdx].members.userIds = org.members.userIds
				this.orgs[orgIdx].members.adminIds = org.members.adminIds
				this.orgs[orgIdx].members.users = org.members.users
				this.orgs[orgIdx].members.admins = org.members.admins
	  		})
	  	},
	  	handleViewFarm(orgIdx, farmIdx) {
	  		const org = this.orgs[orgIdx]
	  		const farmId = org.members.farmIds[farmIdx]
	  		this.$router.push({name:'FarmView', params: {id: farmId}})
	  	},
	  	handleDrop(){
	  		// console.log(this.trees)
	  		this.trees.forEach(tree => {
	  			let matrix = this.flatTree(tree)
	  			matrix.forEach(array => {
	  				console.log(array)
		  			for(let i = 0; i < array.length; i++){
		  				let parentId = (i === 0 ? '' : array[i-1])
		  				let orgId = array[i]
		  				let idx = -1
		  				for(let j = 0; j < this.orgs.length; j++){
		  					let org = this.orgs[j]
		  					if(org._id == orgId && org.parentId != parentId){
								idx = j
								break
		  					}
		  				}
		  				console.log(parentId)
		  				console.log(orgId)
		  				console.log(idx)
		  				if(idx > -1){
		  					this.loading = true
		  					const params = {
					  			_id: orgId,
					  			parentId: parentId
					  		}
					  		this.update(params).then(e => {
					  			this.loading = false
					  			if(e.success) {
					  				this.orgs[idx] = e.org
					  			} else {
					  				notice.error(e.message, this.$t('common.error'))
					  				// restore tree
					  				this.handleTree()
					  			}
					  		})
		  				}
		  			}
	  			})
	  		})
	  	},
	  	handleUpdateTree() {
	  		// console.log(this.trees)
	  		this.loading = true
	  		const list = this.flatTree(this.trees)
	  		list.forEach(node => {
	  			for(let i = 0; i < this.orgs.length; i++){
	  				const org = this.orgs[i]
	  				if(org._id === node.id){
	  					if(org.parentId != node.parentId){
	  						// for update org
	  						const params = {
					  			_id: org._id,
					  			parentId: node.parentId
					  		}
					  		this.update(params).then(e => {
					  			if(e.success) {
					  				this.orgs[i] = e.org
					  			} else {
					  				notice.error(e.message, this.$t('common.error'))
					  			}
					  		})
	  					}
	  				}
	  			}
	  		})
	  		this.loading = false
	  	},
	  	openAddOrgDialog(){
	  		this.addOrg = {
				name: '',
				avatar: ''
			}
			this.bindAddDialogVisible = true
	  	},
	  	submitAddOrg(){
	  		console.log(this.addOrg)
			if(!this.addOrg.name || this.addOrg.name === ''){
				return notice.warning(this.$t('admin.org.orgNameHintError'))
			}
			this.addOrg.name = this.addOrg.name.toUpperCase()
			this.loading = true
			this.create(this.addOrg).then(e=>{
				this.loading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.addOrg = {
						name: '',
						avatar: ''
					}
					this.loadData()
					this.bindAddDialogVisible = false
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
	  	},
	  	submitEditOrg() {
			if(!this.editOrg.name || this.editOrg.name === ''){
				return notice.warning(this.$t('admin.org.orgNameHintError'))
			}
			this.editOrg.name = this.editOrg.name.toUpperCase()

			this.loading = true
			this.update(this.editOrg).then(e=>{
				this.loading = false
				if(e.success){
					notice.success(e.message, this.$t('common.info'))
					this.loadData()
					this.bindEditDialogVisible = false
				}else{
					notice.error(e.message, this.$t('common.error'))
				}
			})
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
			bindAddDialogVisible: false,
			bindEditDialogVisible: false,
			trees: [],
			query: {
				name: ''
			},
			orgs: [],
			addOrg: {
				name: '',
				avatar: ''
			},
			editOrg: {
				_id: '',
				name: '',
				avatar: '',
				status: false
			},
			statusOptions: [
				{
					name: this.$t('common.enabled'),
					value: true
				},
				{
					name: this.$t('common.disabled'),
					value: false
				},
			]
		}
	}
})
export default class OrgAdmin extends Vue{
	handleDeleteOrg(index){
		let fn = this
		this.$confirm('Confirm delete the org?','Confirm',{
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel'
		}).then(e => {
			console.log(e)
			fn.delete(fn.orgs[index].id).then(e=>{
				if(e.success){
					notice.success(e.message,'success')
				}else{
					notice.error(e.message,'error')
				}
			})
		}).catch(()=>{})
	}
}
</script>

<style lang="stylus">
.org-admin-component
	margin-top 20px
	padding 0px
	// font-beautify()
.org-add
	margin-top 50px
.when-bulbs-is-null
	margin 150px auto 50px
.orgs-admin-table
	border-radius 5px
	margin-top 20px
</style>
