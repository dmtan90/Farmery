<template lang="pug">
	el-container#container
		el-header.header: home-header
		el-main.main: home-main
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import HomeHeader from '~/home/Header'
import HomeMain from '~/home/Main'

@Component({
	components: {
		HomeHeader,
		HomeMain
	}
})
export default class Index extends Vue {}
</script>

<style lang="stylus">
#container
	height 100vh
	min-height 100vh
	overflow hidden
	.main
		padding 0
</style>
