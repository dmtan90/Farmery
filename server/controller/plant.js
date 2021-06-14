const Plant = require('model/Plant')
const log = require('utils/log')

const PlantApi = {
	async update(ctx) {
		try{
			const account = ctx.state.user.data
			const plant = ctx.request.body

			let isExisted = await Plant.findById(plant._id)
			if(!isExisted){
				return ctx.sendError('Plant is not exited!')
			}

			/*if(account != isExisted.ownerId){
				return ctx.sendError('You are not owner of the plant!')
			}*/

			if(plant.name){
				isExisted.name = plant.name
			}

			if(plant.description){
				isExisted.description = plant.description
			}

			if(plant.status != undefined){
				isExisted.status = plant.status
			}

			if(plant.avatar){
				isExisted.avatar = plant.avatar
			}

			if(plant.ownerId == ""){
				plant.ownerId = account
			}

			const isSuccess = await isExisted.save()
			isSuccess 
				? ctx.send('update successfully', { isSuccess }) 
				: ctx.sendError('Update failed due to force majeure!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Update failed due to force majeure!')
		}
		
	},
	async delete(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.query
		const isSuccess = await Plant.findByIdAndDelete(_id)
		isSuccess 
			? ctx.send('successfully deleted') 
			: ctx.sendError('The deletion failed due to force majeure!')
	},
	async rename(ctx) {
		const account = ctx.state.user.data
		const { _id, name } = ctx.request.body
		const isSuccess = await Plant.updateById(_id, { name })
		isSuccess
			? ctx.send('Renamed successfully')
			: ctx.sendError('Rename failed due to force majeure!')
	},
	async create(ctx) {
		try{
			const account = ctx.state.user.data
			const plant = ctx.request.body
			const { name, avatar, description } = plant
			let isExisted = await Plant.findOne({ name })
			if(isExisted){
				return ctx.sendError('Plant name is exited!')
			}

			isExisted = new Plant({ ...plant, ownerId: account })

			const isSuccess = await isExisted.save()
			isSuccess 
				? ctx.send('The plant adds successfully!', { isExisted }) 
				: ctx.sendError('Failed to create plant data!')
		}
		catch(e){
			log.debug(e)
			ctx.sendError('Failed to create plant data!')
		}
		
	},
	async get(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.request.query
		const plant = await Plant.findById(_id)
		if (plant) {
			ctx.send('The plant data is successfully obtained!', { plant })
		} else {
			ctx.sendError('Failed to obtain plant data!')
		}
	},
	async gets(ctx) {
		const account = ctx.state.user.data
		let { name } = ctx.request.query
		let filter = {
			ownerId: account
		}
		if(name !== undefined && name != ""){
			filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
		}
		const plants = await Plant.find(filter)
		if (plants) {
			/*let plantShorts = []
			plants.forEach(p => {
				plantShorts.push(p.getShort())
			})*/
			ctx.send('The plants data is successfully obtained!', { plants })
		} else {
			ctx.sendError('Failed to obtain plants data!')
		}
	},
	async count(ctx) {
		const account = ctx.state.user.data
		let { name } = ctx.request.query
		let filter = {
			ownerId: account
		}
		if(name !== undefined && name != ""){
			filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
		}
		const count = await Plant.countDocuments(filter)
		ctx.send('The plants data is successfully obtained!', { count })
	}
}

module.exports = PlantApi
