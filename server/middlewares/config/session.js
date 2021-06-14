const koaSession = require('koa-session')
module.exports = app => {
	app.keys = ['captcha','cityID']

	app.use(
		koaSession(
			{
				key: 'koa:sess',
				maxAge: 3600 * 24,
				overwrite: true,
				signed: true,
				rolling: false,
				httpOnly: true
			},
			app
		)
	)
}
