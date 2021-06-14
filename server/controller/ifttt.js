const IFTTT = require('model/IFTTT')
const DeviceModel = require('model/DeviceModel')
const User = require('model/User')
const log = require('utils/log')

const IftttModelApi = {
	async update(ctx) {
		try{
			const account = ctx.state.user.data
			const ifttt = ctx.request.body

			let isExisted = await IFTTT.findById(ifttt._id)
			if(!isExisted){
				return ctx.sendError('IFTTT model is not exited!')
			}

			if(isExisted.ownerId !== account){
				return ctx.sendError('You are not owner!')
			}

			isExisted = Object.assign(isExisted, ifttt)

			const isSaved = await isExisted.save()

			isSaved
				? ctx.send('Update successfully', {ifttt: isExisted})
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
			const { _id } = ctx.query

			let isExisted = await IFTTT.findById(_id)
			if(!isExisted){
				return ctx.sendError('IFTTT model is not exited!')
			}

			if(isExisted.ownerId !== account){
				return ctx.sendError('You are not owner!')
			}
			
			const isSuccess = await isExisted.remove()
			isSuccess 
				? ctx.send('successfully deleted') 
				: ctx.sendError('The deletion failed due to force majeure!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('The deletion failed due to force majeure!')
		}
	},
	async create(ctx) {
		try{
			const account = ctx.state.user.data
			const ifttt = ctx.request.body
			let newModel = new IFTTT({ ...ifttt })
			newModel.ownerId = account

			const isSaved = await newModel.save()
			isSaved 
				? ctx.send('The IFTTT model adds successfully!', { ifttt: newModel }) 
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
		const ifttt = await IFTTT.findById(_id)

		if (ifttt) {
			ctx.send('The ifttt data is successfully obtained!', { ifttt })
		} else {
			ctx.sendError('Failed to obtain ifttt data!')
		}
	},
	async gets(ctx) {
		const account = ctx.state.user.data
		// let { name } = ctx.request.query
		let filter = {
			$or: [
				{ownerId: account}
			]
		}

		/*if(name != undefined && name != ""){
			filter["name"] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
		}*/

		const ifttts = await IFTTT.find(filter)

		if (ifttts) {
			ctx.send('The ifttts data is successfully obtained!', { ifttts })
		} else {
			ctx.sendError('Failed to obtain ifttts data!')
		}
	},
}

module.exports = IftttModelApi
