const mongoose = require('mongoose')

/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/

const SensorThreshold = new mongoose.Schema(
	{
		sensorId: { type: String, required: true },
		cron: { type: String, required: true, default: '* * * * * *' },//cron format second - minute - hour - day of month - month - day of week
		onTime: { type: Number, required: true, default: 0 },// miliseconds from timestamp
		threshold: {
			minValue: { type: Number, required: true, default: 0 },//
			maxValue: { type: Number, required: true, default: 0 },//
		},
		//apply for the EC nutrient mixing
		percentage: {
			a: { type: Number, default: 0 },//
			b: { type: Number, default: 0 },//
			c: { type: Number, default: 0 },//
			d: { type: Number, default: 0 },//
			dosing_time: { type: Number, default: 60 },//seconds
			dosing_interval: { type: Number, default: 60 }//seconds
		},
		status: { type: Boolean, required: true, default: true },
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'SensorThreshold',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

SensorThreshold.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

SensorThreshold.methods = {
	getShort() {
		let percentage = null
		if(this.percentage !== undefined){
			percentage = this.percentage
		}
		return {
			_id: this._id,
			sensorId: this.sensorId,
			cron: this.cron,
			onTime: this.onTime,
			//offTime: this.offTime,
			status: this.status,
			threshold: {
				minValue: this.threshold.onTime,
				maxValue: this.threshold.offTime
			},
			percentage: percentage,
			meta: {
			    createdAt: this.meta.createdAt,
			    updatedAt: this.meta.updatedAt
			}
		}
	},
}

SensorThreshold.set('toJSON', { getters: true, virtuals: true })
SensorThreshold.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('SensorThreshold', SensorThreshold)
