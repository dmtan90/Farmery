<template lang="pug">
el-header.admin-header
	el-button(type="text" icon="el-icon-menu" @click="changeMenuState" circle)
	span()
		| SMART AGRICULTURE – VKIST – NACENTECH
	.right-menu-container()
		.language-box(style="width: 60px")
			language-select
		el-avatar(:size="32" :src="avatar" alt="avatar")
			img(src="/img/no-image.png")
		el-dropdown
			div.user-right-name(class="name" v-text="name" style="line-height: 50px")
				i.el-icon-arrow-down
			el-dropdown-menu.dropmenu(slot="dropdown" style="text-align:left")
				el-dropdown-item(@click.native="updateProfile")
					i.el-icon-user.icon
					| {{ $t('components.layout.header.userProfile') }}
				el-dropdown-item(@click.native="dropOut")
					i.el-icon-switch-button.icon
					| {{ $t('components.layout.header.logout') }}
	<!-- el-row(:span="24" type="flex" align="middle")
		el-col(:xs="24")
			el-button(type="text" icon="el-icon-menu" @click="changeMenuState" circle)
		el-col.hidden-sm-and-down.announcement(:span="12" :push="1")
			icon-svg(name="tongzhi" size="1.5")
			.tip-label Tips
			textra.tip-word(:data="words" :timer="1.5" :sequence="true" :infinite="true")
		el-col(:xs="4" :md="4" :push="10" style="text-align: right;")
			el-button-group
				router-link(:to="{name:'NoticeFamily'}" style="margin-right: 20px;")
					el-tooltip(:content="`${news.family?'You have received a new family message':'Family news'}`" placement="bottom")
						el-badge(:value="news.family" :max="10" :hidden="news.family===0")
							i.el-icon-bell
				router-link(:to="{name:'NoticeUsagelog'}" style="margin-right: 20px;")
					el-tooltip(:content="`${news.electric?'The electrical status has been updated!':'Electrical news'}`" placement="bottom" )
						el-badge(:value="news.electric" :max="99" :hidden="news.electric===0")
							i.el-icon-odometer
				router-link(:to="{name:'WeatherIndex'}" style="margin-right: 20px;")
					el-tooltip(:content="`${localDate!=currDate?'Today’s weather information is updated!':'Weather information'}`" placement="bottom")
						el-badge(:is-dot="localDate!=currDate")
							i.el-icon-cloudy-and-sunny
		el-col.person(:xs="16" style="text-align: right")
			.language-box(style="width: 100px")
				language-select
			el-avatar(:size="32" :src="avatar" alt="avatar")
				img(src="/img/no-image.png")
			el-dropdown
				div.user-right-name(class="name" v-text="name")
					i.el-icon-arrow-down.el-icon--right
				el-dropdown-menu.dropmenu(slot="dropdown" style="text-align:left")
					el-dropdown-item(@click.native="updateProfile" style="width:150px")
						icon-svg(name="geren" size="1.2")
						|User Profile
					el-dropdown-item(@click.native="dropOut" style="width:150px")
						icon-svg(name="logout" size="1.2")
						|Logout -->
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState,mapMutations,mapActions} from 'vuex'
import status from '@/utils/global/status'
import SocialSharing from '~/element/SocialSharing'
import LanguageSelect from '~/form/LanguageSelect'

@Component({
	computed:{
		...mapState('user',['account','name','address','avatar','news']),
		...mapState('notice',['family']),
		...mapState('usagelog',['usagelogs']),
		...mapState('ui', ['isShowMenu'])
	},
	methods:{
		...mapMutations('ui',['setMenuState']),
		changeMenuState(){
			this.setMenuState(!this.isShowMenu)
		}
	},
	components:{
		SocialSharing,
		LanguageSelect
	}
})
export default class LayoutHeader extends Vue{
	words = ['Set the automatic adjustment mode, you can accurately grasp the time to turn on the light according to your living habits and weather conditions','For your convenience, we provide a one-key leave-home function~','You can turn on the lights on time according to the off-duty time','Turn off all electrical appliances at home with one click, making life more at ease','The premise of controlling electrical appliances is that the electrical appliances are connected to the home LAN~','If you want to control electrical appliances individually, The id number must be different from the id number of the existing appliance']
	currDate = new Date().getDate()
	localDate = localStorage.localDate
	created(){
		/* eslint-disable eqeqeq */
		if(!this.localDate || this.currDate != this.localDate){
			localStorage.localDate = this.currDate
		}
	}
	dropOut(){
		status.logOut({ isShowLogin:true })
	}
	updateProfile(){
		this.$router.push({name: 'UserProfile'})
	}

}
</script>

<style lang="stylus">

.admin-header
	box-shadow 0 1px 4px rgba(0,21,41,.08)
	border-bottom 1px solid #e6e6e6
	background #fff
	padding-top 8px !important
	z-index 2
	position relative
	.right-menu-container
		position absolute
		right 10px
		top 10px
		display flex
	.tongzhi
		color #000
	.tip-label
		font-size 20%
		letter-spacing 2px
		margin-left -5px
		margin-top 3px
		color #999
	.tip-word
		position absolute
		left 45px
		bottom 5px
		font-size 85%
		color #333
		font-weight 300
		text-shadow rgb(69, 45, 45) 0px 0px 1px, rgb(255, 255, 251) 0px 0px 1px
	.user
		position fixed
		padding 14px
		top -1px
		right 30px
		cursor pointer
	.announcement
		margin-left -20px
	.notice
		margin-left 30px
	.avatar-wrap
		display inline-block
		border-radius 50%
		border-radius 50%
	.avatar
		height 30px
		width 30px
		border-radius 50%
	.notice
		cursor pointer
		.svg-icon
			box-shadow inset 2px 2px 4px 1px rgba(228, 229, 230, 0.7)
			padding 5px
			border-radius 15%
			transform scale(1.8)
	.name
		font-weight bold
		position relative
		bottom 8px
		margin-left 10px
		&:after
			display: inline-block;
			width: 0
			height: 0
			margin-left: .255em
			vertical-align: .255em
			content: ""
			border-top: .3em solid
			border-right: .3em solid transparent
			border-bottom: 0
			border-left: .3em solid transparent
	.setting
		position fixed
		right 2px
		top 10
		color #666
	.notice-icon
		color #333
	.dropmenu
		width 10%
		text-align center
		text-shadow 0 0 1px #ccc
		& li *
			margin 0 6px
	.user-right-name
		width 100px
		white-space nowrap
		overflow hidden
		text-overflow ellipsis
.dropmenu
	.el-dropdown-menu__item
		line-height 40px
		vertical-align middle
		.icon
			line-height 40px
</style>
