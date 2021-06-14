const Device = require('model/Device')
const Farm = require('model/Farm')
const Zone = require('model/Zone')
const DeviceModel = require('model/DeviceModel')
const log = require('utils/log')

const ZoneApi = {
	async update(ctx) {
		try{
			const account = ctx.state.user.data
			const zone = ctx.request.body

			let isZone = await Zone.findById(zone._id)
			if(!isZone){
				return ctx.sendError('Zone is not exited!')
			}

			if(zone.name){
				isZone.name = zone.name
			}

			if(zone.status != undefined){
				isZone.status = zone.status
			}

			if(zone.farmId){
				isZone.farmId = zone.farmId
			}

			if(zone.zoneType){
				isZone.zoneType = zone.zoneType
			}

			if(zone.cultivationType){
				isZone.cultivationType = zone.cultivationType
			}

			if(zone.zoneSize){
				isZone.zoneSize = zone.zoneSize
			}

			if(zone.avatar){
				isZone.avatar = zone.avatar
			}

			const isSuccess = await isZone.save()
			isSuccess
				? ctx.send('update successfully', { zone: isZone })
				: ctx.sendError('Rename failed due to force majeure!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to update zone data!')
		}
		
	},
	async delete(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.query
		const isSuccess = await Zone.findByIdAndDelete(_id)
		isSuccess ? ctx.send('successfully deleted') : ctx.sendError('The deletion failed due to force majeure!')
	},
	async rename(ctx) {
		const account = ctx.state.user.data
		const { _id, name } = ctx.request.body
		const isSuccess = await Zone.updateById(_id, { name })
		isSuccess
			? ctx.send('Renamed successfully', { zone: isSuccess })
			: ctx.sendError('Rename failed due to force majeure!')
	},
	async create(ctx) {
		try{
			const account = ctx.state.user.data
			const zone = ctx.request.body
			const { farmId, name } = zone
			const isExisted = await Zone.findOne({ farmId, name })
			if(isExisted){
				return ctx.sendError('Zone name is exited!')
			}

			const farm = await Farm.findById(farmId)
			if(!farm){
				return ctx.sendError('Farm is not exited!')
			}

			const newZone = new Zone({ ...zone })

			const isSuccess = await newZone.save()
			if (isSuccess) {
				newZone.farm = farm.getShort()
				ctx.send('The zone adds successfully!', { newZone })
			} else {
				ctx.sendError('Failed to create zone data!')
			}
		}catch(e){
			log.debug(e)
			ctx.sendError('Failed to create zone data!')
		}
	},
	async get(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.request.query
		const zone = await Zone.findById(_id)
		if (zone) {
			const farm = await Farm.findById(zone.farmId)
			zone.farm = farm.getShort()

			ctx.send('The zone data is successfully obtained!', { zone })
		} else {
			ctx.sendError('Failed to obtain zone data!')
		}
	},
	async gets(ctx) {
		try{
			const account = ctx.state.user.data
			let { farmIds, name } = ctx.request.query
			if(farmIds == undefined || farmIds.length === 0) {
				farmIds = []
				let farmFilter = {
					$or: [
						{ ownerId: account },
						{ "share.adminIds": { $in: [account] } }, 
						{ "share.userIds": { $in: [account] } }
					]
				}
				const farms = await Farm.find(farmFilter)
				//const farmIds = []
				farms.forEach(f => {
					farmIds.push(f._id)
				})
			}

			let filter = {
				farmId: { $in: farmIds }
			}

			if(name != undefined && name !== ''){
				filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
			}

			const zones = await Zone.find(filter)
			if(zones){
				for(let i = 0; i < zones.length; i++){
					let zone = zones[i]
					const farm = await Farm.findById(zone.farmId)
					zone.farm = farm.getShort()
				}
				
				return ctx.send('The zones data is successfully obtained!', { zones })
			}
			return ctx.sendError('Failed to obtain zones data!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to obtain zones data!')
		}
		
	},
	async count(ctx) {
		try{
			const account = ctx.state.user.data
			let { farmIds, name } = ctx.request.query
			if(farmIds == undefined || farmIds.length === 0) {
				farmIds = []
				let farmFilter = {
					$or: [
						{ ownerId: account },
						{ "share.adminIds": { $in: [account] } }, 
						{ "share.userIds": { $in: [account] } }
					]
				}
				const farms = await Farm.find(farmFilter)
				//const farmIds = []
				farms.forEach(f => {
					farmIds.push(f._id)
				})
			}

			let filter = {
				farmId: { $in: farmIds }
			}

			if(name != undefined && name !== ''){
				filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
			}

			const count = await Zone.countDocuments(filter)
			return ctx.send('The zones data is successfully obtained!', { count })
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to obtain zones data!')
		}
		
	},
	async getZoneByFarm(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.request.query
		const zones = await Zone.find({farmId: _id})
		if (zones) {
			ctx.send('The zones data is successfully obtained!', { zones })
		} else {
			ctx.sendError('Failed to obtain zones data!')
		}
	},
	async getTypes(ctx) {
		const types = (new Zone()).getTypes()
		ctx.send('The zone types data is successfully obtained!', { types })
	},
	async getUnits(ctx) {
		const units = (new Zone()).getUnits()
		ctx.send('The zone units data is successfully obtained!', { units })
	},
	async getCultivations(ctx) {
		const cultivations = (new Zone()).getCultivations()
		ctx.send('The zone cultivations data is successfully obtained!', { cultivations })
	},
}

module.exports = ZoneApi
