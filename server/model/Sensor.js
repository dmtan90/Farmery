const mongoose = require('mongoose')

const SensorShort = new mongoose.Schema({
	_id: String,
	name: String,
	type: Number,
	value: Number,
	unit: String,
	meta: {
	    createdAt: Number,
	    updatedAt: Number
	}
})

const Sensor = new mongoose.Schema(
	{
		deviceId: { type: String, required: true },
		name: { type: String, required: true, default: '' },
		type: { type: Number, required: true, default: 1 },
		value: { type: Number, required: true, default: 0 },
		unit: { type: String, required: true, default: '' },
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Sensor',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Sensor.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Sensor.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Sensor.methods = {
	getShort() {
		return {
			_id: this._id,
			name: this.name,
			type: this.type,
			value: this.value,
			unit: this.unit,
			meta: {
			    createdAt: this.meta.createdAt,
			    updatedAt: this.meta.updatedAt
			}
		}
	},
}

Sensor.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

Sensor.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

Sensor.set('toJSON', { getters: true, virtuals: true })
Sensor.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('SensorShort', SensorShort)
module.exports = mongoose.model('Sensor', Sensor)
