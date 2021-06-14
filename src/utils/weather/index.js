const getType = type => {
	let result = 'Environment'
	switch (type) {
		case 'cw':
			result = 'Car wash'
			break
		case 'drsg':
			result = 'Dressing'
			break
		case 'flu':
			result = 'Cold'
			break
		case 'sport':
			result = 'Movement'
			break
		case 'trav':
			result = 'Tourism'
			break
		case 'uv':
			result = 'UV'
			break
		case 'air':
			result = 'Air pollution'
			break
		case 'ac':
			result = 'Air conditioning opening'
			break
		case 'ag':
			result = 'Allergy'
			break
		case 'gl':
			result = 'Sunglasses'
			break
		case 'mu':
			result = 'Makeup'
			break
		case 'airc':
			result = 'Drying'
			break
		case 'ptfc':
			result = 'Traffic'
			break
		case 'fsh':
			result = 'Fishing'
			break
		case 'spi':
			result = 'Sun protection'
			break
	}
	return result
}
const filterForecastInfo = (weather, index) => {
	const result = {}
	result.date = index ? 'day after tomorrow' : 'tomorrow'

	result.day = {}
	result.night = {}
	result.day.weather = weather.cond_txt_d
	result.day.code = weather.cond_code_d
	result.night.weather = weather.cond_txt_n
	result.night.code = weather.cond_code_n

	result.humidity = weather.hum
	result.seeing = weather.vis

	result.temperature = {}
	result.temperature.max = weather.tmp_max
	result.temperature.min = weather.tmp_min

	result.wind = {}
	result.wind.direction = weather.wind_dir
	result.wind.power = weather.wind_sc
	result.wind.speed = weather.wind_spd

	/* Precipitation amount */
	result.precipitation = {}
	result.precipitation.value = weather.pcpn
	result.precipitation.probability = weather.pop

	/* Ultraviolet rays */
	result.ultraviolet = weather.uv_index

	return result
}
export default {
	now(weather){
		if(weather){
			const result = {}
			result.weather = weather.cond_txt
			result.code = weather.cond_code

			result.wind = {}
			result.wind.direction = weather.wind_dir
			result.wind.power = weather.wind_sc
			result.wind.speed = weather.wind_spd

			result.humidity = weather.hum
			result.temperature = weather.tmp

			result.precipitation = weather.pcpn
			result.seeing = weather.vis
			result.sun = weather.sun

			return result
		}
	},
	lifestyle(weather){
		if(weather){
			return weather.map(e => {
				const type = getType(e.type)
				const { brf: level, txt: describe } = e
				return { type, level, describe }
			})
		}
	},

	forecast(weather){
		if(weather){
			return weather.slice(1).map(filterForecastInfo)
		}
	}
}

/*
weather='Sunny'
code=1
wind={
direction:'northwest', //wind direction
power:3, //Wind
speed:15 //wind speed
}

temperature = 30 //temperature
humidity = 40 //Relative humidity

precipitation = 0 //precipitation
seeing = 10 //Visibility in kilometers
*/
