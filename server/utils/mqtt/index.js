require('module-alias/register')
const AsyncMQTT = require('./async-mqtt')
const { host, port, clientId, subscribeTopics, username, password } = require('config/mqtt')

const Client = AsyncMQTT.connect(
	`mqtt://${host}`,
	{
		port,
		clientId,
		username,
		password,
		will: {
			topic: 'offline',
			payload: 'Client is offline',
			qos: 1,
			retain: false
		}
	}
)

Client.on('connect', connack => {
	console.log('Connected to MQTT server: ' + host)
	console.log(connack)

	Client.subscribe(subscribeTopics).then(e => {
		console.log(e)
	}).catch(error => {
		console.error('[Subscription] An error occurred')
		console.error(error)
	})

	//setInterval(() => Client.publish('ping', '30'), 10000)
})

Client.on('error', error => {
	console.error('Error')
	console.error(error)
})

Client.on('reconnect', () => {
	console.log('Reconnecting')
})

Client.on('close', () => {
	console.log('Client is closed')
})

Client.on('offline', () => {
	console.log('Client is offline')
})

/* Triggered when the client sends any topic */
Client.on('packetsend', packet => {
	/*console.log('-----------------------Packet send-------------------')
	console.info(packet)
	console.log('-----------------------End packet-------------------')*/
})

/* Triggered when the client receives any topic */
Client.on('packetreceive', packet => {
	/*console.log('-----------------------Packet receive-------------------')
	console.log(packet)
	console.log('-----------------------End packet-------------------')*/
})

Client.on('message', (topic, payload, packet) => {
	/*console.log('-------------------Receive message----------------------')
	payload = payload.toString()
	console.log(topic + ': ' + payload)
	//console.log(payload)
	console.log('-------------------End message----------------------')*/
	const Device = require('controller/device')
	try{
		payload = payload.toString()
		Device.parseData(payload)
	}catch(e){
		console.log(e)
	}
})

module.exports = Client
