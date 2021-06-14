const User = require('model/User')
const Crop = require('model/Crop')
const Zone = require('model/Zone')
const Farm = require('model/Farm')
const Plant = require('model/Plant')
const Sensor = require('model/Sensor')
const CropTimeline = require('model/CropTimeline')
const { writeImg } = require('utils/db/farm')
const { exportCropTimelines } = require('utils/exporter')
const log = require('utils/log')

const CropApi = {
	async update(ctx) {
		try{
			const account = ctx.state.user.data
			const {_id, name, status, size, plantId, zoneId, startDate, endDate } = ctx.request.body

			let crop = await Crop.findById(_id)
			if(!crop){
				return ctx.sendError('Crop is not exited!')
			}

			if(name){
				crop.name = name
			}

			if(status != undefined){
				crop.status = status
				if(crop.status == false){
					this.endDate = (new Date()).getTime()
				}
			}

			if(size){
				crop.size = size
			}

			if(plantId){
				const plant = await Plant.findById(plantId)
				if(!plant){
					return ctx.sendError('Plant is not exited!')
				}
				crop.plantId = plantId
				crop.plant = plant.getShort()
			}

			if(zoneId){
				const zone = await Zone.findById(zoneId)
				if(!zone){
					return ctx.sendError('Zone is not exited!')
				}
				crop.zoneId = zoneId
				crop.zone = zone.getShort()
			}

			if(startDate){
				crop.startDate = startDate
			}

			if(endDate){
				crop.endDate = endDate
			}

			const isSuccess = await crop.save()
			isSuccess 
					? ctx.send('Status information updated successfully!', { crop }) 
					: ctx.sendError('Update failed due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Update failed due to force majeure!')
		}
	},
	async delete(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.query
			const isSuccess = await Crop.findByIdAndDelete(_id)
			isSuccess 
				? ctx.send('successfully deleted') 
				: ctx.sendError('The deletion failed due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('The deletion failed due to force majeure!')
		}
	},
	async rename(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id, name } = ctx.request.body
			const isSuccess = await Crop.updateById(_id, { name })
			isSuccess
				? ctx.send('Renamed successfully')
				: ctx.sendError('Rename failed due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Rename failed due to force majeure!')
		}
		
	},
	async create(ctx) {
		try{
			const account = ctx.state.user.data
			const crop = ctx.request.body
			const { zoneId, plantId, name } = crop
			let isCrop = await Crop.findOne({ zoneId, name })
			if(isCrop){
				return ctx.sendError('Crop name is exited!')
			}

			const plant = await Plant.findById(plantId)
			if(!plant){
				return ctx.sendError('Plant is not exited!')
			}

			const zone = await Zone.findById(zoneId)
			if(!zone){
				return ctx.sendError('Zone is not exited!')
			}

			isCrop = new Crop({ ...crop })

			isCrop.plant = plant.getShort()
			isCrop.zone= zone.getShort()

			const isSuccess = await isCrop.save()
			isSuccess 
					? ctx.send('The crop adds successfully!', { isCrop }) 
					: ctx.sendError('Failed to create crop data!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to create crop data!')
		}
	},
	async get(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.request.query
		const crop = await Crop.findById(_id)
		if (crop) {
			ctx.send('The crop data is successfully obtained!', { crop })
		} else {
			ctx.sendError('Failed to obtain crop data!')
		}
	},
	async gets(ctx) {
		try{
			const account = ctx.state.user.data
			let { name, farmIds, zoneIds, plantIds, status, startDate, endDate } = ctx.request.body

			log.debug(farmIds)
			log.debug(zoneIds)
			log.debug(plantIds)
			log.debug(status)
			log.debug(startDate)
			log.debug(endDate)

			let filter = {}
			if(name !== undefined && name != ""){
				filter["name"] = { "$regex" : ".*" + name + ".*", "$options" : "i" }
			}

			if(farmIds == undefined){
				const farms = await Farm.find({ "$or": [
					{ ownerId: account }, 
					{ "share.adminIds": { $in: [account] } }, 
					{ "share.userIds": { $in: [account] } }
				] })
				farmIds = []
				farms.forEach(f => {
					farmIds.push(f._id)
				})
			}

			if(zoneIds == undefined){
				const zones = await Zone.find({ farmId: { $in: farmIds } })
				zoneIds = []
				zones.forEach(z => {
					zoneIds.push(z._id)
				})
			}

			filter["zoneId"] = { $in: zoneIds }
			if(plantIds != undefined && plantIds.length > 0){
				filter["plantId"] = { $in: plantIds }
			}

			if(status != undefined){
				filter["status"] = Boolean(status)
			}

			if(startDate != undefined && endDate != undefined){
				filter["$or"] = [
					{"startDate": {"$gte": startDate, "$lte": startDate}},
					{"endDate": {"$gte": endDate, "$lte": endDate}}
				]
			}

			log.debug(filter)
			

			const crops = await Crop.find(filter)
			if (crops) {
				for(let i = 0; i < crops.length; i++){
					let crop = crops[i]
					const zone = await Zone.findById(crop.zoneId)
					if(zone){
						crop.zone = zone.getShort()
					}

					const plant = await Plant.findById(crop.plantId)
					if(plant){
						crop.plant = plant.getShort()
					}
				}
				ctx.send("The crops data is successfully obtained!", { crops })
			} else {
				ctx.sendError("Failed to obtain crop data!")
			}
		}
		catch(e){
			log.error(e)
			ctx.sendError("Failed to obtain crop data!")
		}
		
	},
	async count(ctx) {
		try{
			const account = ctx.state.user.data
			let { name, farmIds, zoneIds, plantIds } = ctx.request.query

			let filter = {}
			if(name !== undefined && name != ""){
				filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
			}

			if(farmIds == undefined){
				const farms = await Farm.find({ "$or": [
					{ ownerId: account }, 
					{ "share.adminIds": { $in: [account] } }, 
					{ "share.userIds": { $in: [account] } }
				] })
				farmIds = []
				farms.forEach(f => {
					farmIds.push(f._id)
				})
			}

			if(zoneIds == undefined){
				const zones = await Zone.find({ farmId: { $in: farmIds } })
				zoneIds = []
				zones.forEach(z => {
					zoneIds.push(z._id)
				})
			}

			filter['zoneId'] = { $in: zoneIds }
			if(plantIds != undefined && plantIds.length > 0){
				filter['plantId'] = { $in: plantIds }
			}
			

			const count = await Crop.countDocuments(filter)
			ctx.send('The crops data is successfully obtained!', { count })
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to obtain crop data!')
		}
		
	},
	async getCropByFarm(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.request.query
		const zones = await Zone.find({farmId: _id})
		if(!zones){
			return ctx.sendError('No zone data!')
		}
		let zoneIds = []
		zones.forEach(z => {
			zoneIds.push(z._id)
		})

		const crops = await Crop.find({ zoneId: {"$in": zoneIds} })
		if (crops) {
			ctx.send('The crops data is successfully obtained!', { crops })
		} else {
			ctx.sendError('Failed to obtain crops data!')
		}
	},
	async getUnits(ctx) {
		const units = (new Crop()).getUnits()
		ctx.send('The crop units data is successfully obtained!', { units })
	},
	async createTimeline(ctx) {
		try{
			const account = ctx.state.user.data
			const story = ctx.request.body
			const { cropId, subject, content, medias, tags, date } = story

			let crop = await Crop.findById(cropId)
			if(!crop){
				return ctx.sendError('Crop is not existed!')
			}

			if(!crop.status){
				return ctx.sendError('Crop is done!')
			}

			if(subject === undefined){
				subject = ""
			}

			if(content === undefined){
				content = ""
			}

			if(medias === undefined){
				medias = []
			}

			if(tags === undefined){
				tags = []
			}

			if(date === undefined){
				date = (new Date()).getTime()
			}

			let owner = {};

			if(account){
				owner = await User.findOne({ email: account })
				if(owner){
					owner = owner.getShort();	
				}
			}
			else{
				account = "Robot";
			}

			//const owner = await User.findOne({ email: account })

			let params = { cropId, ownerId: account, owner: owner, subject, content, medias, tags, date }
			let timeline = new CropTimeline({ ...params })
			let updateCrop = false;
			timeline.tags.forEach(tag => {
				if(crop.tags.indexOf(tag) < 0){
					crop.tags.push(tag);
					updateCrop = true;
				}
			})

			if(updateCrop){
				await crop.save();
			}

			const isSuccess = await timeline.save()
			isSuccess 
					? ctx.send('The crop timeline adds successfully!', { timeline }) 
					: ctx.sendError('Failed to create crop timeline data!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to create crop timeline data!')
		}
	},
	async getTimeline(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.request.query
		const timeline = await CropTimeline.findById(_id)
		if (timeline) {
			ctx.send('The crop timeline data is successfully obtained!', { timeline })
		} else {
			ctx.sendError('Failed to obtain crop timeline data!')
		}
	},
	async updateTimeline(ctx) {
		try{
			const account = ctx.state.user.data
			const {_id, subject, content, medias, date, status } = ctx.request.body

			const timeline = await CropTimeline.findById(_id)
			if(!timeline){
				return ctx.sendError('Crop timline is not exited!')
			}

			if(subject){
				timeline.subject = subject
			}

			if(content){
				timeline.content = content
			}

			if(status != undefined){
				timeline.status = status
			}

			if(medias){
				timeline.medias = medias
			}

			if(tags){
				timeline.tags = tags
			}

			if(date){
				timeline.date = date
			}

			const isSuccess = await timeline.save()
			let crop = await Crop.findById(timeline.cropId);
			let updateCrop = false;
			timeline.tags.forEach(tag => {
				if(crop.tags.indexOf(tag) < 0){
					crop.tags.push(tag);
					updateCrop = true;
				}
			})

			if(updateCrop){
				await crop.save();
			}

			isSuccess 
					? ctx.send('Status information updated successfully!', { timeline }) 
					: ctx.sendError('Update failed due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Update failed due to force majeure!')
		}
	},
	async deleteTimeline(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.query
			const isSuccess = await CropTimeline.findByIdAndDelete(_id)
			isSuccess 
				? ctx.send('successfully deleted') 
				: ctx.sendError('The deletion failed due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('The deletion failed due to force majeure!')
		}
	},
	async getTimelines(ctx) {
		try{
			const account = ctx.state.user.data
			let { _id, name, startTime, endTime } = ctx.request.body

			const crop = await Crop.findById(_id);
			if(!crop){
				return ctx.sendError('Crop is not exited!')
			}

			let filter = {
				cropId: _id
			}
			
			if(name !== undefined && name != ""){
				filter["$or"] = [
					{"content": { "$regex" : ".*" + name + ".*", "$options" : "i" }},
					{"subject": { "$regex" : ".*" + name + ".*", "$options" : "i" }},
					{"tags": { $in: [name] }}
				]
				// filter["content"] = { "$regex" : ".*" + name + ".*", "$options" : "i" }
			}

			if(startTime != undefined && endTime != undefined){
				filter["date"] = {"$gte": startTime, "$lte": endTime}
			}

			log.debug(filter)

			const timelines = await CropTimeline.find(filter).sort({ date: -1 })
			if (timelines) {
				ctx.send("The crops timelines data is successfully obtained!", { timelines })
			} else {
				ctx.sendError("Failed to obtain crop timelines data!")
			}
		}
		catch(e){
			log.error(e)
			ctx.sendError("Failed to obtain crop data!")
		}
	},
	async exportTimeline(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id, deviceIds, startTime, endTime } = ctx.request.body
			const crop = await Crop.findById(_id);
			if(!crop){
				return ctx.sendError('Crop is not exited!')
			}
			try{
				let sensorIds = null
				if(deviceIds && deviceIds.length > 0){
					sensorIds = []
					let sensors = await Sensor.find({ deviceId: { "$in": deviceIds } })
					sensors.forEach(sensor => {
						sensorIds.push(sensor._id)
					})
				}
				const buffer = await exportCropTimelines(_id, startTime, endTime, sensorIds);
				ctx.send('The export data is successfully obtained!', { data: buffer })
			}catch(e){
				log.error(e)
				ctx.sendError('Failed to export timeline data!')	
			}
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to export timeline data!')
		}
	},
}

module.exports = CropApi
