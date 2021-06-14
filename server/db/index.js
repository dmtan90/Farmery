const mongoose = require('mongoose')
const config = require('config/db')
const log = require('utils/log')

module.exports = () => {

	mongoose.set('debug', (coll, method, query, doc, options) => {
		let logs = {
			collection: coll,
			method: method,
			query: query,
			doc: doc,
			options: options
		}
		// console.log(logs)
	})

	mongoose.Promise = global.Promise

	const options = {
		autoIndex: false,
		autoReconnect: true,
		reconnectTries: 10,
		reconnectInterval: 500,
		poolSize: 5,
		connectTimeoutMS: 1000,
		keepAlive: true,
		bufferMaxEntries: 0,
		useUnifiedTopology: false,
		useNewUrlParser: true
	}
	const connection = mongoose.connection
	connection.openUri(config.url, options)

	connection.once('open', () => {
		log.success('Database connection is successful :)')
	})

	connection.on('error', () => {
		log.error('Database connection failed :(')
	})
}
