const Device = require('model/Device')
const Sensor = require('model/Sensor')
const Relay = require('model/Relay')
const RelayTimer = require('model/RelayTimer')
const SensorThreshold = require('model/SensorThreshold')
const SensorSeries = require('model/SensorSeries')
const Cron = require('./node-cron/node-cron.js')
//const Schedule = require('node-schedule')
const Moment = require('moment-timezone')
const pubDevice = require('utils/mqtt/pubDevice')
const log = require('utils/log')
let instance = null

class SystemTasks {
	async start(){
		log.debug('start SystemTask')
		instance = this
		if(this.jobs == undefined){
			this.jobs = []
		}
		this.stop()

		let timers = []

		//register sync profile to device task
		timers.push({
			_id: 'device_profile',
			type: 'device_profile',
			cron: '0 */3 * * * *'//every 10 minutes
		})

		timers.push({
			_id: 'sensor_aggregation_hourly',
			type: 'sensor_aggregation',
			cron: '0 0 */1 * * *',//every hour
			granularity: 'hourly'
		})
		//daily aggregation
		timers.push({
			_id: 'sensor_aggregation_daily',
			type: 'sensor_aggregation',
			cron: '0 0 0 * * *',//run at 00:00 of day
			granularity: 'daily'
		})
		//weekly aggregation
		timers.push({
			_id: 'sensor_aggregation_weekly',
			type: 'sensor_aggregation',
			cron: '0 0 0 * * 0',//run at sunday of week
			granularity: 'weekly'
		})
		//monthly aggregation
		timers.push({
			_id: 'sensor_aggregation_monthly',
			type: 'sensor_aggregation',
			cron: '0 0 0 1 */1 *',//run at first day of month
			granularity: 'monthly'
		})

		timers.forEach(timer => {
			this.startTimer(timer)
		})
	}

	async stop(){
		log.debug('stop SystemTask size=' + this.jobs.length)
		for(let i = 0; i < this.jobs.length; i++){
			this.jobs[i].job.stop()
			this.jobs[i].job.destroy()
		}
		this.jobs = []
	}

	async startTimer(timer){
		var isValid = Cron.validate(timer.cron);
		if(!isValid){
			return;
		}
		if(timer.type == 'device_profile'){
			//schedule on time
			log.debug('device_profile: ' + timer._id)
			let job = Cron.schedule(timer.cron, async (data) => {
				await instance.syncDeviceProfile()
			}, {
				scheduled: true,
				params: timer
			})
			this.jobs.push({_id: timer._id, job: job, data: timer})
			
		} else if(timer.type == 'sensor_aggregation'){
			//schedule on time
			let job = Cron.schedule(timer.cron, async (data) => {
				let granularity = data.granularity
				log.debug('Start sensor aggregation ' + granularity + ' ' + data.cron)
				await instance.aggrSensorData(granularity)
			}, {
				scheduled: true,
				params: timer
			})
			this.jobs.push({_id: timer._id, job: job, data: timer})
		}
	}

