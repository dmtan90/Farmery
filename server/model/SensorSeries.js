const mongoose = require('mongoose')
const { SensorShot, Sensor } = require('./Sensor')

const SerieType = ["utm", "hourly", "daily", "weekly", "monthly"];

const SensorSeries = new mongoose.Schema(
	{
		sensorId: { type: String, required: true },
		type: { type: String, required: true, enum: SerieType, default: 'utm' },
		value: { type: Number, required: true, default: 0 },
		unit: { type: String, required: true, default: '' },
		aggregation: {
			min: { type: Number, default: -1000 },
			max: { type: Number, default: -1000 },
			med: { type: Number, default: -1000 },
			avg: { type: Number, default: -1000 }
		},
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'SensorSeries',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

SensorSeries.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

SensorSeries.methods = {
	
}

SensorSeries.set('toJSON', { getters: true, virtuals: true })
SensorSeries.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('SensorSeries', SensorSeries)
