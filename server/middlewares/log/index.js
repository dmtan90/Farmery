const logger = require('./log')
const onerror = require('koa-onerror')
const koaLogger = require('koa-logger')
const log = require('utils/log')
const fundebug = require('fundebug-nodejs')

module.exports = app => {
  let loggerMiddleware = logger()
  app.use(async (ctx, next) => {
    return loggerMiddleware(ctx, next).catch(e => {
      if (ctx.status < 500) {
        ctx.status = 500
      }
      ctx.log.error(e.stack)
      ctx.state.logged = true
      ctx.throw(e)
    })
  })

  app.use(koaLogger())

  app.use(async (ctx, next) => {
    const start = new Date()
    await next()
		const ms = new Date() - start
		log.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
	})
	onerror(app)
	app.on('error', (err, ctx) => {
    if (ctx && !ctx.headerSent && ctx.status < 500) {
      ctx.status = 500
    }
    if (ctx && ctx.log && ctx.log.error) {
      if (!ctx.state.logged) {
        ctx.log.error(err.stack)
      }
    }
	})

	fundebug.apikey = '2088c8f989ebe10441f9e78919804034131b25d1f171dde26ab358898928924a'
	app.on('error', fundebug.KoaErrorHandler)

}
