const Client = require('utils/mqtt')
const { publicTopics } = require('config/mqtt')
const Relay = require('model/Relay')
const Device = require('model/Device')
const log = require('utils/log')

const PubDevice = {
	async send(uid, payload){
		let topic = 'farmery/to-gateway'
		if(publicTopics.length > 0){
			topic = publicTopics[0] + '/' + uid
		}
		Client.publish(topic, payload)
	},

	async setRelayState(relay, state) {
		const device = await Device.findById(relay.deviceId)
		if(device){
			let uid = device.uid
			if(device.gatewayId){
				const gateway = await Device.findById(device.gatewayId)
				if(gateway){
					uid = gateway.uid
				}
			}
			else {
				uid = device.uid
			}
			let payload = {
				device_mac_address: device.uid,
				type: "set_relay_state",
				device_user_trigger: true,
				timestamp: (new Date()).getTime(),
				data: [
					{
						controller_type: relay.type,
						controller_is_on: state
					}
				]
			}
			log.debug("setRelayState: " + JSON.stringify(payload))
			await PubDevice.send(uid, JSON.stringify(payload))
		}
	},

	async setDeviceProfile(device, profile) {
		if(device){
			if(device.gatewayId){
				const gateway = await Device.findById(device.gatewayId)
				if(gateway){
					uid = gateway.uid
				}
			}
			else {
				uid = device.uid
			}

			let payload = {
				device_mac_address: device.uid,
				type: "set_device_profile",
				timestamp: (new Date()).getTime(),
				data: profile
			}
			log.debug("setDeviceProfile: " + JSON.stringify(payload))
			await PubDevice.send(uid, JSON.stringify(payload))
		}
	}
}

module.exports = PubDevice
