const mongoose = require('mongoose')
const { FarmShort, Farm } = require('./Farm')
const { UserShort, User } = require('./User')
const { Sensor } = require('./Sensor')
const { Relay } = require('./Relay')

const DeviceShort = new mongoose.Schema({
	_id: String,
	uid: String,
	name: String,
	ownerId: String,
	model: Number
})

const Device = new mongoose.Schema(
	{
		uid: { type: String, required: true, uppercase: true, trim: true },
		name: { type: String, required: true, uppercase: true, default: '' },
		gatewayId: { type: String, default: '' },
		cropId: { type: String, default: '' },// is used for the VKIST AI gateway to push crop data
		ownerId: { type: String, required: true },
		owner: { type: Object },
		status: { type: Boolean, required: true, default: true },//false: inactive, true: active
		state: { type: Number, required: true, default: 0 },//0: offline, 1: online, -1: error
		model: { type: Number, required: true, default: 1 },//device model
		tags: { type: Array, default: [] },//just used for the device timeline
		control: {
			sensorIds: { type: Array, default: [] },//Array<String>
			sensors: { type: Array, required: true, default: [] },//Array<SensorShort>
			relayIds: { type: Array, default: [] },//Array<String>
			relays: { type: Array, required: true, default: [] }//Array<RelayShort>
		},
		share: {
			adminIds: { type: Array, required: true, default: [] },//Array<String>
			userIds: { type: Array, required: true, default: [] },//Array<String>
			admins: { type: Array, required: true, default: [] },//Array<UserShort>
			users: { type: Array, required: true, default: [] },//Array<UserShort>
		},
		location: {
			latitude: { type: Number, default: 0 },
			longitude: { type: Number, default: 0 },
			timezone: { type: String, default: 'Asia/Ho_Chi_Minh' }
		},
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Device',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Device.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Device.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Device.methods = {
	getShort() {
		return {
			_id: this._id,
			uid: this.uid,
			name: this.name,
			ownerId: this.ownerId,
			model: this.model,
			state: this.state
		}
	},
	getSensor(type){
		let sensor = null
		this.control.sensors.forEach(sens => {
			if(type === sens.type){
				sensor = sens
			}
		})
		if(this.control.sensors.length == 1){
			sensor = this.control.sensors[0]
		}
		return sensor
	},
	getRelay(type){
		let relay = null
		this.control.relays.forEach(rel => {
			if(type === rel.type){
				relay = rel
			}
		})
		if(this.control.relays.length == 1){
			relay = this.control.relays[0]
		}
		return relay
	},
}

Device.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

Device.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

Device.set('toJSON', { getters: true, virtuals: true })
Device.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('DeviceShort', DeviceShort)
module.exports = mongoose.model('Device', Device)
