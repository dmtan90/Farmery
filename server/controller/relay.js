const Device = require('model/Device')
const Relay = require('model/Relay')
const RelayTimer = require('model/RelayTimer')
const RelaySeries = require('model/RelaySeries')
const pubDevice = require('utils/mqtt/pubDevice')
require('schedule/ScheduleTimer')
const log = require('utils/log')

const RelayApi = {
	async getSeries(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id, granularity, startTime, endTime } = ctx.request.query
			const isExisted = await Relay.findById(_id)
			if(!isExisted){
				return ctx.sendError('Invalid relay id!')
			}

			let filter = {
				relayId: _id, 
				type: granularity,
				"meta.updatedAt": {"$gte": startTime, "$lte": endTime}
			}

			const count = await RelaySeries.countDocuments(filter)

			const relaySeries = await RelaySeries.find(filter).sort({"meta.updatedAt":1})
				//.skip(page*limit).limit(limit).sort({"meta.updatedAt":-1})

			if (relaySeries) {
				const data = {
					count: count,
					data: relaySeries
				}
				ctx.send('The relay series data is successfully obtained!', { data })
			} else {
				ctx.sendError('Failed to obtain relay series data!')
			}
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to get relay state data!')
		}
	},

	async setState(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id, state } = ctx.request.body
			const relay = await Relay.findById(_id)
			if(!relay){
				return ctx.sendError('Invalid relay id!')
			}
			if(state != undefined){
				relay.state = state	
			}
			
			const isSaved = relay.save()
			if(isSaved){
				//set state to device by MQTT
				await pubDevice.setRelayState(relay, state)
				return ctx.send('The relay state data is successfully obtained!', { relay })
			}
			ctx.sendError('Failed to set relay state data!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set relay state data!')
		}
	},

	async getTimer(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			if(!_id){
				return ctx.sendError('Invalid relay id!')
			}

			let timer = await RelayTimer.findById(_id)
			if(timer){
				return ctx.send('The relay timer data is successfully obtained!', { timer })
			}
			else{
				ctx.sendError('Failed to get relay timer data!')
			}
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set relay timer data!')
		}
	},

	async getTimers(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			if(!_id){
				return ctx.sendError('Invalid relay id!')
			}

			let timers = await RelayTimer.find({ relayId: _id })
			if(timers){
				return ctx.send('The relay timer data is successfully obtained!', { timers })
			}
			else{
				ctx.sendError('Failed to get relay timer data!')
			}
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set relay timer data!')
		}
	},

	async getTimersByDeviceId(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			if(!_id){
				return ctx.sendError('Invalid device id!')
			}

			const device = await Device.findById(_id)
			if(!device){
				return ctx.sendError('Cannot find device!')
			}

			let timers = await RelayTimer.find({ relayId: { "$in": device.control.relayIds } })
			if(timers){
				return ctx.send('The relay timer data is successfully obtained!', { timers })
			}
			else{
				ctx.sendError('Failed to get relay timer data!')
			}
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set relay timer data!')
		}
	},

	async setTimer(ctx) {
		try{
			const account = ctx.state.user.data
			const timerData = ctx.request.body
			const relay = await Relay.findById(timerData.relayId)
			if(!relay){
				return ctx.sendError('Invalid relay id!')
			}
			let filter = {
				relayId: timerData.relayId,
				cron: timerData.cron
			}
			let timer = await RelayTimer.findOne(filter)
			if(timer){
				return ctx.sendError('Timer is existed!')
			}

			timer = new RelayTimer({
				relayId: timerData.relayId,
				cron: timerData.cron,
				type: timerData.type,
				onTime: timerData.onTime,
				offTime: timerData.offTime,
				cycle: timerData.cycle
			})
			
			const isSaved = timer.save()
			if(isSaved){
				//set state to device by MQTT
				//exec the schedule job
				await ScheduleTimer.startTimer(timer)
				return ctx.send('The relay timer data is successfully obtained!', { timer })
			}
			ctx.sendError('Failed to set relay timer data!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set relay timer data!')
		}
	},

	async updateTimer(ctx) {
		try{
			const account = ctx.state.user.data
			const timerData = ctx.request.body
			let timer = await RelayTimer.findById(timerData._id)
			if(!timer){
				return ctx.sendError('Invalid relay timer id!')
			}

			if(timerData.status != undefined){
				timer.status = timerData.status
			}

			if(timerData.cron != undefined){
				timer.cron = timerData.cron
			}

			if(timerData.onTime != undefined){
				timer.onTime = timerData.onTime
			}

			if(timerData.offTime != undefined){
				timer.offTime = timerData.offTime
			}

			if(timerData.cycle != undefined){
				timer.cycle = timerData.cycle
			}
			
			const isSaved = timer.save()
			if(isSaved){
				//set state to device by MQTT
				//exec the schedule job
				await ScheduleTimer.updateTimer(timer)
				return ctx.send('The relay timer data is successfully obtained!', { timer })
			}
			ctx.sendError('Failed to set relay timer data!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set relay timer data!')
		}
	},

	async deleteTimer(ctx){
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.query
			let timer = await RelayTimer.findById(_id)
			await ScheduleTimer.stopTimer(timer)

			const isSuccess = await timer.remove()
			isSuccess 
				? ctx.send('successfully deleted') 
				: ctx.sendError('The deletion failed due to force majeure!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('The deletion failed due to force majeure!')
		}
	}
}

module.exports = RelayApi
