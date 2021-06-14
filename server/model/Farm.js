const mongoose = require('mongoose')
const { writeImg } = require('utils/db/farm')
const { UserShort, User } = require('./User')
const { DeviceShort, Device } = require('./Device')

const FarmShort = new mongoose.Schema({
	_id: String,
	name: String,
  	avatar: String
})

const Farm = new mongoose.Schema(
	{
		orgId: { type: String, required: false, default: '' },
		org: { type: Object },
		name: { type: String, required: true },
		avatar: { type: String, trim: true },
		address: {
			city: { type: String, required: true, default: '' },
			country: { type: String, required: false, default: '' },
			latitude: { type: Number, required: true },
			longitude: { type: Number, required: true }
		},
		ownerId: { type: String, required: true },
		owner: { type: Object },
		share: {
			adminIds: { type: Array, required: true, default: [] },//Array<String>
			userIds: { type: Array, required: true, default: [] },//Array<String>
			admins: { type: Array, required: true, default: [] },//Array<UserShort>
			users: { type: Array, required: true, default: [] },//Array<UserShort>
		},
		deviceIds: { type: Array, required: true, default: [] },//Array<String>
		devices: { type: Array, required: false, default: [] },//Array<DeviceShort>
		enabled: { type: Boolean, required: true, default: true },//false: inactive, true: active
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Farm',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Farm.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Farm.pre('save', async function(next) {
	if(this.avatar.indexOf("base64") > 0){
		const [avatar] = await Promise.all([
			writeImg(this),
		])
		this.avatar = avatar
	}
	
	this.meta.updatedAt = (new Date()).getTime();

	next()
})

Farm.methods = {
	getShort(){
		return {
			_id: this._id,
			name: this.name,
  			avatar: this.avatar,
  			address: this.address,
  			orgId: this.orgId
		}
	}
}

Farm.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

Farm.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	console.log(ids)
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

Farm.set('toJSON', { getters: true, virtuals: true })
Farm.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('FarmShort', FarmShort)
module.exports = mongoose.model('Farm', Farm)
