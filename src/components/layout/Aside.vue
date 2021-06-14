<template lang="pug">
el-aside.aside-admin(:width="isShow ? '250px' : '50px'" :class="isMobile ? 'mobile-menu' : ''")
	el-menu.menu(:default-openeds="['0']" :collapse="!isCollapse"
			background-color="#0D0D39" text-color="#b8c7ce" active-text-color="#fff")
		.logo
			.logo-icon(:style="isShow ? 'margin-left:50px' : 'margin-left: 10px'")
				img(src="/img/logo.png" :width="isShow ? '48px' : '32px'" :height="isShow ? '48px' : '32px'" alt="SMART AGR")
				span
					| SMART AGR
		.user-menu(:style="isShow ? 'display: block' : 'display: none'")
			el-avatar(:size="64" :src="avatar" alt="avatar")
				img(src="/img/no-image.png")
			.user-tip
				| {{ $t('components.layout.aside.welcome') }},
				.name-menu: span(v-text="name")
		.menu-items(:style="{ height: (windowHeight - 150) + 'px' }")
			router-link(:to="{name:'Home'}" tag="li" v-waves)
				el-tooltip(:content="$t('components.layout.aside.dashboard')" placement="right")
					el-menu-item(index="0")
						i.el-icon-data-line
						| {{ $t('components.layout.aside.dashboard') }}
			router-link(:to="{name:'OrgManage'}" tag="li" v-waves)
				el-tooltip(:content="$t('components.layout.aside.organization')" placement="right")
					el-menu-item(index="1")
						i.el-icon-office-building
						| {{ $t('components.layout.aside.organization') }}
			router-link(:to="{name:'FarmManage'}" tag="li" v-waves)
				el-tooltip(:content="$t('components.layout.aside.farm')" placement="right")
					el-menu-item(index="2")
						i.el-icon-house
						| {{ $t('components.layout.aside.farm') }}
			router-link(:to="{name:'ZoneManage'}" tag="li" v-waves)
				el-tooltip(:content="$t('components.layout.aside.zone')" placement="right")
					el-menu-item(index="3")
						i.el-icon-place
						| {{ $t('components.layout.aside.zone') }}
			router-link(:to="{name:'CropManage'}" tag="li" v-waves)
				el-tooltip(:content="$t('components.layout.aside.crop')" placement="right")
					el-menu-item(index="4")
						i.el-icon-crop
						| {{ $t('components.layout.aside.crop') }}
			router-link(:to="{name:'PlantManage'}" tag="li" v-waves)
				el-tooltip(:content="$t('components.layout.aside.plant')" placement="right")
					el-menu-item(index="5")
						i.el-icon-apple
						| {{ $t('components.layout.aside.plant') }}
			router-link(:to="{name:'DeviceManage'}" tag="li" v-waves)
				el-tooltip(:content="$t('components.layout.aside.device')" placement="right")
					el-menu-item(index="6")
						i.el-icon-monitor
						| {{ $t('components.layout.aside.device') }}
			router-link(:to="{name:'ScriptManage'}" tag="li" v-waves)
				el-tooltip(:content="$t('components.layout.aside.script')" placement="right")
					el-menu-item(index="7")
						i.el-icon-guide
						| {{ $t('components.layout.aside.script') }}
			router-link(:to="{name:'UserProfile'}" tag="li" v-waves :style="isShow ? 'margin-bottom: 100px' : 'margin-bottom: 0px'")
				el-tooltip(:content="$t('components.layout.aside.profile')" placement="right")
					el-menu-item(index="8")
						i.el-icon-user
						| {{ $t('components.layout.aside.profile') }}
		.menu-footer(:style="isShow ? 'display: block' : 'display: none'")
			h6
				| Đề tài
			h6
				| “Nghiên cứu ứng dụng trí tuệ nhân tạo trong phát hiện sâu bệnh và xác định thời gian thu hoạch dưa lưới trồng trong nhà màng”
			h6
				| Chủ nhiệm
			h6
				| Đặng Hoàng Anh Tuấn
			h6
				| 0914.580.580
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState,mapMutations} from 'vuex'
import status from '@/utils/global/status'
import translatePage from '@/plugins/translate'

