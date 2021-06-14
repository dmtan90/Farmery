<template lang="pug">
.user-index-component
	el-form(ref="form" status-icon :model="form" :rules="rules" label-position="left" label-width="100px" style="padding: 20px")
		el-row(:gutter="20" justify="space-around" align="middle" style="text-align:center")
			el-col(:xs="24" :sm="8" style="text-align: center;")
				el-upload(class="avatar-uploader"
					action=""
					accept=".jpg,.jpeg,.png,.JPG,.JPEG"
					:show-file-list="false"
					:before-upload="beforeAvatarUpload"
					:auto-upload="false"
					:on-remove="handleRemoveAvatar"
					:on-change="getSelectAvatar")
					el-avatar(:size="150" :src="form.avatar" fit="fill" @error="errorHandler")
						img(src="/img/no-image.png")
					p() {{ $t('admin.profile.uploadAvatarHint') }}
			el-col(:xs="24" :sm="16")
				el-form-item(prop="email" :label="$t('common.email')")
					el-input(v-model="form.email" size="medium" type="email" disabled)
				el-form-item(prop="name" :label="$t('common.fullName')")
					el-input(v-model="form.name" size="medium")
				el-form-item(prop="address" :label="$t('common.address')")
					customer-address(v-model="address" value="address" @change="changeAddress" size="medium" hide-map="true")
				el-form-item(prop="unit" :label="$t('common.units')" style="text-align: left")
					el-switch(v-model="units.temp" size="medium" active-text="*C" inactive-text="*F" @change="handleChangeUnit" style="margin-right: 20px")
					el-switch(v-model="units.ec" size="medium" active-text="mS/cm" inactive-text="ppm" @change="handleChangeUnit"  style="margin-right: 20px")
		el-row(:gutter="20" justify="space-around" align="middle")
			el-col(:span="12" style="text-align: right")
				el-button(type="success" size="medium" @click="dialogFormVisible = true" style="width: 150px" round) {{ $t('admin.profile.changePassword') }}
			el-col(:span="12")
				el-button(type="primary" size="medium" :loading="isLoading" @click="updateProfile" style="width: 150px" round) {{ $t('common.update') }}
	el-dialog(:title="$t('admin.profile.changePassword')" :visible.sync="dialogFormVisible" width="40%")
		el-form(ref="form" :model="form" :rules="rules" label-width="150px")
			el-form-item(prop="password" :label="$t('admin.profile.newPassword')")
				el-input(v-model="form.password" type="password" size="medium" minlength="6" maxlength="16" style="width: 80%;" :placeholder="$t('admin.profile.passwordHint')" clearable)
			el-form-item(prop="checkpass" :label="$t('admin.profile.confirmPassword')")
				el-input(v-model="form.checkpass" type="password" size="medium" minlength="6" maxlength="16" style="width: 80%;" :placeholder="$t('admin.profile.passwordHint')" clearable)
		div(slot="footer" class="dialog-footer")
			el-button(size="medium" @click="dialogFormVisible = false" style="width: 100px" round) {{ $t('common.close') }}
			el-button(type="primary" size="medium" :loading="isLoading" @click="updatePassword" style="width: 100px" round) {{ $t('common.save') }}
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { mapState, mapActions, mapMutations } from 'vuex'
import CustomerAddress from '~/form/CustomerAddress'
import { compressImageBase64 } from '@/utils/global'
import notice from '@/utils/ui/notice'
import {
  checkAccount,
  checkPassword,
  checkName
} from '@/utils/form/check'
@Component({
	components: {
		CustomerAddress
	},
	computed:{
		...mapState('user',['name','email','address','avatar']),
		...mapState('ui',['units'])
	},
	data() {
	    const validateRePassword = (rule, value, callback) => {
	    	if (value !== this.form.password) {
	    		callback(new Error(this.$t('admin.profile.passwordNotSameHintError')))
	    	} else {
	    		callback()
	    	}
	    }
		return {
			isLoading: false,
			isInit: false,
			changeFace: false,
			dialogFormVisible: false,
			form: {
				name: '',
				email: '',
				address: '',
				avatar: '',
				password: '',
				checkpass: ''
			},
			rules: {
		        name: checkName('name'),
		        tel: checkAccount,
		        email: checkAccount,
		        password: checkPassword,
		        checkpass: [
		        	{ required: true, message: this.$t('admin.profile.passwordHintError'), trigger: 'blur' },
		        	{ min: 6, max: 16, message: this.$t('admin.profile.passwordLengthHintError'), trigger: 'blur' },
		        	{ validator: validateRePassword, trigger: 'blur' }
		        ]
		    }
		}
	},
	created() {
		this.loadData()
	},
	methods: {
		...mapActions('user',['modify', 'getUserInfo']),
		...mapMutations('ui',['setUnits']),
		loadData() {
			console.log(this.name)
			this.getUserInfo().then(e => {
				console.log(e)
				if(e.success){
					let userInfo = e.userInfo
					this.form.name = userInfo.name
					this.form.email = userInfo.email
					this.form.address = userInfo.address
					this.form.avatar = userInfo.avatar
				} else {
					this.form.name = this.name
					this.form.email = this.email
					this.form.address = this.address
					this.form.avatar = this.avatar	
				}
			})
		},
		errorHandler() {
			return true
	    },
	    beforeAvatarUpload(file) {
	    	const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')
	    	// const isLt2M = file.size / 1024 / 1024 < 2
	    	if (!isJPG) {
	    		// this.$message.error('Avatar picture must be JPG format!')
	    		notice.warning(this.$t('admin.profile.avatarFormatHintError'), this.$t('common.warning'))
	    	}
	    	/* if (!isLt2M) {
	    		// this.$message.error('Avatar picture size can not exceed 2MB!')
	    		notice.warning('Avatar picture size can not exceed 2MB!','warning')
	    	} */
	    	return isJPG
	    },
	    getSelectAvatar(file, fileList) {
	    	var fn = this
	    	if(!this.beforeAvatarUpload(file.raw)) {
				// fn.$refs.uploadAvatar.clearFiles()
				return
			}
	    	compressImageBase64(file).then(base64 => {
	      		fn.form.avatar = base64
	    		fn.changeFace = true
	      	})
	    	
	    	/* var reader = new FileReader()
	    	reader.readAsDataURL(file.raw)
	    	reader.onload = function() {
	    		fn.form.avatar = this.result
	    		fn.changeFace = true
	    	} */
	    },
	    handleRemoveAvatar() {
	    	this.form.avatar = this.avatar
	    	this.changeFace = false
	    },
	    updateProfile() {
	    	console.log(this.form)
	    	this.$refs.form.validate(valid => {
				if (valid) {
					this.isLoading = true
					const form = {
						email: this.form.id,
						name: this.form.name,
						address: this.form.address
					}
					let user = Object.assign({}, form)
					if (this.changeFace) {
						user.avatar = this.form.avatar
					}
					this.modify(user).then((e) => {
						this.isLoading = false
						notice.success(this.$t('admin.profile.updateSuccessHint'), this.$t('common.info'))
						this.loadData()
					})
				} else {
					notice.error(this.$t('admin.profile.updateFailedHint'), this.$t('common.error'))
					return false
				}
			})
	    },
	    updatePassword() {
	    	this.$refs.form.validate(valid => {
				if (valid) {
					this.isLoading = true
					const form = {
						email: this.form.email,
						password: this.form.password
					}
					let user = Object.assign({}, form)
					this.modify(user).then((e) => {
						this.isLoading = false
						notice.success(this.$t('admin.profile.updateSuccessHint'), this.$t('common.info'))
						this.loadData()
					})
				} else {
					notice.error(this.$t('admin.profile.updateFailedHint'), this.$t('common.error'))
					return false
				}
			})
	    },
	    changeAddress(value){
	    	console.log(value)
	    	let address = {
	    		country: value.address[0],
				city: value.address[1],
				latitude: value.latitude,
				longitude: value.longitude
	    	}
	    	this.form.address = address
	    },
	    handleChangeUnit(){
	    	console.log(this.units)
	    	this.setUnits(this.units)
	    }
	}
})
export default class User extends Vue{
}
</script>

<style lang="stylus">
.user-avatar img
	height 120px
	width 120px
	border-radius 50%
	box-shadow 0px 1px 20px 3px rgba(210, 201, 201, 0.7), 0 0 20px 2px #f6f6f6
	transition .3s
</style>
