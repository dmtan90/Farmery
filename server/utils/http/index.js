const axios = require('axios')
const config = require('config/weather')

module.exports = {
	async getWeather(latitude, longitude) {
		const { weather, sun, air } = config

		const http = axios.create({ params: { location: `${longitude},${latitude}`, key: config.key } })

		// return axios.all([http.get(weather), http.get(sun), http.get(air)])
		// 	.then(axios.spread(({ data: { HeWeather6: { '0': weatherInfo } } }, { data: { HeWeather6: { '0': sunInfo } } }, { data: { HeWeather6: { '0': airInfo } }
		// }) => {
		// 	return { weatherInfo, sunInfo, airInfo }
		// })).catch(e=>{
		// 	console.log(e)
		// })

		return http.get(weather)
			.then(({ data: { HeWeather6: { '0': weatherInfo } } })=>weatherInfo)
			.catch(e=>{ console.error(e) })

	},
	isSunnyorCloudy(weather) {
		const info = weather.now.cond_txt
		let result = true
		if (info.includes('moon') || info.includes('rain') || info.includes('snow') || info.includes('storm')) {
			result = false
		}
		return result
	},
	getSunMoveTime(weather) {
		const { sr, ss } = weather.daily_forecast[0]
		const srTimes = sr.split(':')
		const ssTimes = ss.split(':')
		const up = {
			hour: srTimes[0],
			minute:srTimes[1]
		}
		const down = {
			hour: ssTimes[0],
			minute:ssTimes[1]
		}
		return {up,down}
	}
}
