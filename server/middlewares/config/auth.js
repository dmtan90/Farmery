const jwt = require('jsonwebtoken')
const fs = require('fs')
const koaJwt = require('koa-jwt')
const {publicKey} = require('config/key')

module.exports = app => {
	const pub = fs.readFileSync(publicKey)
	app.use(async (ctx, next) => {
		if (ctx.path.indexOf('/auth') >= 0) {
			const token = ctx.header.authorization
			if (!token) {
				ctx.sendError('please log in first!')
				return ctx.throw(401, 'token failed, please log in again！')
			}
			try {
				const payload = await jwt.verify(token.split(' ')[1], pub)
			} catch (e) {
				if (e.name === 'TokenExpiredError') {
					ctx.sendError('token has expired, please log in again！')
					ctx.throw(401, 'token expired, please save the data locally in time！')
				}
				ctx.sendError('Token verification failed, please log in again！')
				ctx.throw(401, 'invalid token')
			}
			console.log('Successful authentication')
		}
		await next()
	})
	app.use(koaJwt({ secret: pub }).unless({ path: [/^\/api/,/^\/home/,/^\\/] }))
}
