<template lang="pug">
.weather-info(:span="24" type="flex" align="middle" justify="center")
	weather-icon.weather-icon(v-if="now.weather !== undefined" :weather="now.weather" :code="now.code")
	el-row.weather-base-info
		el-row
			| {{ (now ? (now.weather + '·' + now.temperature) : 'N/A') + '℃'}}
		el-row
			| {{ address.city ? (address.city + ', ' + address.country) : 'N/A' }}
	el-row.electric-setting-button
			el-button(type="success" @click.native="$router.push({name:'WeatherIndex'})" round) {{ $t('components.weather.moreInfo') }}
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapState } from 'vuex'
import WeatherIcon from '~/weather/Icon'
import filterWeatherInfo from '@/utils/weather'

@Component({
	components:{
		WeatherIcon
	},
	computed: {
		...mapState('weather', ['now']),
		...mapState('user', ['address'])
	}
})
export default class WeatherCard extends Vue{}
</script>

<style lang="stylus">
.weather-info
	height 250px
	width 100%
	box-shadow 2px 3px 10px #ccc
	border-radius 10px
	padding 50px
	background-color #FFFFFF
	position relative
	.weather-icon
		position absolute
		top 25%
		left 50%
	.weather-base-info
		margin-top 70px
		z-index 999
		opacity .8
		text-align center
		& *
			padding 8px 10px
	.more-info-weather-link
		display block
		cursor pointer
		text-decoration none
		font-size .7em
		height 40px
		margin-top 5px
		color #fff
		background-color #333
		padding 8px
		border-radius 5px
		box-shadow 1px 1px 10px #999
		border solid 2px #999
		transition all .3s
		&:active
			box-shadow: 0 0 0px gray;
			transform scale(0.8) translateY(5)
		&:hover
			border solid 2px #000
			color #000
			background-color #fff
</style>
