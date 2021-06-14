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

const IFTTT = new mongoose.Schema(
	{
		ownerId: { type: String, required: true },
		owner: { type: Object },
		farmId: { type: String, required: false },// apply for all farms or only specific farm
		cron: { type: String, required: true, default: '* * * * * *' },//cron format second - minute - hour - day of month - month - day of week
		onTime: { type: Number, required: true, default: 0 },// miliseconds from timestamp
		offTime: { type: Number, required: true, default: 0 },// miliseconds from timestamp
		sensorId: { type: String, required: true, default: '' },
		sensorType: { type: Object, required: true, default: null },//ref SensorType in DeviceModel
		condition: {
			value: { type: Number, required: true, default: 0 },//
			expression: { type: String, required: true, default: '' },// =; >; >=; <; <=
		},
		weather: {
			condition: {
				name: { type: String, required: false, default: '' }, //light, air temp, air humidity ....
				type: { type: Number, required: false, default: 1 }, //ref SensorType in DeviceModel
			},// air temp, 
			value: { type: Number, required: false, default: 0 },//
			expression: { type: String, required: false, default: '' },// =; >; >=; <; <=
		},
		relayId: { type: String, required: true },
		relayType: { type: Object, required: true, default: null },//ref RelayType in DeviceModel
		action: {
			isOn: { type: Boolean, required: true, default: true },//
			duration: { type: Number, required: true, default: 0 },// minutes
		},
		type: { type: Number, required: true, default: 0 }, // 0: device trigger; 1: weather trigger
		status: { type: Boolean, required: true, default: true },
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'IFTTT',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

IFTTT.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

IFTTT.methods = {
	getShort() {
		return {
			_id: this._id,
			ownerId: this.ownerId,
			farmId: this.farmId,
			cron: this.cron,
			onTime: this.onTime,
			offTime: this.offTime,
			sensorId: this.sensorId,
			sensorType: this.sensorType,
			condition: this.condition,
			weather: this.weather,
			relayId: this.relayId,
			relayType: this.relayType,
			action: this.action,
			type: this.type,
			status: this.status,
			meta: this.meta
		}
	},
}

IFTTT.set('toJSON', { getters: true, virtuals: true })
IFTTT.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('IFTTT', IFTTT)
