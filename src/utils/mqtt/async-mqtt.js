import mqtt from 'mqtt'

const AsyncMethods = [
	'publish',
	'subscribe',
	'unsubscribe',
	'end'
]

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

		AsyncMethods.forEach(e => {
			this[e] = function() {
				const args = arguments
				return new Promise((resolve, reject) => {
					this._client[e](...args, this.makeCallback(resolve, reject))
				})
			}
		})

		SyncMethods.forEach(function(e) {
			this[e] = function() {
				return this._client[e](...arguments)
			}
		})
	}
	set handleMessage(newHandler) {
		this._client.handleMessage = newHandler
	}
	get handleMessage() {
		return this._client.handleMessage
	}
	makeCallback = (resolve, reject) => (err, data) =>
		err ? reject(err) : resolve(data)
}

export default {
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
