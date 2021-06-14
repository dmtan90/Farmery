const Relay = require('model/Relay')
const RelayTimer = require('model/RelayTimer')
const Schedule = require('node-schedule')
const Moment = require('moment-timezone')
const pubDevice = require('utils/mqtt/pubDevice')
const log = require('utils/log')

//const { generateTask } = require('utils/task')
//const log = require('utils/log')

class ScheduleTimer {
	async start(){
		log.debug('start ScheduleTimer')
		if(this.jobs == undefined){
			this.jobs = []
		}
		this.stop()
		const timers = await RelayTimer.find({status: true})
		for(let i = 0; i < timers.length; i++){
			this.startTimer(timers[i])
		}
	}

	async stop(){
		log.debug('stop ScheduleTimer size=' + this.jobs.length)
		for(let i = 0; i < this.jobs.length; i++){
			this.jobs[i].cancel()
		}
		this.jobs = []
	}

	async stopTimer(timer){
		//log.debug('stopTimer ScheduleTimer size=' + this.jobs.length)
		for(let i = 0; i < this.jobs.length; i++){
			let job = this.jobs[i]
			if(timer._id === job._id){
				job.cancel()
				this.jobs.splice(i, 1)
				i--
				//break
			}
		}
	}

	async startTimer(timer){
		/*log.debug('startTimer ScheduleTimer size=' + this.jobs.length)
		log.debug('startTimer ScheduleTimer cron=' + timer.cron)
		log.debug('startTimer ScheduleTimer type=' + timer.type)
		log.debug('startTimer ScheduleTimer status=' + timer.status)*/
		if(!timer.status){
			return
		}

		const crons = timer.cron.split(' ')
		//schedule mode
		if(timer.type === 1){
			if(this.shouldRunNow(timer)){
				log.debug('Start timer for relay ' + timer.relayId)
				//log.debug('Start timer cron ' + timer.cron)
				
				let relay = await Relay.findById(timer.relayId)
				if(relay){
					relay.state = true
					await relay.save()
					pubDevice.setRelayState(relay, true)	
				}
			}

			let onRule = new Schedule.RecurrenceRule()
			onRule.second = parseInt(crons[0])
			onRule.minute = parseInt(crons[1])
			onRule.hour = parseInt(crons[2])
			if(crons[5] !== '*' && crons[5].indexOf(',') >= 0){
				onRule.dayOfWeek = []
				let days = crons[5].split(',')
				days.forEach(day => {
					onRule.dayOfWeek.push(parseInt(day))
				})
			}
			onRule.tz = 'Etc/GMT-7'

			//schedule on time
			let onJob = Schedule.scheduleJob(onRule, async function(data){
				log.debug('Start timer for relay ' + data.relayId)
				//log.debug(data)

				let relay = await Relay.findById(data.relayId)
				if(relay){
					relay.state = true
					await relay.save()
					pubDevice.setRelayState(relay, true)	
				}

			}.bind(null, timer))
			this.jobs.push({_id: timer._id, job: onJob, data: timer})

			//schedule off time
			let offDate = Moment(timer.offTime).tz('Asia/Ho_Chi_Minh')
			let offRule = new Schedule.RecurrenceRule()
			offRule.second = offDate.second()
			offRule.minute = offDate.minute()
			offRule.hour = offDate.hour()
			if(crons[5] !== '*' && crons[5].indexOf(',') >= 0){
				offRule.dayOfWeek = []
				let days = crons[5].split(',')
				days.forEach(day => {
					offRule.dayOfWeek.push(parseInt(day))
				})
			}
			onRule.tz = 'Etc/GMT-7'

			let offJob = Schedule.scheduleJob(offRule, async function(data){
				log.debug('Off timer for relay ' + data.relayId)
				//log.debug(data)
				let relay = await Relay.findById(data.relayId)
				if(relay){
					relay.state = false
					await relay.save()
					pubDevice.setRelayState(relay, false)	
				}
			}.bind(null, timer))
			this.jobs.push({_id: timer._id, job: offJob, data: timer})
		}
		else if(timer.type === 0){
			//let date = Moment().tz('Asia/Ho_Chi_Minh')
			let startDate = Moment(timer.onTime).tz('Asia/Ho_Chi_Minh')
			let endDate = Moment(timer.offTime).tz('Asia/Ho_Chi_Minh')
			let onTS = startDate.hour()*60*60 + startDate.minute()*60 + startDate.second()
			let offTS = endDate.hour()*60*60 + endDate.minute()*60 + endDate.second()
			let currentTS = onTS
			while(currentTS < offTS){
				let hour = parseInt(currentTS/3600)
				let minute = parseInt((currentTS - hour*3600)/60)
				let second = currentTS - hour*3600 - minute*60
				
				//let minute = (currentTS - hour*3600)/60

				let onRule = new Schedule.RecurrenceRule()
				onRule.second = second
				onRule.minute = minute
				onRule.hour = hour

				if(crons[5] !== '*' && crons[5].indexOf(',') >= 0){
					onRule.dayOfWeek = []
					let days = crons[5].split(',')
					days.forEach(day => {
						onRule.dayOfWeek.push(parseInt(day))
					})
				}
				onRule.tz = 'Etc/GMT-7'

				//log.debug(rule)

				//schedule on time
				let onJob = Schedule.scheduleJob(onRule, async function(data){
					log.debug('Start timer for relay ' + data.relayId)
					//log.debug(data)

					let relay = await Relay.findById(data.relayId)
					if(relay){
						relay.state = true
						await relay.save()
						pubDevice.setRelayState(relay, true)	
					}
				}.bind(null, timer))
				this.jobs.push({_id: timer._id, job: onJob, data: timer})

				currentTS = currentTS + timer.cycle.onTime*60
				
				hour = parseInt(currentTS/3600)
				minute = parseInt((currentTS - hour*3600)/60)
				second = currentTS - hour*3600 - minute*60

				let offRule = new Schedule.RecurrenceRule()
				offRule.second = second
				offRule.minute = minute
				offRule.hour = hour

				if(crons[5] !== '*' && crons[5].indexOf(',') >= 0){
					offRule.dayOfWeek = []
					let days = crons[5].split(',')
					days.forEach(day => {
						offRule.dayOfWeek.push(parseInt(day))
					})
				}
				offRule.tz = 'Etc/GMT-7'

				//log.debug(rule)

				let offJob = Schedule.scheduleJob(offRule, async function(data){
					log.debug('Off timer for relay ' + data.relayId)
					//log.debug(data)
					let relay = await Relay.findById(data.relayId)
					if(relay){
						relay.state = false
						await relay.save()
						pubDevice.setRelayState(relay, false)
					}
				}.bind(null, timer))
				//log.debug(offJob)
				this.jobs.push({_id: timer._id, job: offJob, data: timer})

				currentTS = currentTS + timer.cycle.offTime*60
			}
		}
	}

