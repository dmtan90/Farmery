const mongoose = require('mongoose')
const Organization = require('model/Organization')
const User = require('model/User')
const Farm = require('model/Farm')
const Device = require('model/Device')
const Notice = require('model/Notice')
const { writeImg } = require('utils/db/farm')
const { bcryptPass } = require('utils/db/user')
const log = require('utils/log')

const OrgApi = {
	async registerMember(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id, role, userInfo } = ctx.request.body
			let org = await Organization.findById(_id)
			if(!org){
				return ctx.sendError('Organization is not exited!')
			}

			if(org.ownerId !== account){
				return ctx.sendError('You are not owner of organization!')
			}

			if(account === userInfo.email){
				return ctx.sendError('Invalid params!')
			}

			let isSaveSuccess = false

			let user = await User.findOne({ email: userInfo.email })
			if (!user) {
				//user = new User(userInfo)
				user = new User({...userInfo})
				let password = await bcryptPass(user)
				user.password = password

				user = await user.save()
				if(!user){
					return ctx.sendError('Failed due to irresistible factors!')
				}
			}

			const isAdmin = org.members.adminIds.indexOf(userInfo.email)
			const isUser = org.members.userIds.indexOf(userInfo.email)
			if(isAdmin >= 0 || isUser >= 0){
				return ctx.sendError('User has been added into organization!')
			}

			if(role === "admin"){
				org.members.adminIds.push(userInfo.email)
				org.members.admins.push(user.getShort())
			}
			else{
				org.members.userIds.push(userInfo.email)
				org.members.users.push(user.getShort())
			}

			org = await org.save()
			if(!org.owner){
				const owner = await User.findOne({ email: org.ownerId })
				org.owner = owner.getShort()
			}
			org
				? ctx.send('Save successful!', { org: org })
				: ctx.sendError('Failed due to irresistible factors!')		
		}
		catch(e){
			log.debug(e)
 			ctx.sendError('Failed due to irresistible factors!')
		}
	},
	async update(ctx) {
		try{
			const account = ctx.state.user.data
			const org = ctx.request.body
			let isExisted = await Organization.findById(org._id)
			if(!isExisted){
				return ctx.sendError('Organization is not exited!')
			}

			if(isExisted.ownerId !== account){
				return ctx.sendError('You are not owner of organization!')
			}

			if(org.name){
				isExisted.name = org.name
			}

			if(org.status != undefined){
				isExisted.status = org.status
			}

			if(org.avatar){
				isExisted.avatar = org.avatar
			}

			if(org.parentId != undefined){
				isExisted.parentId = org.parentId
			}

			if(org.members){
				let allUserIds = []
				let allUsers = []
				if(org.members.adminIds && org.members.adminIds.length >= 0){
					isExisted.members.adminIds = org.members.adminIds
					isExisted.members.admins = []
					for(let i = 0; i < org.members.adminIds.length; i++){
						const userId = org.members.adminIds[i]
						const user = await User.findOne({email: userId})
						if(user){
							isExisted.members.admins.push(user.getShort())
							allUserIds.push(userId)
							allUsers.push(user.getShort())
						}
					}
				}

				if(org.members.userIds && org.members.userIds.length >= 0){
					isExisted.members.userIds = org.members.userIds
					isExisted.members.users = []
					for(let i = 0; i < org.members.userIds.length; i++){
						const userId = org.members.userIds[i]
						const user = await User.findOne({email: userId})
						if(user){
							isExisted.members.users.push(user.getShort())
							allUserIds.push(userId)
							allUsers.push(user.getShort())
						}
					}
				}

				//handle update users in farm
				let farms = await Farm.find({ orgId: org._id })
				farms.forEach(async(farm) => {
					// rebuild members
					farm.share.admins = []
					for(let i = 0; i < farm.share.adminIds.length; i++){
						let userId = farm.share.adminIds[i]
						let idx = allUserIds.indexOf(userId)
						if(idx >= 0){
							farm.share.admins.push(allUsers[idx])
						}
						else{
							farm.share.adminIds.splice(i, 1)
							i--
						}
					}

					farm.share.users = []
					for(let i = 0; i < farm.share.userIds.length; i++){
						let userId = farm.share.userIds[i]
						let idx = allUserIds.indexOf(userId)
						if(idx >= 0){
							farm.share.users.push(allUsers[idx])
						}
						else{
							farm.share.userIds.splice(i, 1)
							i--
						}
					}

					await farm.save()
				})
			}

			const isSaveSuccess = await isExisted.save()
			if(!isExisted.owner){
				const owner = await User.findOne({ email: isExisted.ownerId })
				isExisted.owner = owner.getShort()
			}
			isSaveSuccess
				? ctx.send('Save successful!', { org: isExisted })
				: ctx.sendError('Failed due to irresistible factors!')		
		}
		catch(e){
			log.debug(e)
 			ctx.sendError('Failed due to irresistible factors!')
		}
	},
	// search org by name
	async search(ctx) {
		try{
			const account = ctx.state.user.data
			const { name } = ctx.request.query
			if(name == undefined || name === ''){
				return await OrgApi.getOrgs(ctx)
			}
			const orgs = await Organization.find({ name: { '$regex' : '.*' + name + '.*', '$options' : 'i' }, $or: [
					{ ownerId: account }, 
					{ "members.adminIds": { $in: [account] } }, 
					{ "members.userIds": { $in: [account] } }
				]})
			orgs
				? ctx.send('Find successful!', { orgs })
				: ctx.sendError('The org does not exist!', [])
		}catch(e){
			log.debug(e)
		}
	},
	// check org name
	async hasExisted(ctx) {
		const account = ctx.state.user.data
		const { name } = ctx.request.query
		const org = await Organization.findOne({ name, $or: [
					{ ownerId: account }, 
					{ "members.adminIds": { $in: [account] } }, 
					{ "members.userIds": { $in: [account] } }
				]})
		ctx.send('', { hasExisted: !!org })
	},
	// create new org
	async create(ctx) {
		try{
			const account = ctx.state.user.data
			const org = ctx.request.body
			const { name } = org
			const isHad = await Organization.findOne({ name, $or: [
					{ ownerId: account }, 
					{ "members.adminIds": { $in: [account] } }, 
					{ "members.userIds": { $in: [account] } }
				]})
			if (isHad) {
				return ctx.sendError('Your org name has been registered!')
			}

			const newOrg = new Organization({ ...org, ownerId: account })
			const isSaveSuccess = await newOrg.save()
			if(isSaveSuccess){
				const owner = await User.findOne({ email: newOrg.ownerId })
				newOrg.owner = owner.getShort()
				//User.updateOne({ account }, { $push: { farmIds: newFarm._id } })
				return ctx.send('Created successfully!', { org: newOrg })
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
	async get(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			const org = await Organization.findById(_id)
			if(!org){
				return ctx.sendError('Invalid org id!')
			}

			if(!org.owner){
				const user = await User.findOne({ email: org.ownerId })
				org.owner = user.getShort()
			}

			const admins = await User.find({ email: { $in: org.members.adminIds } })
			const users = await User.find({ email: { $in: org.members.userIds } })
			const farms = await Farm.findByIds(org.members.farmIds)

			org.members.admins = []
			org.members.users = []
			if(admins){
				admins.forEach(admin => {
					org.members.admins.push(admin.getShort())
				})	
			}

			if(users){
				users.forEach(user => {
					org.members.users.push(user.getShort())
				})
			}

			/*let farmFilters = { $or: [] }
			org.members.farmIds.forEach(id => {
				farmFilters.$or.push({ _id: mongoose.Types.ObjectId(id) })
			})
			const farms = await Farm.find(farmFilters)*/

			if(farms){
				farms.forEach(farm => {
					org.members.farms.push(farm.getShort())
				})
			}

			return ctx.send('Org get success', { org })
		}
		catch(e){
			log.debug(e)
			return ctx.sendError('The creation failed due to irresistible factors!')
		}
	},
	async count(ctx) {
		try{
			const account = ctx.state.user.data
			let { name, roles } = ctx.request.query
			let filter = {}
			if(name !== undefined && name != ""){
				filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
			}

			if(roles == undefined){
				filter["$or"] = [
					{ ownerId: account }, 
					{ "members.adminIds": { $in: [account] } }, 
					{ "members.userIds": { $in: [account] } }
				]
			}
			else{
				roles.forEach(role => {
					if(role === "owner"){
						filter["$or"].push({ ownerId: account })
					}
					else if(role === "admin"){
						filter["$or"].push({ "members.adminIds": { $in: [account] } })
					}
					else if(role === "user"){
						filter["$or"].push({ "members.userIds": { $in: [account] } })
					}
				})
			}
			console.log(filter)
			const count = await Organization.countDocuments(filter)
			return ctx.send('Org share count success', { count })
		}
		catch(e){
			log.debug(e)
			return ctx.sendError('The getting failed due to irresistible factors!')
		}
		
	},
	async countUser(ctx) {
		try{
			const account = ctx.state.user.data
			let { name, roles } = ctx.request.query
			let filter = {}
			if(name !== undefined && name != ""){
				filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
			}

			if(roles == undefined){
				filter["$or"] = [
					{ ownerId: account }, 
					{ "members.adminIds": { $in: [account] } }, 
					{ "members.userIds": { $in: [account] } }
				]
			}
			else{
				roles.forEach(role => {
					if(role === "owner"){
						filter["$or"].push({ ownerId: account })
					}
					else if(role === "admin"){
						filter["$or"].push({ "members.adminIds": { $in: [account] } })
					}
					else if(role === "user"){
						filter["$or"].push({ "members.userIds": { $in: [account] } })
					}
				})
			}
			console.log(filter)
			const orgs = await Organization.find(filter)
			let count = 0
			let users = []
			orgs.forEach(org => {
				if(org.ownerId){
					users.push(org.ownerId)	
				}
				
				org.members.adminIds.forEach(u => {
					if(u){
						users.push(u)
					}
				})
				org.members.userIds.forEach(u => {
					if(u){
						users.push(u)
					}
				})
			})

			let uniques = users.filter((v, i, a) => a.indexOf(v) === i);
			console.log(uniques)

			return ctx.send('Org share count success', { count: uniques.length })
		}
		catch(e){
			log.debug(e)
			return ctx.sendError('The getting failed due to irresistible factors!')
		}
	},
	async gets(ctx) {
		try{
			const account = ctx.state.user.data
			let { name, roles } = ctx.request.query
			let filter = {}
			if(name !== undefined && name != ""){
				filter['name'] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
			}

			if(roles == undefined){
				filter["$or"] = [
					{ ownerId: account }, 
					{ "members.adminIds": { $in: [account] } }, 
					{ "members.userIds": { $in: [account] } }
				]
			}
			else{
				roles.forEach(role => {
					if(role === "owner"){
						filter["$or"].push({ ownerId: account })
					}
					else if(role === "admin"){
						filter["$or"].push({ "members.adminIds": { $in: [account] } })
					}
					else if(role === "user"){
						filter["$or"].push({ "members.userIds": { $in: [account] } })
					}
				})
			}
			console.log(filter)

			const orgs = await Organization.find(filter)
			if(orgs.length == 0){
				return ctx.send('Org share gets success', { orgs })
			}

			let userIds = []
			let orgIds = []
			orgs.forEach(async (o) => {
				orgIds.push(o._id)

				if(o.ownerId){
					userIds.push(o.ownerId)	
				}

				//remove null user in members
				let hasNull = false
				for(let i = 0; i < o.members.adminIds.length; i++){
					if(o.members.adminIds[i] === null){
						o.members.adminIds.splice(i, 1)
						i--
						hasNull = true
					}
				}

				for(let i = 0; i < o.members.userIds.length; i++){
					if(o.members.userIds[i] === null){
						o.members.userIds.splice(i, 1)
						i--
						hasNull = true
					}
				}
				if(hasNull){
					await o.save()
				}
				
				o.members.adminIds.forEach(u => {
					if(u){
						userIds.push(u)
					}
				})

				o.members.userIds.forEach(u => {
					if(u){
						userIds.push(u)
					}
				})
			})

			log.debug(userIds)

			if(userIds.length == 0){
				return ctx.send('Org share gets success', { orgs })
			}

			const farms = await Farm.find({ orgId: { $in: orgIds } })
			const users = await User.find({ email: { $in: userIds } })
			if(users){
				orgs.forEach(o => {
					o.members.admins = []
					o.members.users = []
					o.members.farms = []
					o.members.farmIds = []
					
					farms.forEach(farm => {
						if(farm.orgId == o._id){
							o.members.farms.push(farm.getShort())
							o.members.farmIds.push(farm._id)
						}
					})

					users.forEach(u => {
						if(o.ownerId == u.email){
							o.owner = u.getShort()
						}
						else{
							if(o.members.adminIds.indexOf(u.email) >= 0){
								o.members.admins.push(u.getShort())
							}
							else if(o.members.userIds.indexOf(u.email) >= 0){
								o.members.users.push(u.getShort())
							}
						}
					})
				})
			}

			return ctx.send('Org share gets success', { orgs })
		}
		catch(e){
			log.debug(e)
			return ctx.sendError('The getting failed due to irresistible factors!')
		}
		
	},
	async getOwnOrgs(ctx) {
		const account = ctx.state.user.data
		const orgs = await Organization.find({ ownerId: account })

		return ctx.send('Org gets success', { orgs })
	},
	async getShareOrgs(ctx) {
		const account = ctx.state.user.data
		const filter = {
			$or: [
				{ "members.adminIds": { $in: [account] } }, 
				{ "members.userIds": { $in: [account] } }
			]	
		}
		const orgs = await Organization.find(filter)
		return ctx.send('Org share gets success', { orgs })
	},
	async getShareAdminOrgs(ctx) {
		const account = ctx.state.user.data
		const orgs = await Organization.find({ "members.adminIds": { $in: [account] } })
		return ctx.send('Org admin share gets success', { orgs })
	},
	async getShareUserOrgs(ctx) {
		const account = ctx.state.user.data
		const orgs = await Organization.find({ "members.userIds": { $in: [account] } })
		return ctx.send('Org admin share gets success', { orgs })
	},
}

module.exports = OrgApi
