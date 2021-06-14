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

const RelayTimer = new mongoose.Schema(
	{
		relayId: { type: String, required: true },
		cron: { type: String, required: true, default: '* * * * * *' },//cron format second - minute - hour - day of month - month - day of week
		type: { type: Number, required: true, default: 1 }, //0: cycle 1: timer
		onTime: { type: Number, required: true, default: 0 },// miliseconds from timestamp
		offTime: { type: Number, required: true, default: 0 },// miliseconds from timestamp
		cycle: {
			onTime: { type: Number, required: true, default: 5 },// minutes in cycle mode
			offTime: { type: Number, required: true, default: 5 },// minutes in cycle mode
		},// milliseconds from timestamp
		status: { type: Boolean, required: true, default: true },
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'RelayTimer',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

RelayTimer.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

RelayTimer.methods = {
	getShort() {
		return {
			_id: this._id,
			relayId: this.relayId,
			cron: this.cron,
			type: this.type,
			onTime: this.onTime,
			offTime: this.offTime,
			status: this.status,
			cycle: {
				onTime: this.cycle.onTime,
				offTime: this.cycle.offTime
			},
			meta: {
			    createdAt: this.meta.createdAt,
			    updatedAt: this.meta.updatedAt
			}
		}
	},
}

RelayTimer.set('toJSON', { getters: true, virtuals: true })
RelayTimer.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('RelayTimer', RelayTimer)
