const mqtt = require('mqtt')

const AsyncMethods = ['publish', 'subscribe', 'unsubscribe', 'end']

const SyncMethods = [
	'emit',
	'addListener',
	'on',
	'once',
	'removeListener',
	'removeAllListeners',
	'setMaxListeners',
	'getMaxListeners',
	'listeners',
	'listenerCount'
]

class AsyncClient {
	constructor(client) {
		this._client = client
		const that = this

		AsyncMethods.forEach(e => {
			that[e] = function () {
				const args = arguments
				return new Promise((resolve, reject) => {
					that._client[e](...args, that.makeCallback(resolve, reject))
				})
			}
		})

		SyncMethods.forEach(e =>{
			that[e] = function () { return that._client[e](...arguments) }
		})
	}
	set handleMessage(newHandler) {
		this._client.handleMessage = newHandler
	}
	get handleMessage() {
		return this._client.handleMessage
	}
	makeCallback(resolve, reject) {
		return (err, data) => err ? reject(err) : resolve(data)
	}
}

module.exports = {
	connect(brokerUrl, opts) {
		const client = mqtt.connect(
			brokerUrl,
			opts
		)
		return new AsyncClient(client)
	},
	getAsyncClient(client) {
		return new AsyncClient(client)
	}
}
