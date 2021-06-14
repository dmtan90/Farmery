const send = require('./send')
module.exports = app => {
	app.use(send())
}
