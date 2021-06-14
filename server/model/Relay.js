const mongoose = require('mongoose')

const Relay = new mongoose.Schema(
	{
		deviceId: { type: String, required: true },
		name: { type: String, required: true, default: '' },
		type: { type: Number, required: true, default: 1 },
		state: { type: Boolean, required: true, default: false },
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Relay',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Relay.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Relay.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Relay.methods = {
	getShort() {
		return {
			_id: this._id,
			name: this.name,
			type: this.type,
			state: this.state,
			meta: {
			    createdAt: this.meta.createdAt,
			    updatedAt: this.meta.updatedAt
			}
		}
	},
}

Relay.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

Relay.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

Relay.set('toJSON', { getters: true, virtuals: true })
Relay.set('toObect', { getters: true, virtuals: true })

//module.exports = mongoose.model('RelayShort', RelayShort)
module.exports = mongoose.model('Relay', Relay)
