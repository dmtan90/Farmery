<template lang="pug">
component(:is="view")
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

import IconSunny from '~/weather/icons/Sunny'
import IconRainy from '~/weather/icons/Rainy' //Rainy
import IconCloudy from '~/weather/icons/Cloudy' //Cloudy
import IconFlurries from '~/weather/icons/Flurries' //Flurries
import IconStorm from '~/weather/icons/Storm' //Storm
import IconShower from '~/weather/icons/Shower' //Shower

@Component({
	components: {
		IconSunny,
		IconRainy,
		IconCloudy,
		IconFlurries,
		IconStorm,
		IconShower
	},
	props:{
		weather:{
			type:String,
			required:true
		},
		code:{
			type:String,
			required:true
		}
	}
})
export default class WeatherIcon extends Vue {
	view = 'IconSunny'
	created() {
		const weather = this.weather
		const code = +this.code
		if (
			weather.includes('cloud') ||
			weather === 'moon' ||
			code >= 205 && code <= 213 ||
			code >= 500 && code <= 515
		) {
			this.view = 'IconCloudy'
		} else if (weather.includes('thunder')) {
			this.view = 'IconStorm'
		} else if (weather.includes('shower')) {
			this.view = 'IconShower'
		} else if (weather.includes('rainy')) {
			this.view = 'IconRainy'
		} else if (weather.includes('snow')) {
			this.view = 'IconFlurries'
		}
	}
}
</script>

<style lang="stylus">
</style>
