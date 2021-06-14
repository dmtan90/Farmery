const mongoose = require('mongoose')

const Feedback = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		account: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		rate: {
			type: Number,
			required: false,
			max: 6,
			min:0
		},
		evaluation: {
			type: String,
			required: false,
			trim: true
		}
	},
	{
		collection: 'Feedback',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)
Feedback.set('toJSON', { getters: true, virtuals: true })
Feedback.set('toObect', { getters: true, virtuals: true })


module.exports = mongoose.model('Feedback',Feedback)
