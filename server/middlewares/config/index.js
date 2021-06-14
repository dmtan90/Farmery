const cors = require('./cors')
const cache = require('./cache')
const session = require('./session')
const auth = require('./auth')
const bodyParser = require('koa-bodyparser')

module.exports = app => {
	cors(app)
	session(app)
	cache(app)
	auth(app)
	app.use(bodyParser())
}
