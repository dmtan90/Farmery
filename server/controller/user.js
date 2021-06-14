const User = require('model/User')
const Token = require('utils/token')

const { writeImg, bcryptPass } = require('utils/db/user')

const { getNotice } = require('utils/db/notice')
//const { getElectrics } = require('utils/db/electric')
const { getWeather } = require('utils/http')
const log = require('utils/log')
//const { getScripts } = require('utils/db/scripts')
//const { getUsagelog } = require('utils/db/usagelog')

const UserApi = {
	async login(ctx) {
		const { email, password } = ctx.request.body
		const user = await User.findOne({ email: email })
		if (!user) {
			return ctx.sendError('The email you entered does not exist!')
		}
		log.debug(user)
		const isMatch = await user.comparePassword(password, user.password)
		if (!isMatch) {
			return ctx.sendError('Wrong password!')
		}
		const userInfo = {
			name: user.name,
			email: user.email,
			address: user.address,
			role: user.role,
			avatar: user.avatar,
			news: user.news,
			families: user.families
		}
		const [
			token,
			notice,
			weather,
			electrics,
			scripts,
			usagelog
		] = await Promise.all([
			Token.generate(email),
			getNotice(email),
			getWeather(user.address.latitude, user.address.longitude),
			//getElectrics(account),
			//getScripts(account),
			//getUsagelog(account)
		])
		const value = {
			token,
			userInfo,
			weather,
			notice,
			//electrics,
			scripts,
			usagelog
		}

		ctx.send('Information obtained successfully!', value)
	},
	async getUserInfo(ctx) {
		const email = ctx.state.user.data
		const user = await User.findOne({ email: email })
		const userInfo = {
			name: user.name,
			email: user.email,
			address: user.address,
			role: user.role,
			avatar: user.avatar,
			news: user.news,
			families: user.families
		}

		const [notice, weather, electrics, scripts, usagelog] = await Promise.all([
			getNotice(email),
			getWeather(user.address.latitude, user.address.longitude),
			//getElectrics(account),
			//getScripts(account),
			//getUsagelog(account)
		])
		const value = { userInfo, weather, notice, electrics, scripts, usagelog }

		ctx.send('Information obtained successfully!', value)
	},
	async registry(ctx) {
		try{
			const userInfo = ctx.request.body
			if (ctx.session.captcha !== userInfo.captcha.toString()) {
				return ctx.sendError('Verification code error!')
			}
			const isHad = await User.findOne({ email: userInfo.email })
			if (isHad) {
				return ctx.sendError('Account already exists!')
			}

			Reflect.deleteProperty(userInfo, 'captcha')
			Reflect.deleteProperty(userInfo, 'checkpass')
			let user = new User({...userInfo})
			let password = await bcryptPass(user)
			user.password = password

			const hasSaved = user.save()
			if (!hasSaved) {
				return ctx.sendError('Due to irresistible factors, registration failed!')
			}
			ctx.send('Registration success!')
		}
		catch(e){
			log.debug(e)
			return ctx.sendError('Due to irresistible factors, registration failed!')
		}
	},

	async hasExisted(ctx) {
		const { email } = ctx.request.query
		const isExisted = await User.findOne({email: email})
		if(isExisted){
			return ctx.send('', { hasExisted: true })
		}
		return ctx.send('', { hasExisted: false })
	},

	async updateUserInfo(ctx) {
		try{
			const email = ctx.state.user.data
			const userInfo = ctx.request.body

			let _token, avatar, password
			userInfo.email = email
			let user = await User.findOne({email})
			if(!user){
				return ctx.sendError('Account is not exists!')
			}

			if(userInfo.avatar != undefined){
				user.avatar = await writeImg(userInfo)
			}

			if(userInfo.password != undefined){
				[password, _token] = await Promise.all([
					bcryptPass(userInfo),
					Token.generate(email)
				])
				user.password = password
			}

			if(userInfo.name != undefined){
				user.name = userInfo.name
			}

			if(userInfo.address != undefined){
				user.address = userInfo.address
			}

			if(userInfo.email != undefined){
				_token = await Token.generate(userInfo.email)
				user.email = userInfo.email
			}

			if(userInfo.phone != undefined){
				user.phone = userInfo.phone
			}

			/*if (userInfo.avatar && userInfo.password) {
				[avatar, password, _token] = await Promise.all([
					writeImg(userInfo),
					bcryptPass(userInfo),
					Token.generate(email)
				])

				userInfo.avatar = avatar
				userInfo.password = password
			} else {
				if (userInfo.avatar) {
					userInfo.avatar = await writeImg(userInfo)
				} else if (userInfo.password) {
					[password, _token] = await Promise.all([
						bcryptPass(userInfo),
						Token.generate(email)
					])
					userInfo.password = password
				}
			}

			const isUpdated = await User.updateOne({ email }, userInfo)*/
			const isUpdated = await user.save()
			if (!isUpdated) {
				return ctx.sendError('Due to irresistible factors, your information has failed to change!')
			}
			ctx.send('Your information has been changed successfully!', { _token })
		}
		catch(e){
			log.debug(e)
			return ctx.sendError('Due to irresistible factors, registration failed!')
		}
	},

	async newsToZero(ctx) {
		const email = ctx.state.user.data
		await User.updateOne({ email }, { news: { [ctx.params.type]: 0 } }) &&
			ctx.send('The number of messages has been cleared!')
	},
	async search(ctx) {
		const { email } = ctx.request.query
		const user = await User.findOne({ email: email })
		if (!user) {
			return ctx.sendError('User does not exist!')
		}
		const result = {
			name: user.name,
			email: user.email,
			role: user.role,
			address: user.address,
			avatar: user.avatar,
			password: '***********'
		}
		ctx.send('Find successful!', {user: result})
	},
	async getServiceDataWithAllBulb(ctx) {
		const email = ctx.state.user.data
		const electricity = await User.findOne({ email }, { electricity: 1 })
		if (electricity) {
			ctx.send('The electrical data is successfully obtained!', { electricity })
		} else {
			ctx.sendError('Failed to obtain electrical data!')
		}
	}
}

module.exports = UserApi