	async updateTimer(timer){
		//log.debug('updateTimer ScheduleTimer size=' + this.jobs.length)
		this.stopTimer(timer)
		if(timer.status == true){
			this.startTimer(timer)
		}
	}

	shouldRunNow(timer) {
		let date = Moment().tz('Asia/Ho_Chi_Minh')
		let startDate = Moment(timer.onTime).tz('Asia/Ho_Chi_Minh')
		let endDate = Moment(timer.offTime).tz('Asia/Ho_Chi_Minh')
		//let run = false
		if(timer.status == false){
			return false
		}
		//check within time range
		let currentTS = date.hour()*60*60 + date.minute()*60 + date.second()
		let onTS = startDate.hour()*60*60 + startDate.minute()*60 + startDate.second()
		let offTS = endDate.hour()*60*60 + endDate.minute()*60 + endDate.second()
		if(currentTS >= onTS && currentTS <= offTS){
			//run = true
			let crons = timer.cron.split(' ')
			//let dayOfWeek = crons[5]
			if(crons[5] === '*'){
				//run = true
				return true
			}
			if(crons[5].indexOf(',')){
				let days = crons[5].split(',')
				if(days.indexOf(crons[5]) >= 0){
					return true
				}
			}
			else{
				//direct format
				let dayOfWeek = date.format('d')
				if(dayOfWeek === crons[5]){
					return true
				}
			}
		}

		return false
	}

	/*
	* duration is seconds for set state, if duration equal 0 or undefined, not toggle action
	*/
	async setRelayState(relayId, state, duration){
		let relay = await Relay.findById(relayId)
		if(relay){
			relay.state = state
			await relay.save()
			pubDevice.setRelayState(relay, state)
			if(duration != undefined && duration > 0){
				let now = Moment().tz('Asia/Ho_Chi_Minh')
				//log.debug(now)
				now.millisecond(duration*1000)

				let nextRule = new Schedule.RecurrenceRule()
				nextRule.second = now.second()
				nextRule.minute = now.minute()
				nextRule.hour = now.hours()
				nextRule.date = now.date()
				nextRule.month = now.month()
				nextRule.year = now.year()

				let timer = {
					relayId: relayId,
					state: state
				}

				let nextJob = Schedule.scheduleJob(nextRule, async function(data){
					//log.debug(data)
					let relay = await Relay.findById(data.relayId)
					if(relay){
						relay.state = !data.state
						await relay.save()
						//revert state
						pubDevice.setRelayState(relay, !data.state)	
					}
				}.bind(null, timer))
			}
		}
	}
}

global.ScheduleTimer = global.ScheduleTimer || new ScheduleTimer()
