const mongoose = require('mongoose')
const Auth = new mongoose.Schema(
	{
		clientID: {
			type: String,
			required: true,
			trim: true
		},
		username: {
			type: String,
			required: true,
			trim: true
		},
		password: {
			type: String,
			required: true,
			trim: true
		},
		publishTopics: {
			type: [String],
			required: false
		},
		subscribeTopics: {
			type: [String],
			required: false
		}
	},
	{
		collection: 'Auth',
		safe: true,
		wtimeout: 10000
	}
)

Auth.set('toJSON', { getters: true, virtuals: true })
Auth.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('Auth', Auth)
