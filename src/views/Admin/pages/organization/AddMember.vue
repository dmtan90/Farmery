<template lang="pug">
.member-add-component
	el-form.member-add-form(:model="member" label-width="150px" :rules="rules" ref="form"  center status-ico)
		el-row(:gutter="20")
			el-col(:xs="24" :md="8")
				avatar-upload.avatar-upload-component(:avatar.sync="member.avatar" :is-init="true")
			el-col(:xs="24" :md="16")
				el-form-item(:label="$t('admin.farm.org')" prop="org")
					el-select(v-model="member.orgId" :placeholder="$t('admin.farm.orgHint')" size="small")
						el-option(v-for="item in orgs" :key="item.id" :label="item.name" :value="item.id")
				el-form-item(:label="$t('common.email')" prop="email")
					el-input(type="email" v-model.trim="member.email" :placeholder="$t('common.email')" clearable size="small")
						el-button(slot="append" :loading="isLoading" icon="el-icon-search" @click="existHandle()")
				el-form-item(:label="$t('common.fullName')" prop="name")
					el-input(type="text" v-model="member.name" :placeholder="$t('common.fullNameHint')" clearable size="small")
				el-form-item(:label="$t('common.password')" prop="password")
					el-input(type="password" v-model="member.password" :placeholder="$t('common.passwordHint')" clearable size="small")
				el-form-item(:label="$t('common.confirmPassword')" prop="checkpass")
					el-input(type="password" v-model="member.checkpass" :placeholder="$t('common.passwordHint')" clearable size="small")
				el-form-item(:label="$t('common.address')")
					customer-address(v-model="member.address" value="member.address" @change="changeAddress" size="small" hide-map="true")
				el-form-item(:label="$t('common.role')" prop="role")
					el-select(v-model="member.role" :placeholder="$t('admin.org.selectRole')" size="small")
						el-option(v-for="item in roles" :key="item.value" :label="item.name" :value="item.value")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('common.add') }}
	.member-add-tip
		h3| {{ $t('admin.org.addMemberTips.title') }}
		el-row
			| {{ $t('admin.org.addMemberTips.contents[0]') }}
		el-row
			| {{ $t('admin.org.addMemberTips.contents[1]') }}
		el-row
			| {{ $t('admin.org.addMemberTips.contents[2]') }}
		el-row
			| {{ $t('admin.org.addMemberTips.contents[3]') }}
		el-row
			| {{ $t('admin.org.addMemberTips.contents[4]') }}
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import AvatarUpload from '~/form/AvatarUpload'
import { mapActions, mapState } from 'vuex'
import notice from '@/utils/ui/notice'
import CustomerAddress from '~/form/CustomerAddress'
import {
  checkAccount,
  checkPassword,
} from '@/utils/form/check'
import Regular from '@/utils/regular'

