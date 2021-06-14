<template lang="pug">
.user-main
	el-breadcrumb.breadcrumb(separator="/")
		el-breadcrumb-item.home-link(:to="{name:'Home'}") {{ $t('components.layout.aside.home') }}
		el-breadcrumb-item {{ title }}
	el-row#card-title(:span="24" tag="span" type="flex" align="middle" justify="center") {{ title }}
	close-icon
	transition(:name="animation")
		router-view(:key="Date.now()")
</template>

<script>
import {Vue,Component,Watch} from 'vue-property-decorator'
import {getRandomAnimation} from '@/utils/ui/animation'
import CloseIcon from '~/icons/CloseIcon'

@Component({
	components:{
		CloseIcon
	},
	watch:{
		'$route'(to,from){
			this.changeAnimation()
		}
	}
})
export default class Card extends Vue{
	title = 'Writer of sensational headlines'
	animation = getRandomAnimation()
	changeAnimation(){
		this.animation = getRandomAnimation()
	}
	created(){
		this.title = this.$t(this.$route.meta.title)
		document.title = this.$t(this.$route.meta.title)
	}
}
</script>

<style lang="stylus">
.user-main
	width 100%
	min-height 100%
	padding 20px
	box-shadow 0 10px 25px rgba(56,56,56,0.2)
	border 1px solid #eee
	background-color #FFFFFF
	border-radius 1em
	cursor default
	position relative
	#card-title
		font-size 1.5em
		padding 5px
		border-bottom dotted 3px #cc
.breadcrumb
	position absolute
	cursor pointer
	z-index 666
	padding 10px
	color #666
	text-shadow 0 0 1px #ccc
	// .home-link:hover
</style>
