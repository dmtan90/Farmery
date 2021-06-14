const mongoose = require('mongoose')
const { writeImg } = require('utils/db/farm')
const { UserShort, User } = require('./User')

const OrgShort = new mongoose.Schema({
	_id: String,
	name: String,
  	avatar: String
})

const Organization = new mongoose.Schema(
	{
		name: { type: String, required: true },
		avatar: { type: String, trim: true },
		ownerId: { type: String, required: true },
		parentId: { type: String, default: '' }, //parent orgId
		owner: { type: Object },
		members: {
			adminIds: { type: Array, required: true, default: [] },//Array<String>
			userIds: { type: Array, required: true, default: [] },//Array<String>
			farmIds: { type: Array, required: true, default: [] },//Array<String>
			admins: { type: Array, required: true, default: [] },//Array<UserShort>
			users: { type: Array, required: true, default: [] },//Array<UserShort>
			farms: { type: Array, required: true, default: [] },//Array<UserShort>
		},
		status: { type: Boolean, required: true, default: true },//false: inactive, true: active
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Organization',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Organization.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Organization.pre('save', async function(next) {
	if(this.avatar.indexOf("base64") > 0){
		const [avatar] = await Promise.all([
			writeImg(this),
		])
		this.avatar = avatar
	}
	
	this.meta.updatedAt = (new Date()).getTime();

	next()
})

Organization.methods = {
	getShort(){
		return {
			_id: this._id,
			name: this.name,
  			avatar: this.avatar
		}
	}
}

Organization.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

Organization.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

Organization.set('toJSON', { getters: true, virtuals: true })
Organization.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('OrgShort', OrgShort)
module.exports = mongoose.model('Organization', Organization)
