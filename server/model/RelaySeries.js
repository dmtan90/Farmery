const mongoose = require('mongoose')
const { RelayShort, Relay } = require('./Relay')

const SerieType = ["utm", "hourly", "daily"];


const RelaySeries = new mongoose.Schema(
	{
		relayId: { type: String, required: true },
		type: { type: String, required: true, enum: SerieType, default: 'utm' },
		state: { type: Boolean, required: true, default: false },
		duration: { type: Number, required: true, default: 0 },//seconds
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'RelaySeries',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

RelaySeries.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

RelaySeries.methods = {
	
}

RelaySeries.set('toJSON', { getters: true, virtuals: true })
RelaySeries.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('RelaySeries', RelaySeries)
