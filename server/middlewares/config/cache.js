const staticCache = require('koa-static-cache')
const koaStatic = require('koa-static')
const path = require('path')

module.exports = app => {
	const file = path.resolve('dist')

	app.use(
		staticCache(file, {
			maxAge: 365 * 24 * 60 * 60
		})
	)
	app.use(koaStatic(file))
}