@Component({
	components: {
		AvatarUpload,
		CustomerAddress
	},
	props: ['id'],
	methods: {
		...mapActions('org', ['registerMember','gets']),
		...mapActions('user', ['search']),
		async loadData() {
			this.gets().then(e => {
				this.isLoading = false
				if(e.success){
					this.orgs = e.orgs
				}
			})

			if(this.id){
				this.member.orgId = this.id
			}
		},
		changeAddress(value){
	    	console.log(value)
	    	let address = {
	    		country: value.address[0],
				city: value.address[1],
				latitude: value.latitude,
				longitude: value.longitude
	    	}
	    	this.member.address = address
	    },
	    existHandle() {
	    	if(this.member.email === ''){
	    		return notice.warning(this.$t('admin.org.emailHintError'))
	    	}

	    	this.$refs.form.validateField('email', errMsg => {
		        if (errMsg) { 
		        	return notice.warning(this.$t('admin.org.emailHintError')) 
		        }
		        this.isLoading = true
		    	this.search(this.member.email).then(e => {
		    		this.isLoading = false
		    		if(e.success){
		    			// auto fill user information
		    			this.member = e.user
		    			this.member.checkpass = this.member.password
		    			this.member.role = 'admin'
		    		}
		    		else{
		    			notice.error(e.message, this.$t('common.error'))
		    		}
		    	})
		    })
	    	/* if(!checkAccount()){
	    		return notice.warning(this.$t('admin.org.emailHintError'))
	    	} */
	    	
	    	/* if(this.member.email){
	    		this.$refs.form.validateField('email', errMsg => {
	    			if (errMsg) { return }
			        this.hasExisted(this.user.email).then(isHad => {
			          this.isHad = isHad
			          if (isHad) { tip.warning('The email you entered has been registered!', 2000) }
			        })
		        })
	    	} */
	    }
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			isLoading: true,
			member: {
				name: '',
				email: '',
				avatar: '',
				password: '',
				checkpass: '',
				orgId: '',
				role: 'admin',
				address: {
					city: '',
					country: '',
					latitude: 0,
					longitude: 0
				}
			},
			orgs: [],
			roles: [
				{
					name: this.$t('common.admin'),
					value: 'admin'
				},
				{
					name: this.$t('common.user'),
					value: 'user'
				}
			],
			rules: {
			    email: checkAccount,
			    password: [
			      	{
			        	validator: (rule, value, callback) => {
			          		if (!value) {
			            		return callback(new Error(this.$t('utils.form.passwordHintError')))
			          		}
			          		if (!Regular('password', value)) {
			            		return callback(new Error(this.$t('utils.form.passwordInvalidHintError')))
			          		}
			          		if (this.member.checkpass) {
			            		this.$refs.form.validateField('checkpass')
			          		}
			          		callback()
			        	},
			        	trigger: 'blur'
			      	}
			    ],
			    checkpass: [
			      	{
			        	validator: (rule, value, callback) => {
			          		if (!value) {
			            		return callback(new Error(this.$t('utils.form.passwordHintError')))
			          		}
			          		if (!Regular('password', value)) {
			            		return callback(new Error(this.$t('utils.form.passwordInvalidHintError')))
			          		}
			          		if (value !== this.member.password && this.member.password) {
			            		return callback(new Error(this.$t('utils.form.passwordNotMatchHintError')))
			          		}
			          		callback()
			        	},
			        	trigger: 'blur'
			      	}
			    ]
			}
		}
	}
})
export default class memberAdd extends Vue{	
	submitForm() {
		console.log(this.member)
		this.$refs.form.validate(valid => {
			if(valid){
				// e.g AA:BB:CC:DD:EE:FF
				if(!this.member.name || this.member.name.length > 64 || this.member.name === ''){
					return notice.warning(this.$t('admin.org.memberNameHintError'))
				}

				this.member.name = this.member.name.toUpperCase()

				this.isLoading = true
				// this.bulb.showStatus = this.bulb.status ? 'ON' : 'OFF'
				let params = {
					_id: this.member.orgId,
					role: this.member.role,
					userInfo: {
						name: this.member.name,
						email: this.member.email,
						avatar: this.member.avatar,
						password: this.member.password,
						address: this.member.address
					}
				}
				this.registerMember(params).then(e=>{
					this.isLoading = false
					if(e.success){
						notice.success(e.message, this.$t('common.info'))
						this.member = {
							name: '',
							email: '',
							avatar: '',
							password: '',
							checkpass: '',
							orgId: this.member.orgId,
							role: 'admin',
							address: {}
						}
						// this.$router.go(-1)
					}else{
						notice.error(e.message, this.$t('common.error'))
					}
				})
			}
		})
	}
}
</script>

<style lang="stylus">
.member-add-component
	position relative
	overflow-x hidden
	margin 30px
.member-add-form
	margin-left auto
	margin-right auto
.member-add-tip
	font-size .8em
	margin-bottom 20px
	& *
		padding 5px 0
.member-form-input
	width 86%
</style>