	async syncDeviceProfile(){
		log.debug("syncDeviceProfile")
		let devices = await Device.find({ status: true })
		for(let i = 0; i < devices.length; i++){
			let device = devices[i]
			let relayTimers = await RelayTimer.find({ relayId: {$in: device.control.relayIds}, status: true })
			let sensorThresholds = await SensorThreshold.find({ sensorId: {$in: device.control.sensorIds}, status: true })
			
			let now = Moment().tz('Asia/Ho_Chi_Minh')
			let secOfDay = now.hour() * 60 * 60 + now.minute() * 60 + now.second()
			let payload = {
				device_mac_address: device.uid,
				profile: {
					controllers: [],
					sensors: []
				},
				start_time: secOfDay
			}

			if(relayTimers && relayTimers.length > 0){
				relayTimers = relayTimers.map((el, index) => {
					let startTime = Moment(el.onTime).tz('Asia/Ho_Chi_Minh')
					let endTime = Moment(el.offTime).tz('Asia/Ho_Chi_Minh')
					let startTimeS = startTime.hour() * 60 * 60 + startTime.minute() * 60 + startTime.second()
					let endTimeS = endTime.hour() * 60 * 60 + endTime.minute() * 60 + endTime.second()
					el.onTime = startTimeS
					el.offTime = endTimeS
					return el
				})

				relayTimers = relayTimers.sort((a,b) => {
					if(a._id > b._id) {
						return 1
					} else if(a._id < b._id) {
						return -1
					} else {
						if(a.onTime > b.onTime){
							return 1
						} else if(a.onTime < b.onTime){
							return -1
						} else {
							0
						}
					}
				})

				//log.debug("Before reduce")
				//log.debug(relayTimers)
				relayTimers = relayTimers.filter((el, idx) => {
					let next = relayTimers[idx+1]
					if(secOfDay >= el.onTime && secOfDay <= el.offTime){
						if(next == undefined){
							return true
						} else if(el._id != next._id){
							return true
						} else if(secOfDay < next.onTime || secOfDay > next.offTime){
							return true
						}
					}
					return false
				})

				//log.debug("After reduce")
				//log.debug(relayTimers)
				for(let i = 0 ; i < relayTimers.length; i++){
					let timer = relayTimers[i]
					let relay = await Relay.findById(timer.relayId)
					if(relay){
						payload.profile.controllers.push({
							controller_type: relay.type,
							controller_mode: timer.type,
							controller_cycle: {
								on: timer.cycle.onTime,
								off: timer.cycle.offTime
							},
							controller_time: {
								start: timer.onTime,
								end: timer.offTime
							}
						})
					}
				}
			}

			if(sensorThresholds && sensorThresholds.length > 0){
				sensorThresholds = sensorThresholds.map((el, index) => {
					let startTime = Moment(el.onTime).tz('Asia/Ho_Chi_Minh')
					//let endTime = Moment(timer.offTime).tz('Asia/Ho_Chi_Minh')
					let startTimeS = startTime.hour() * 60 * 60 + startTime.minute() * 60 + startTime.second()
					//let endTimeS = endTime.hour() * 60 * 60 + endTime.minute() * 60 + endTime.second()
					el.onTime = startTimeS
					//el.endTimeS = endTimeS
					return el
				})

				sensorThresholds = sensorThresholds.sort((a,b) => {
					if(a._id > b._id) {
						return 1
					} else if(a._id < b._id) {
						return -1
					} else {
						if(a.onTime > b.onTime){
							return 1
						} else if(a.onTime < b.onTime){
							return -1
						} else {
							0
						}
					}
				})

				//log.debug("Before reduce")
				//log.debug(sensorThresholds)
				sensorThresholds = sensorThresholds.filter((el, idx) => {
					let next = sensorThresholds[idx+1]
					if(secOfDay >= el.onTime){
						if(next == undefined){
							return true
						} else if(el._id != next._id){
							return true
						} else if(secOfDay < next.onTime){
							return true
						}
					}
					return false
				})

				//log.debug("After reduce")
				//log.debug(sensorThresholds)
				for(let i = 0; i < sensorThresholds.length; i++){
					let threshold = sensorThresholds[i]
					let sensor = await Sensor.findById(threshold.sensorId)
					if(sensor){
						payload.profile.sensors.push({
							sensor_type: sensor.type,
							sensor_threshold: {
								min: threshold.threshold.minValue,
								max: threshold.threshold.maxValue
							},
							sensor_formula: {
								a: threshold.percentage.a,
								b: threshold.percentage.b,
								c: threshold.percentage.c,
								d: threshold.percentage.d,
								dosing_time: threshold.percentage.dosing_time,
								dosing_inteval: threshold.percentage.dosing_interval
							},
							sensor_time: {
								start: threshold.onTime,
								end: threshold.onTime + 60*60
							}
						})
					}
				}
			}
			if(payload.profile.sensors.length != 0 || payload.profile.controllers.length != 0){
				log.debug("Send to device " + device.uid + " profile: " + JSON.stringify(payload))
				await pubDevice.setDeviceProfile(device, payload)
			}
		}
	}

	getTimeRange(granularity){
		let now = Moment().tz('Asia/Ho_Chi_Minh')
		now.millisecond(0)

		let startTs = now.valueOf()
		let endTs = startTs
		if(granularity == 'hourly'){
			endTs -= (60 * 60 * 1000)
		} else if(granularity == 'daily'){
			endTs -= (24 * 60 * 60 * 1000)
		} else if(granularity == 'weekly'){
			endTs -= (7 * 24 * 60 * 60 * 1000)
		} else if(granularity == 'monthly'){
			const lastMonth = now.month() - 1
			if(lastMonth == -1){
				lastMonth = 11
			}
			now.month(lastMonth)
			const dayInMonth = now.daysInMonth()
			endTs -= (dayInMonth * 24 * 60 * 60 * 1000)
		}
		return {
			startTime: startTs,
			endTime: endTs
		}
	}

