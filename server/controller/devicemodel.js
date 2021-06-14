const Device = require('model/Device')
const DeviceModel = require('model/DeviceModel')
const User = require('model/User')
const log = require('utils/log')

const DeviceModelApi = {
	async update(ctx) {
		try{
			const account = ctx.state.user.data
			const model = ctx.request.body
			const {_id, name, uid, status, avatar, sensors, relays, dataFormat } = model

			const isSysAdmin = await User.findOne({email: account, role: 0})
			if(!isSysAdmin){
				return ctx.sendError('Permission denied!')
			}

			let isExisted = await DeviceModel.findOne({ uid: model.uid })
			if(!isExisted){
				return ctx.sendError('Device model is not exited!')
			}

			if(name != undefined){
				isExisted.name = name
			}

			if(uid != undefined && uid != isExisted.uid){
				isExisted.uid = uid
			}

			if(status != undefined){
				isExisted.status = status
			}

			if(avatar != undefined){
				isExisted.avatar = avatar
			}

			if(sensors != undefined){
				isExisted.sensors = sensors
			}

			if(relays != undefined){
				isExisted.relays = relays
			}

			if(dataFormat != undefined){
				isExisted.dataFormat = dataFormat
			}

			isExisted = await isExisted.save()

			isExisted
				? ctx.send('Update successfully', isExisted)
				: ctx.sendError('Update failed due to force majeure!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Update failed due to force majeure!')
		}
		
	},
	async delete(ctx) {
		try{
			const account = ctx.state.user.data
			const { uid } = ctx.query
			
			const isSysAdmin = await User.findOne({email: account, role: 0})
			if(!isSysAdmin){
				return ctx.sendError('Permission denied!')
			}

			const isSuccess = await DeviceModel.deleteOne({ uid })
			isSuccess 
				? ctx.send('successfully deleted') 
				: ctx.sendError('The deletion failed due to force majeure!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('The deletion failed due to force majeure!')
		}
	},
	async rename(ctx) {
		try{
			const account = ctx.state.user.data
			const { uid, name } = ctx.request.body
			
			const isSysAdmin = await User.findOne({email: account, role: 0})
			if(!isSysAdmin){
				return ctx.sendError('Permission denied!')
			}

			const isSuccess = await DeviceModel.updateOne({ uid }, { name })
			isSuccess
				? ctx.send('Renamed successfully')
				: ctx.sendError('Rename failed due to force majeure!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Rename failed due to force majeure!')
		}
	},
	async create(ctx) {
		try{
			const account = ctx.state.user.data
			const model = ctx.request.body
			const { uid, name } = model
			const isExisted = await DeviceModel.findOne({ "$or": [{uid: uid}, {name: name}] })
			if(isExisted){
				return ctx.sendError('Device model name or UID is exited!')
			}

			const isSysAdmin = await User.findOne({email: account, role: 0})
			if(!isSysAdmin){
				return ctx.sendError('Permission denied!')
			}

			let newModel = new DeviceModel({ ...model })

			const isSaved = await newModel.save()
			isSaved 
				? ctx.send('The device model adds successfully!', { model: newModel }) 
				: ctx.sendError('Add failed due to force majeure!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Add failed due to force majeure!')
		}
		
	},
	async get(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.request.query
		const model = await DeviceModel.findById(_id)

		if (model) {
			ctx.send('The device data is successfully obtained!', { model })
		} else {
			ctx.sendError('Failed to obtain device model data!')
		}
	},
	async gets(ctx) {
		const deviceModels = await DeviceModel.find({})
		if (deviceModels) {
			ctx.send('The device model is successfully obtained!', { models: deviceModels })
		} else {
			ctx.sendError('Failed to obtain device model data!')
		}
	},
	async count(ctx) {
		const count = await DeviceModel.countDocuments({})
		ctx.send('The device model is successfully obtained!', { count })
	},
	async getSensorType(ctx) {
		const model = new DeviceModel()
		ctx.send('The device model is successfully obtained!', { sensors: model.getSensorType() })
	},
	async getRelayType(ctx) {
		const model = new DeviceModel()
		ctx.send('The device model is successfully obtained!', { relays: model.getRelayType() })
	}
}

module.exports = DeviceModelApi
