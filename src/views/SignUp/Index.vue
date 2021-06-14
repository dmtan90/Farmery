<template lang="pug">
.login-wrapper(style="background-image: url(./img/farmery.bg.jpg)")
  .container-fluid(:style="{ height: windowHeight + 'px' }")
    el-row(type="flex" justify="center")
      el-col(:xs="22" :sm="22" :md="12" :lg="8" align="middle")
        el-card(class="card-block")
          .text-center
            img(src="/img/logo.png" alt="SMART AGR Logo" width="80")
            h3.app-name() SMART AGR
          .language-box()
            language-select
          el-form.form(:model="user" :rules="rules" ref="form" label-width="150px" center status-ico)
            // avatar-upload(:avatar.sync="user.avatar" :is-init="isInit")
            el-form-item(:label="$t('common.email')" prop="email")
              el-input(type="text" v-model.trim="user.email" :placeholder="$t('common.emailHint')" clearable @change="existHandle")
            el-form-item(:label="$t('common.fullName')" prop="name")
              el-input(type="text" v-model="user.name" :placeholder="$t('common.fullNameHint')" clearable)
            el-form-item(:label="$t('common.password')" prop="password")
              el-input(type="password" v-model.trim="user.password" :placeholder="$t('common.passwordHint')" clearable)
            el-form-item(:label="$t('signup.confirmPassword')" prop="checkpass")
              el-input(type="password" v-model.trim="user.checkpass" :placeholder="$t('common.passwordHint')" clearable)
            <!-- el-form-item(:label="$t('common.address')")
              city-select(:address.sync="user.address" :is-init="isInit") -->
            el-form-item(:label="$t('signup.captcha')" prop="captcha")
              el-tooltip(effect="light" :content="$t('signup.captchaHint')" placement="bottom" :disabled='disable')
                el-input.captcha(type="text" v-model.trim.number="user.captcha" @change='disable=true')
              captcha-img
            el-row
              el-button.login(@click="$router.push('Login')" style="width:150px" size="medium") {{ $t('common.login') }}
              el-button(type="primary" @click="submitForm" v-loading.fullscreen.lock="isLoading" element-loading-text="Registering" style="width:150px" size="medium") {{ $t('common.signup') }}
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
// import CitySelect from '~/form/CitySelect'
import CaptchaImg from '~/form/CaptchaImg'
import AvatarUpload from '~/form/AvatarUpload'
import LanguageSelect from '~/form/LanguageSelect'
import { mapState, mapMutations, mapActions } from 'vuex'
import {
  checkAccount,
  checkPassword,
  checkName,
  checkCaptcha
} from '@/utils/form/check'
import Regular from '@/utils/regular'
import tip from '@/utils/ui/tip'
import http from 'config/http'
import i18n from '@/lang/i18n'
@Component({
  components: {
    CaptchaImg,
    AvatarUpload,
    LanguageSelect
  },
  computed: {
    ...mapState('dialog', ['isShowRegistry'])
  },
  methods: {
    ...mapMutations('dialog', ['changeShowStatus', 'replaceRegistry']),
    ...mapActions('user', ['registry', 'hasExisted']),
    ...mapMutations('user', ['setEmail'])
  },
  mounted() {
    window.onresize = () => {
      this.windowHeight = window.innerHeight
    }
  }
})
export default class HomeRegistry extends Vue {
  user = {
    name: '',
    email: '',
    password: '',
    checkpass: '',
    address: {
      city: '',
      country: '',
      latitude: 0,
      longitude: 0
    },
    captcha: '',
    avatar:null
  }

  selections = []
  disable = false
  isHad = false
  isLoading = false
  isInit = false
  windowHeight = window.innerHeight
  rules = {
    name: checkName('name'),
    email: checkAccount,
    captcha: checkCaptcha,
    password: [
      {
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error(i18n.t('utils.form.passwordHintError')))
          }
          if (!Regular('password', value)) {
            return callback(new Error(i18n.t('utils.form.passwordInvalidHintError')))
          }
          if (this.user.checkpass) {
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
            return callback(new Error(i18n.t('utils.form.passwordHintError')))
          }
          if (!Regular('password', value)) {
            return callback(new Error(i18n.t('utils.form.passwordInvalidHintError')))
          }
          if (value !== this.user.password && this.user.password) {
            return callback(new Error(i18n.t('admin.profile.passwordNotSameHintError')))
          }
          callback()
        },
        trigger: 'blur'
      }
    ]
  }
  handleClose(done) {
    this.changeShowStatus({ name: 'Registry', status: false })
    done()
  }
  existHandle() {
    this.user.email &&
      this.$refs.form.validateField('email', errMsg => {
        if (errMsg) { return }
        this.hasExisted(this.user.email).then(isHad => {
          this.isHad = isHad
          if (isHad) { tip.warning(this.$t('signup.emailExisted')) }
        })
      })
  }
  toRegistry(){
    this.registry(this.user)
      .then(response => {
        this.isLoading = false
        if (!response.success) {
          return tip.error(response.message)
        }
        this.setEmail(this.user.email)
        tip.success(response.message).then(this.replaceRegistry)
        this.$router.push('Login')
      }).catch(e=>{
        console.log(e)
        tip.error(e)
      })
  }
  submitForm() {
    this.$refs.form.validate(valid => {
      if (valid) {
        /* if (!this.user.address.province) {
          return tip.warning('Please select your region!')
        } */
        if (this.isHad) {
          return tip.warning(this.$t('signup.emailExisted'))
        }
        this.isLoading = true
        if (this.user.avatar && typeof this.user.avatar === 'object') {
          const reader = new FileReader()
          reader.readAsDataURL(this.user.avatar)
          reader.onloadend = ()=>{
            this.user.avatar = reader.result
            this.toRegistry()
          }
        }else{
          this.toRegistry()
        }
      } else {
        tip.error(this.$t('signup.errorInputForm'))
        return false
      }
    })
  }
  created(){
    document.title = this.$t(this.$route.meta.title)
  }

}
</script>

<style lang="stylus">

</style>