@Component({
	computed:{
		...mapState('user',['account','name','address','avatar']),
		...mapState('ui', ['isShowMenu'])
	},
	methods:{
		...mapMutations('ui',['switchNightModel', 'setMenuState'])
	},
	watch: {
		isShowMenu: function(value){
			console.log(value)
			this.isShow = value
		}
	},
	mounted() {
		window.onresize = () => {
	    	this.windowHeight = window.innerHeight
	    	this.windowWidth = window.innerWidth
	    	this.isMobile = (this.windowWidth < 756 ? true : false)
	    	if(this.isMobile){
		    	this.isShow = false	
		    }
		    else{
		    	this.isShow = this.isShowMenu
		    }
		    this.setMenuState(this.isShow)
	    }
	    this.isMobile = (this.windowWidth < 756 ? true : false)
	    if(this.isMobile){
	    	this.isShow = false	
	    }
	    else{
	    	this.isShow = this.isShowMenu
	    }
	    this.setMenuState(this.isShow)
	    // this.isShow = (this.isShowMenu || this.isMobile == false)
	},
	data() {
		return {
			windowHeight: window.innerHeight,
			windowWidth: window.innerWidth,
			isMobile: false,
			isShow: false,
			logo: require('img/logo.png')
		}
	}
})
export default class LayoutAside extends Vue{
	isCollapse = true
	dropOut(){
		status.logOut({hasTip:false,isShowLogin:false})
	}
	translatePage(){
		translatePage()
	}
}
</script>

<style lang="stylus">
menu-width = 250px
menu-height = 60px
.aside-admin
	box-shadow 2px 0 6px rgba(0,21,41,.35)
	z-index 999
	overflow hidden !important
	-webkit-transition width 500ms ease-in-out
    -moz-transition width 500ms ease-in-out
    -o-transition width 500ms ease-in-out
    transition width 500ms ease-in-out
	.mobile-menu
		position fixed
		height 100%
		left 0px
		top 0px
.menu
	min-height 100vh
	letter-spacing 2px
	overflow hidden
	height 100%
	.menu-footer
		position absolute
		bottom 10px
		background-color #0D0D39
		color #FFFFFF
		width menu-width - 1px
		text-align center
		padding-top 8px
	.logo
		height menu-height
		width menu-width
		padding-top 10px
		color #fff
		z-index 99
		box-shadow 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12)
		.svg-icon
			border-radius 15%
			padding 2px
			box-shadow 2px 3px 4px 1px rgba(28, 73, 44, 0.7)
			transform rotate(340deg)
		.logo-icon
			margin-left 50px
			display inline-flex
			span
				margin-left 20px
				line-height 48px
		.logo-text
			font-size 90%
			position relative
			left 85px
			bottom 20px
			span
				text-shadow 3px 3px 2px #0f4743
	.user-menu
		padding 8px
		margin-top 10px
		padding-bottom 5px
		border-bottom dashed 0.5px #999
		height 90px
		.avatar
			padding 1px
			transform scale(1.8)
			position relative
			left 25px
			bottom -10px
			border-radius 50%
			box-shadow 0 0 2px 3px rgba(255,255,255,0.7), 0 0 20px 2px #f6f6f6
			transition .3s
			background-color #fff
			&:hover
				transform scale(2.0)
		.name-menu
			margin-top 5px
			color #fff
			font-weight bold
			font-size 120%
		.user-tip
			font-size 70%
			color #ccc
			position relative
			left 85px
			bottom 50px
	.menu-items
		overflow-y scroll
		-ms-overflow-style none
		scrollbar-width none
	.menu-items::-webkit-scrollbar {
  		display: none
  	}

</style>
