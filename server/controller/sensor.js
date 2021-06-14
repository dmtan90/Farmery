const Sensor = require('model/Sensor')
const Device = require('model/Device')
const SensorSeries = require('model/SensorSeries')
const SensorThreshold = require('model/SensorThreshold')
const { exportSensorSeries } = require('utils/exporter')
const log = require('utils/log')

const SensorApi = {
	async getSeries(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id, granularity, startTime, endTime } = ctx.request.query
			const isExisted = await Sensor.findById(_id)
			if(!isExisted){
				return ctx.sendError('Invalid sensor id!')
			}

			let filter = {
				sensorId: _id, 
				type: granularity,
				"meta.updatedAt": {"$gte": startTime, "$lte": endTime}
			}

			const count = await SensorSeries.countDocuments(filter)

			const sensorSeries = await SensorSeries.find(filter).sort({"meta.updatedAt":1})
				//.skip(page*limit).limit(limit).sort({"meta.updatedAt":-1})

			if (sensorSeries) {
				const data = {
					count: count,
					data: sensorSeries
				}
				ctx.send('The device data is successfully obtained!', { data })
			} else {
				ctx.sendError('Failed to obtain device data!')
			}
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to get sensor series data!')
		}
	},

	async exportSeries(ctx) {
		try{
			const account = ctx.state.user.data
			const { ids, granularity, startTime, endTime } = ctx.request.body
			try{
				const buffer = await exportSensorSeries(ids, granularity, startTime, endTime);
				ctx.send('The export data is successfully obtained!', { data: buffer })
			}catch(e){
				log.debug(e)
				ctx.sendError('Failed to export sensor series data!')	
			}
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to export sensor series data!')
		}
	},

	async getThreshold(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			if(!_id){
				return ctx.sendError('Invalid sensor id!')
			}

			let threshold = await SensorThreshold.findById(_id)
			if(threshold){
				return ctx.send('The sensor threshold data is successfully obtained!', { threshold })
			}
			else{
				ctx.sendError('Failed to get sensor threshold data!')
			}
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set sensor threshold data!')
		}
	},

	async getThresholds(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			if(!_id){
				return ctx.sendError('Invalid sensor id!')
			}

			let thresholds = await SensorThreshold.find({ sensorId: _id })
			if(thresholds){
				return ctx.send('The sensor threshold data is successfully obtained!', { threshold })
			}
			else{
				ctx.sendError('Failed to get sensor threshold data!')
			}
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set sensor threshold data!')
		}
	},

	async getThresholdsByDeviceId(ctx) {
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

			let thresholds = await SensorThreshold.find({ sensorId: { "$in": device.control.sensorIds } })
			if(thresholds){
				return ctx.send('The sensor threshold data is successfully obtained!', { thresholds })
			}
			else{
				ctx.sendError('Failed to get sensor threshold data!')
			}
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set sensor threshold data!')
		}
	},

	async setThreshold(ctx) {
		try{
			const account = ctx.state.user.data
			const thresholdData = ctx.request.body
			const sensor = await Sensor.findById(thresholdData.sensorId)
			if(!sensor){
				return ctx.sendError('Invalid sensor id!')
			}
			let filter = {
				sensorId: thresholdData.sensorId,
				cron: thresholdData.cron
			}
			let threshold = await SensorThreshold.findOne(filter)
			if(threshold){
				return ctx.sendError('threshold is existed!')
			}

			threshold = new SensorThreshold({
				sensorId: thresholdData.sensorId,
				cron: thresholdData.cron,
				onTime: thresholdData.onTime,
				threshold: thresholdData.threshold,
				percentage: thresholdData.percentage
			})
			
			const isSaved = threshold.save()
			if(isSaved){
				//set state to device by MQTT
				//exec the schedule job
				//await Schedulethreshold.startthreshold(threshold)
				return ctx.send('The sensor threshold data is successfully obtained!', { threshold })
			}
			ctx.sendError('Failed to set sensor threshold data!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set sensor threshold data!')
		}
	},

	async updateThreshold(ctx) {
		try{
			const account = ctx.state.user.data
			const thresholdData = ctx.request.body
			let threshold = await SensorThreshold.findById(thresholdData._id)
			if(!threshold){
				return ctx.sendError('Invalid sensor threshold id!')
			}

			if(thresholdData.status != undefined){
				threshold.status = thresholdData.status
			}

			if(thresholdData.cron != undefined){
				threshold.cron = thresholdData.cron
			}

			if(thresholdData.onTime != undefined){
				threshold.onTime = thresholdData.onTime
			}

			if(thresholdData.threshold != undefined){
				threshold.threshold = thresholdData.threshold
			}

			if(thresholdData.percentage != undefined){
				threshold.percentage = thresholdData.percentage
			}
			
			const isSaved = threshold.save()
			if(isSaved){
				//set state to device by MQTT
				//exec the schedule job
				//await Schedulethreshold.updatethreshold(threshold)
				return ctx.send('The sensor threshold data is successfully obtained!', { threshold })
			}
			ctx.sendError('Failed to set sensor threshold data!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to set sensor threshold data!')
		}
	},

	async deleteThreshold(ctx){
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.query
			let threshold = await SensorThreshold.findById(_id)
			//await Schedulethreshold.stopthreshold(threshold)

			const isSuccess = await threshold.remove()
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

module.exports = SensorApi