	getPrevGranularity(granularity){
		let prev = 'utm'
		if(granularity == 'hourly'){
			prev = 'utm'
		} else if(granularity == 'daily'){
			prev = 'hourly'
		} else if(granularity == 'weekly'){
			prev = 'daily'
		} else if(granularity == 'monthly'){
			prev = 'daily'
		}
		return prev
	}

	async aggrSensorData(granularity){
		log.debug("======================================================================")

		let time = this.getTimeRange(granularity)
		let startTime = Moment(time.startTime)
		let endTime = Moment(time.endTime)
		let startTimeStr = startTime.format("YYYY/MM/DD HH:mm:ss")
		let endTimeStr = endTime.format("YYYY/MM/DD HH:mm:ss")
		log.debug("aggrSensorData - " + granularity + " - " + startTimeStr + " - " + endTimeStr)

		let aggregate = [
			{
				$match: {
					"type": this.getPrevGranularity(granularity),
					"meta.updatedAt": { "$lte" : time.startTime, "$gte" : time.endTime }
				}
			},
			{
				$project: {
					"_id": 0,
					"sensorId": 1,
					"value": 1,
					"aggregation": 1
				}
			},
			{
				$group: {
					"_id": "$sensorId",
					"value": {"$avg": "$value"},
					"min": { "$min": (granularity == "hourly" ? "$value" : "$aggregation.min") },
					"max": { "$max": (granularity == "hourly" ? "$value" : "$aggregation.max") },
					"avg": { "$avg": (granularity == "hourly" ? "$value" : "$aggregation.avg") },
					"med": { "$avg": (granularity == "hourly" ? "$value" : "$aggregation.med") }
				}
			},
			{
				$project: {
					"_id": 1,
					"value": 1,
					"min": 1,
					"max": 1,
					"med": 1,
					"avg": 1
				}
			}
		]

		log.debug(JSON.stringify(aggregate))

		const aggregates = await SensorSeries.aggregate(aggregate)
		if(aggregates){
			let sensorSeries = []
			for(let i = 0; i < aggregates.length; i++){
				let aggr = aggregates[i]
				let sensorId = aggr._id
				let sensor = await Sensor.findById(sensorId)
				let aggregation = {
					min: aggr.min,
					max: aggr.max,
					avg: aggr.avg,
					med: aggr.med
				}

				let params = { 
					sensorId: sensorId,
					value: aggr.value,
					aggregation: aggregation,
					type: granularity,
					unit: sensor.unit
				}

				let sensorSerie = new SensorSeries({ ...params})
				sensorSeries.push(sensorSerie)
				await sensorSerie.save()
			}
			//await SensorSeries.insertMany(sensorSeries)
		}
		log.debug("======================================================================")
	}

	async buildCronRecurrenceRule(cron, tz){
		if(cron == undefined || cron == ""){
			return null
		}
		const crons = cron.split(' ')
		let onRule = new Schedule.RecurrenceRule()
		const second = this.getRuleValue(crons[0], 0, 59)
		if(second != null){
			onRule.second = second
		}

		const minute = this.getRuleValue(crons[1], 0, 59)
		if(minute != null){
			onRule.minute = minute
		}

		const hour = this.getRuleValue(crons[2], 0, 23)
		if(hour != null){
			onRule.hour = hour
		}

		const date = this.getRuleValue(crons[3], 1, 31)
		if(date != null){
			onRule.date = date
		}

		const month = this.getRuleValue(crons[4], 0, 11)
		if(month != null){
			onRule.month = month
		}

		const dayOfWeek = this.getRuleValue(crons[5], 0, 6)
		if(dayOfWeek != null){
			onRule.dayOfWeek = dayOfWeek
		}
		/*if(crons[5] !== '*' && crons[5].indexOf(',') >= 0){
			onRule.dayOfWeek = []
			let days = crons[5].split(',')
			days.forEach(day => {
				onRule.dayOfWeek.push(parseInt(day))
			})
		}*/
		if(tz == undefined){
			tz = 'Etc/GMT-7'
		}
		onRule.tz = tz
		log.debug(onRule)
		return onRule
	}

	getRuleValue(value, start, end) {
		if (/^[*\d][\/][\d]+$/.test(value)) {
		    return new Schedule.Range(start, end, parseInt(value.split('/')[1]))
		}
		else if (value == '*') {
		    return null
		}
		else {
		    return parseInt(value)
		}
	}
}

global.SystemTasks = global.SystemTasks || new SystemTasks()

