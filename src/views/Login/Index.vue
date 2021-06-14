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
          el-form.form(type="flex" justify="center" align="middle" :model="user" :rules="rules" ref="form" center status-icon label-width="150px")
            el-form-item(:label="$t('common.email')" prop="email")
              el-input(type="text" v-model.trim="user.email" auto-complete='on' :placeholder="$t('common.emailHint')" clearable)
            el-form-item(:label="$t('common.password')" prop="password")
              el-input(type="password" v-model.trim="user.password" :placeholder="$t('common.passwordHint')" clearable ref="passInput")
            el-row(type="flex" justify="center")
              el-col(:xs="24" :sm="24" :md="12" align="middle")
                el-checkbox.checkbox(v-model="keep" checked justify="left" style="line-height: 40px;") {{ $t('login.rememberLogin') }}
              el-col(:xs="24" :sm="24" :md="12" align="middle")
                el-button.forgetPwd(type="text" @click="forgetPwd") {{ $t('login.forgetPassword') }}
            el-row
              el-button.login(@click="$router.push('SignUp')" style="width:150px" size="medium") {{ $t('common.signup') }}
              el-button(type="primary" @click="submitForm" v-loading.fullscreen.lock="isLoading" element-loading-text="Logging in" style="width:150px" size="medium") {{ $t('common.login') }}
</template>

<script>
import { Vue, Component} from 'vue-property-decorator'

import { mapState, mapMutations, mapActions } from 'vuex'
import LanguageSelect from '~/form/LanguageSelect'
import { checkAccount, checkPassword } from '@/utils/form/check'
import tip from '@/utils/ui/tip'
import Regular from '@/utils/regular'

@Component({
  components: {
    LanguageSelect
  },
  computed: {
    ...mapState('dialog', ['isShowLogin']),
    ...mapState('user', ['email'])
  },
  methods: {
    ...mapMutations('dialog', ['changeShowStatus', 'replaceLogin']),
    ...mapMutations('user', ['Keep']),
    ...mapActions('user', ['login'])
  },
  watch:{
    isShowLogin(isShow){
      isShow && this.email && this.Init()
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowHeight = window.innerHeight
    }
  }
})
export default class HomeLogin extends Vue {
  user = {
    email: '',
    password: ''
  }
  rules = {
    email: checkAccount,
    password: checkPassword
  }
  isLoading = false
  keep = true
  windowHeight = window.innerHeight
  Init(){
    this.user.email = this.email || ''
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
        tip.error(this.$t('login.errorInputForm'))
        return false
      }
    })
  }
  forgetPwd() {
    this.$prompt(this.$t('login.pleaseEnterEmail'), this.$t('common.confirm'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        inputErrorMessage: this.$t('login.invalidEmail'),
        inputPlaceholder: this.$t('common.email'),
        inputValidator(value){
          return Regular('mobile', value) || Regular('email', value)
        }
    }).then(({ value }) => {
      const deviceInfo = Regular('mobile', value) ? ['mobile','SMS'] : ['email','mail']
      const tipInfo = this.$t('login.resetPasswordInfo', [deviceInfo[0], deviceInfo[1], deviceInfo[1]])
      tip.success(tipInfo)
    }).catch()
  }
  created(){
    document.title = this.$t(this.$route.meta.title)
  }
}
</script>

<style lang="stylus">
.login-wrapper
  position relative
  background-repeat no-repeat
  background-position center
  width 100%
  height 100%
  background-size cover
  display flex
  flex-direction column
  overflow auto
  .el-card
    margin-top 50px
    box-shadow 0 10px 50px rgb(233, 233, 233) !important
    border-radius 10px !important
    position relative
  .form
    margin-top 50px
  .checkbox
    margin-bottom 20px
  .last-line
    margin-left 3vw !important
    margin-top 2vh !important
  .login
    margin-right 3vw !important
  .forgetPwd
    color #999
  .language-box
    position absolute
    top 10px
    right 10px
</style>
