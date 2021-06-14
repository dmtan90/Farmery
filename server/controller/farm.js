const Organization = require('model/Organization')
const User = require('model/User')
const Farm = require('model/Farm')
const Device = require('model/Device')
const Notice = require('model/Notice')
const { writeImg } = require('utils/db/farm')
const log = require('utils/log')

const FarmApi = {
	async update(ctx) {
		try{
			const account = ctx.state.user.data
			const farm = ctx.request.body
			let isExisted = await Farm.findById(farm._id)
			if(!isExisted){
				return ctx.sendError('Farm is not exited!')
			}
			if(farm.name){
				isExisted.name = farm.name
			}

			if(farm.address){
				isExisted.address = farm.address
			}

			if(farm.status != undefined){
				isExisted.status = farm.status
			}

			if(farm.avatar){
				isExisted.avatar = farm.avatar
			}

			if(farm.orgId){
				let org = await Organization.findById(farm.orgId)
				if(org){
					isExisted.orgId = farm.orgId
					let existed = false
					for(let i = 0; i < org.members.farmIds; i++){
						if(org.members.farmIds[i] === farm._id){
							existed = true
							break
						}
					}
					if(!existed){
						org.members.farmIds.push(farm._id)
						org.members.farms.push(isExisted.getShort())
						await org.save()
					}
				}
			}

			if(farm.deviceIds){
				isExisted.devices = []
				isExisted.deviceIds = farm.deviceIds
				for(let i = 0; i < isExisted.deviceIds.length; i++){
					const dev = await Device.findById(isExisted.deviceIds[i])
					if(dev){
						isExisted.devices.push(dev.getShort())
					}
				}
			}

			if(farm.share && farm.share.adminIds){
				isExisted.share.adminIds = farm.share.adminIds
				isExisted.share.admins = []
				for(let i = 0; i < farm.share.adminIds.length; i++){
					const email = farm.share.adminIds[i]
					const user = await User.findOne({email: email})
					if(user){
						isExisted.share.admins.push(user.getShort())
					}
				}
			}

			if(farm.share && farm.share.userIds){
				isExisted.share.userIds = farm.share.userIds
				isExisted.share.users = []
				for(let i = 0; i < farm.share.userIds.length; i++){
					const email = farm.share.userIds[i]
					const user = await User.findOne({email: email})
					if(user){
						isExisted.share.users.push(user.getShort())
					}
				}
			}

			const isSaveSuccess = await isExisted.save()
			isSaveSuccess
				? ctx.send('Save successful!', { farm: isExisted })
				: ctx.sendError('Failed due to irresistible factors!')		
		}
		catch(e){
			log.debug(e)
 			ctx.sendError('Failed due to irresistible factors!')
		}
	},
	// invite member to join a farm
	async invite(ctx) {
		const account = ctx.state.user.data
		const { message, receiver, sender, farmId } = ctx.request.body

		const noticeInfo = {
			sender,
			receiver,
			message,
			farmId,
			type: 'farm'
		}

		const isSaveSuccess = await new Notice(noticeInfo).save()

		isSaveSuccess
			? ctx.send('The invitation was successful!')
			: ctx.sendError('The invitation failed due to irresistible factors!')
	},
	// search farm by name
	async search(ctx) {
		try{
			const account = ctx.state.user.data
			const { name } = ctx.request.query
			if(name == undefined || name === ''){
				return await FarmApi.getFarms(ctx)
			}
			const farms = await Farm.find({ name: { '$regex' : '.*' + name + '.*', '$options' : 'i' }, $or: [
					{ ownerId: account }, 
					{ "share.adminIds": { $in: [account] } }, 
					{ "share.userIds": { $in: [account] } }
				]})
			farms
				? ctx.send('Find successful!', { farms })
				: ctx.sendError('The farm does not exist!', [])
		}catch(e){
			log.debug(e)
		}
	},
	// check farm name
	async hasExisted(ctx) {
		const account = ctx.state.user.data
		const { name } = ctx.request.query
		const farm = await Farm.findOne({ name, ownerId: account })
		ctx.send('', { hasExisted: !!farm })
	},
	// create new farm
	async create(ctx) {
		try{
			const account = ctx.state.user.data
			const farm = ctx.request.body
			const { name } = farm
			const isHad = await Farm.findOne({ name, ownerId: account })
			if (isHad) {
				return ctx.sendError('Your farm name has been registered!')
			}

			farm.ownerId = account
			if(farm.orgId && farm.orgId !== ''){
				let org = await Organization.findById(farm.orgId)
				if(org){
					farm.org = org.getShort()
				}
			}

			const newFarm = new Farm({ ...farm, ownerId: account })
			const isSaveSuccess = await newFarm.save()
			if(isSaveSuccess){
				User.updateOne({ account }, { $push: { farmIds: newFarm._id } })
				if(newFarm.org){
					let org = newFarm.org
					let existed = false
					for(let i = 0; i < org.members.farmIds; i++){
						if(org.members.farmIds[i] === newFarm._id.toString()){
							existed = true
							break
						}
					}
					if(!existed){
						org.members.farmIds.push(newFarm._id.toString())
						org.members.farms.push(newFarm.getShort())
						await org.save()
					}
				}
				return ctx.send('Created successfully!', { farm: newFarm })
			}
			return ctx.sendError('The creation failed due to irresistible factors!')
		}
		catch(e){
			log.debug(e)
			return ctx.sendError('The creation failed due to irresistible factors!')
		}
		/*const [isSaveSuccess] = await Promise.all([
			new Farm(farm).save(),
			User.updateOne({ account }, { $push: { farms: newFarm } })
		])

		isSaveSuccess
			? ctx.send('Created successfully!')
			: ctx.sendError('The creation failed due to irresistible factors!')*/
	},
	// accept invite to join farm
	async join(ctx) {
		const { message, sender, receiver } = ctx.request.body
		const { account } = sender
		const { name } = receiver

		const notice = {
			sender,
			message,
			receiver,
			type: 'farm',
			id: Date.now().toString()
		}

		const [{ admins, founder }] = await Promise.all([
			// Find the account of the management in the family
			Farm.findOne({ name }, { admins: 1, founder: 1 }),

			// Add the current user to the family user group
			Farm.updateOne({ name }, { $push: { users: sender } }),

			// Add the family name to join in the user’s family group
			User.updateOne({ account }, { $push: { farms: receiver } }),

			// Add message to user message notification
			new Notice(notice).save()
		])

		// Management user pool
		admins.push(founder)

		// Asynchronous publish message array
		const syncFunc = []
		admins.forEach(_receiver => {
			const noticeInfo = {
				sender,
				receiver: _receiver,
				message,
				type: 'farm',
				id: Date.now().toString()
			}
			syncFunc.push(new Notice(noticeInfo).save())
		})
		await Promise.all(syncFunc)

		ctx.send('Joined successfully, waiting for the administrator’s review!')
	},
	// get members of farms
	async getMember(ctx) {
		const names = ctx.request.query.names.split(',')
		const farms = await Farm.find({ name: { $in: names } })

		const members = []

		farms.forEach(e => {
			const farm = { name: e.name }
			members.push({
				farm,
				user: e.founder,
				tag: 'Manager'
			})

			e.admins.forEach(a => {
				members.push({
					farm,
					user: a,
					tag: 'Administrator'
				})
			})
			e.users.forEach(u => {
				members.push({
					farm,
					user: u,
					tag: 'User'
				})
			})
		})
		return ctx.send('Farm members get success', { members })
	},
	async get(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			let farm = await Farm.findById(_id)
			if(!farm){
				return ctx.sendError('Invalid farm id!')
			}

			if(!farm.owner){
				const user = await User.findOne({ email: farm.ownerId })
				farm.owner = user.getShort()
			}

			const admins = await User.find({ email: { $in: farm.share.adminIds } })
			const users = await User.find({ email: { $in: farm.share.userIds } })

			farm.share.admins = []
			farm.share.users = []
			if(admins){
				admins.forEach(admin => {
					farm.share.admins.push(admin.getShort())
				})
			}

			if(users){
				users.forEach(user => {
					farm.share.users.push(user.getShort())
				})
			}

			if(farm.deviceIds){
				farm.devices = []
				for(let i = 0; i < farm.deviceIds.length; i++){
					const dev = await Device.findById(farm.deviceIds[i])
					if(dev){
						farm.devices.push(dev.getShort())
					}
				}
			}

			if(!farm.org && farm.orgId !== ''){
				const org = await Organization.findById(farm.orgId)
				farm.org = org.getShort()
			}
			
			//farm.share.admins = await User.findOne({ account: { $in: farm.share.adminIds } })
			//farm.share.users = await User.findOne({ account: { $in: farm.share.userIds } })

			return ctx.send('Farm get success', { farm })
		}
		catch(e){
			log.debug(e)
			return ctx.sendError('The creation failed due to irresistible factors!')
		}
		
	},
	async gets(ctx) {
		const account = ctx.state.user.data
		let { name, roles } = ctx.request.query
		let filter = {
			"$or": []
		}
		if(name !== undefined && name != ""){
			filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
		}

		if(roles == undefined){
			filter["$or"] = [
				{ ownerId: account }, 
				{ "share.adminIds": { $in: [account] } }, 
				{ "share.userIds": { $in: [account] } }
			]
		}
		else{
			roles.forEach(role => {
				if(role === "owner"){
					filter["$or"].push({ ownerId: account })
				}
				else if(role === "admin"){
					filter["$or"].push({ "share.adminIds": { $in: [account] } })
				}
				else if(role === "user"){
					filter["$or"].push({ "share.userIds": { $in: [account] } })
				}
			})
		}
		const farms = await Farm.find(filter)
		farms.forEach(f => {
			if(f.owner){

			}
		})
		return ctx.send('Farm share gets success', { farms })
	},
	async count(ctx) {
		const account = ctx.state.user.data
		let { name, roles } = ctx.request.query
		let filter = {
			"$or": []
		}
		if(name !== undefined && name != ""){
			filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
		}

		if(roles == undefined){
			filter["$or"] = [
				{ ownerId: account }, 
				{ "share.adminIds": { $in: [account] } }, 
				{ "share.userIds": { $in: [account] } }
			]
		}
		else{
			roles.forEach(role => {
				if(role === "owner"){
					filter["$or"].push({ ownerId: account })
				}
				else if(role === "admin"){
					filter["$or"].push({ "share.adminIds": { $in: [account] } })
				}
				else if(role === "user"){
					filter["$or"].push({ "share.userIds": { $in: [account] } })
				}
			})
		}
		const count = await Farm.countDocuments(filter)
		return ctx.send('Farm share gets success', { count })
	},
	async getOwnFarms(ctx) {
		const account = ctx.state.user.data
		const farms = await Farm.find({ ownerId: account })

		return ctx.send('Farm gets success', { farms })
	},
	async getShareFarms(ctx) {
		const account = ctx.state.user.data
		const filter = {
			$or: [
				{ "share.adminIds": { $in: [account] } }, 
				{ "share.userIds": { $in: [account] } }
			]	
		}
		const farms = await Farm.find(filter)
		return ctx.send('Farm share gets success', { farms })
	},
	async getShareAdminFarms(ctx) {
		const account = ctx.state.user.data
		const farms = await Farm.find({ "share.adminIds": { $in: [account] } })
		return ctx.send('Farm admin share gets success', { farms })
	},
	async getShareUserFarms(ctx) {
		const account = ctx.state.user.data
		const farms = await Farm.find({ "share.userIds": { $in: [account] } })
		return ctx.send('Farm admin share gets success', { farms })
	},
}

module.exports = FarmApi
