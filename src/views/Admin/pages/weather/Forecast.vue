<template lang="pug">
.weather-forecast-component
	.weather-forecast-info(v-for="(now,index) in forecast" :key="index")
		weather-icon.weather-icon(:weather="now.day.weather" :code="now.day.code")
		.weather-forecast-title: |{{now.date}}
		.weather-forecast-baseinfo(:class="{activeWeather:index!=$route.params.active}")
			el-row
				| {{'Daytime weather：' + now.day.weather}}
			el-row
				| {{'Night weather：' + now.night.weather}}
			el-row
				| {{'Maximum temperature：' + now.temperature.max + ' ℃'}}
			el-row
				| {{'Minimum temperature：' + now.temperature.min + ' ℃'}}
			el-row
				| {{ 'Wind direction：' + now.wind.direction}}
			el-row
				| {{'Wind force：' + now.wind.power + ' level'}}
			el-row
				| {{'Humidity：' + now.humidity}}
			el-row
				| {{'Visibility：' + now.seeing + ' Kilometer'}}
			el-row
				| {{'Precipitation：' + now.precipitation.value }}
			el-row
				| {{'UV intensity：' + now.ultraviolet}}

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
		...mapState('weather', ['forecast'])
	}
})
export default class WeatherForecast extends Vue{
	created(){
		console.log(this.$route)
	}
}
</script>

<style lang="stylus">
.weather-forecast-component
	position relative
	min-height 400px
	overflow-y scroll
	font-beautify()
	.weather-icon
		position absolute
		top 5%
		left 60%
	.weather-forecast-info
		position absolute
		top 22%
		& *
			padding 8px 0
		&:last-child
			left 50%
	.weather-forecast-baseinfo
		font-size .8em
		width 300px
		height 300px
		margin 20px 60px
	.weather-forecast-title
		font-size 1.2em
		margin-left 80px
	.activeWeather
		color transparent
		text-shadow 0 0 1px #ccc
		transition .5s
		&:hover
			color #333
			text-shadow rgb(69, 45, 45) 0px 0px 1px, rgb(255, 255, 251) 0px 0px 1px, rgb(255, 255, 251) 0px 0px 2px
</style>
