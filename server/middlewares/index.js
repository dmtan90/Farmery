const config = require('./config')
const func = require('./func')
const log = require('./log')
module.exports = app => {
	log(app)
	func(app)
	config(app)
}
