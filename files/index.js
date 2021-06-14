require('module-alias/register')
const cors = require('kcors')
const Koa = require('koa')
const onerror = require('koa-onerror')
const koaLogger = require('koa-logger')
const staticCache = require('koa-static-cache')
const serve = require('koa-static')
//const middleware = require('./middlewares')
const { port, avatar } = require('config/file')

const log = require('utils/log')

const app = new Koa()
//middleware(app)
//CORS config
app.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin)
	ctx.set('Access-Control-Allow-Credentials', true)
	ctx.set('Access-Control-Max-Age', 86400000)
	ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
	ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type')
	await next()
})
app.use(cors())


//Serve method
onerror(app)
app.use(koaLogger())
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


//Serve files config
const file = avatar.path.base
app.use(async (ctx, next) => {
	await next()
	ctx.status = 200
	ctx.set('Cache-Control', 'must-revalidation')
	if (ctx.fresh) {
		ctx.status = 304
		return
	}
})
app.use(staticCache(file, { maxAge: 365 * 24 * 60 * 60 }))
app.use(serve(file))

app.listen(port, () => {
	log.success(`Static Files Server is Runing at ${port}`)
})
