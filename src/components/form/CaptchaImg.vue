<template lang="pug">
.captcha-wrap
	span(v-html="captcha" @click="handleCaptcha")
</template>

<script>
import { Component, Vue ,Watch } from 'vue-property-decorator'
import { mapActions,mapState } from 'vuex'

@Component({
	computed: {
		...mapState('dialog', ['isShowRegistry'])
	},
	methods: {
		...mapActions('common', ['getCaptcha'])
	}
})
export default class CaptchaImg extends Vue {
	captcha = ''

	created() {
		this.handleCaptcha()
	}

	handleCaptcha() {
		this.getCaptcha().then(res => {
			this.captcha = res.captcha
		})
	}

	@Watch('isShowRegistry')
	isGetCaptcha(isShow) {
		isShow && this.handleCaptcha()
	}
}
</script>
<style lang="stylus">
.captcha-wrap
	display inline-block
</style>
