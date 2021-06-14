<template lang="pug">
#error
	span.face :(
	p The page you visited was not found.
		br
		span#mes {{waitSecond}}
		span After seconds, go to the page you just browsed, where you can try to find the information you need.
		br
		span.tips If you want more information, you can search for this error online later: Forget it, you still don’t search...
</template>

<script>
import { Vue,Component } from 'vue-property-decorator'
@Component
export default class Error extends Vue {
	waitSecond = 5
	intervalid = setInterval(this.cutdown, 1000)
	cutdown() {
		if (--this.waitSecond === 0) {
			this.$router.go(-1)
			clearInterval(this.intervalid)
		}
	}
	beforeDestroy(){
		clearInterval(this.intervalid)
	}
}
</script>

<style lang="stylus">
#error
	overflow hidden
	height 100vh
	width 100vw
	min-height 100vh
	min-width 100vw
	background-color #0099CC
	color #FFFFFF
	padding-top 80px
	padding-left 100px
	.face
		font-size 100px
	p
		font-size 24px
		padding 8px
		line-height 40px
    .tips
			font-size 16px

@media screen and (max-width: 600px)
	body
		margin 0 10px
	p
		font-size 18px
		line-height 30px
		.tips
			display inline-block
			padding-top 10px
			font-size 14px
			line-height 20px
</style>
