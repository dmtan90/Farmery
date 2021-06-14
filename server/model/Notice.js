//const mongoose = require('mongoose')
//const config = require('config/notice')
//const User = require('model/User')

const mongoose = require('mongoose')
const { UserShort, User } = require('./User')
const { FarmShort, Farm } = require('./Farm')
const { DeviceShort, Device } = require('./Device')

const NoticeType = ["farm", "device"]

const NoticeShort = new mongoose.Schema({
	_id: String,
	sender: String,
	receiver: String,
	message: String,
	type: String,
	status: Boolean
})

const Notice = new mongoose.Schema(
	{
		sender: {
			name: { type: String, required: true, default: '' },
			email: { type: String, required: false, trim: true },
		},
		receiver: {
			name: { type: String, required: true, default: '' },
			email: { type: String, required: false, trim: true },
		},
		message: { type: String, required: true },
		type: { type: String, required: true, enum: NoticeType, default: 'farm' },
		status: { type: Number, required: true, enum: [-1, 0, 1, 2], default: 0 },
		system: { type: Boolean, required: true, default: false },
		sysMessage: {
			sender: { type: String, trim: true },
			receiver: { type: String, trim: true },
		},
		farmId: { type: String, default: '' },
		deviceId: { type: String, default: '' },
		farm: { type: Object },
		device: { type: Object },
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Notice',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Notice.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Notice.pre('save', async function (next) {
	const { email } = this.receiver
	const news = `news.${this.type}`
	await User.updateOne({ email }, { $inc: { [news]: 1 } })
	next()
})

Notice.set('toJSON', { getters: true, virtuals: true })
Notice.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('NoticeShort',NoticeShort)
module.exports = mongoose.model('Notice',Notice)
