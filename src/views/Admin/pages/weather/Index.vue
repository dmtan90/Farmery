<template lang="pug">
.weather-more-info
	weather-icon.weather-icon(:weather="now.weather" :code="now.code")
	.weather-base-info
		el-row
			| {{'The weather：' + now.weather}}
		el-row
			| {{'Temperature：' + now.temperature + ' ℃'}}
		el-row
			| {{'Wind direction：' + now.wind.direction}}
		el-row
			| {{'Wind force：' + now.wind.power + ' level'}}
		el-row
			| {{'Humidity：' + now.humidity}}
		el-row
			| {{'Visibility：' + now.seeing + ' Kilometer'}}
		el-row
			| {{'Precipitation：' + now.precipitation }}
		el-row
			| {{'Sunrise time：' + now.sun.up}}
		el-row
			| {{'Sunset time：' + now.sun.down}}
	.weather-forecast
		.focecast-title: | Weather forecast
		.weather-forecast-info
			el-row(v-for="(date,index) in forecastDates" :key="index")
				router-link(:to="{name:'WeatherForecast',params:{active:index}}" v-text="date")
	.weather-lifestyle
		.lifestyle-title: | Life index
		ul.weather-lifestyle-info
			li(v-for="(info,index) in lifestyle" :key="index")
				el-popover(:title="info.level" :content="info.describe")
					a(slot="reference"): | {{info.type}}

</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapState } from 'vuex'
import WeatherIcon from '~/weather/Icon'

@Component({
	components:{
		WeatherIcon
	},
	computed: {
		...mapState('weather', ['now','forecast','lifestyle'])
	}
})
export default class WeatherIndex extends Vue{
	forecastDates = ['Tomorrow','Next Tomorrow']
}

</script>

<style lang="stylus">
.weather-more-info
	position relative
	min-height 400px
	overflow-y scroll
	font-beautify()
	.weather-icon
		position absolute
		left 25%
		top 28%
	.weather-base-info
		font-size .8em
		position absolute
		left 19%
		top 40%
		& *
			padding 10px 5px
	.weather-forecast
		position absolute
		top 20%
		left 60%
		padding-left 20px
		& *
			padding 5px
			font-size 0.95em
		.focecast-title
			font-size 1.2em
	.weather-lifestyle
		position absolute
		top 180px
		left 60%
		border-top solid 1px #ccc
		padding-top 20px
		padding-left 20px
		.lifestyle-title
			font-size 1.2em
		& *
			font-size 0.95em
			padding 7px 0
			width 150px
	& a
		text-decoration none
		color #999
		text-shadow 0 0 1px #f6f6f6
		transition .3s
		cursor pointer
		&:hover
			color transparent
			text-shadow 0 0 1px #666
			transform translateY(-1) scale(.8)
			font-weight bold
</style>
