<template lang="pug">
el-dialog(title="Login" :visible="isShowLogin" width="26%" top="15vh" custom-class="dialog" :before-close="handleClose" lock-scroll model  center)
	el-form.form(type="flex" justify="center" align="middle" :model="user" :rules="rules" ref="form" center status-icon label-width="200px")
		el-form-item(label="Email" prop="account")
			el-input(type="text" v-model.trim="user.account" auto-complete='on' placeholder="Email" clearable)
		el-form-item(label="Password" prop="password")
			el-input(type="password" v-model.trim="user.password" placeholder="6-12 digits/letters/English symbols" clearable ref="passInput")
		el-checkbox.checkbox(v-model="keep" checked) Remember login
	.dialog-login-footer(slot="footer")
		el-row
			el-button.login(type="primary" @click="submitForm" v-loading.fullscreen.lock="isLoading" element-loading-text="Logging in") Login
			el-button(@click="$refs.form.resetFields()") Reset
		el-row.last-line
			el-button.forgetPwd(type="text" @click="forgetPwd") Forget Password
			el-button.registry(type="text" @click="replaceLogin") Signup

</template>

<script>
import { Vue, Component} from 'vue-property-decorator'

import { mapState, mapMutations, mapActions } from 'vuex'
import { checkAccount, checkPassword } from '@/utils/form/check'
import tip from '@/utils/ui/tip'
import Regular from '@/utils/regular'

@Component({
	computed: {
		...mapState('dialog', ['isShowLogin']),
		...mapState('user', ['account'])
	},
	methods: {
		...mapMutations('dialog', ['changeShowStatus', 'replaceLogin']),
		...mapMutations('user', ['Keep']),
		...mapActions('user', ['login'])
	},
	watch:{
		isShowLogin(isShow){
			isShow && this.account && this.Init()
		}
	}
})
export default class HomeLogin extends Vue {
	user = {
		account: '',
		password: ''
	}
	rules = {
		account: checkAccount,
		password: checkPassword
	}
	isLoading = false
	keep = true
	Init(){
		this.user.account = this.account || ''
	}
	handleClose(done) {
		this.changeShowStatus({ name: 'Login', status: false })
		done()
	}
	submitForm() {
		this.$refs.form.validate(valid => {
			if (valid) {
				this.isLoading = true
				this.Keep(this.keep)
				this.login(this.user).then(response => {
					this.isLoading = false
					if (!response.success) {
						return tip.error(response.message)
					}
					tip.success(response.message).then(() => {
						this.$router.push({ name: 'Home'})
					})
				})
			} else {
				tip.error('Please check the information carefully!')
				return false
			}
		})
	}
	forgetPwd() {
		this.$prompt('Please enter your email', 'Confirm', {
				confirmButtonText: 'Confirm',
				cancelButtonText: 'Cancel',
				inputErrorMessage: 'Email is not valid',
				inputPlaceholder: 'Email',
				inputValidator(value){
					return Regular('mobile', value) || Regular('email', value)
				}
		}).then(({ value }) => {
			const deviceInfo = Regular('mobile', value) ? ['mobile','SMS'] : ['email','mail']
			const tipInfo = `We have sent to your ${deviceInfo[0]} a ${deviceInfo[1]},Please click on your ${deviceInfo[1]} link and change password`
			tip.success(tipInfo)
		}).catch()
	}
}
</script>

<style lang="stylus">
.dialog
	box-shadow: 0 10px 50px rgb(233, 233, 233) !important;
	border-radius: 10px !important;
	.form
		margin-left -4vw !important
	.checkbox
		margin-left 3vw !important
	.dialog-login-footer
		margin-top -2vh !important
	.last-line
		margin-left 3vw !important
		margin-top 2vh !important
	.login
		margin-right 3vw !important
	.forgetPwd
		color #999
	.forgetPwd:after
		color transparent
		text-shadow 0 0 1px #ccc
		content ' | '
		position relative
		left 3px
</style>
