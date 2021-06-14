import AsyncMQTT from './async-mqtt'
import config from 'config/mqtt'
const { localIP, port, clientId, subscribeTopics, username, password } = config

const Client = AsyncMQTT.connect(
	`mqtt://${localIP}`,
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
	console.log(`Connected to MQTT server: ${connack}`)

	Client.subscribe(subscribeTopics).then(e => {

	}).catch(error => {
		console.error('[Subscription] An error occurred')
		})

	// setInterval(() => Client.publish('testMQTT', '30'), 3000)
})

Client.on('error', error => {
	console.error(`Error：${error}`)
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
	console.log(`主题发送：${packet}`)
})

/* Triggered when the client receives any topic */
Client.on('packetreceive', packet => {
	console.log(`Packet content：${packet}`)
})

Client.on('message', (topic, payload, packet) => {
	console.log('-------------------Receive message----------------------')
	console.log([topic, payload].join(': '))
	console.log('-------------------Received----------------------')
})
