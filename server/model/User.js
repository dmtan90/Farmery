const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { writeImg, bcryptPass } = require('utils/db/user')
const { FarmShort, Farm } = require('./Farm')
const { DeviceShort, Device } = require('./Device')

const UserShort = new mongoose.Schema({
	name: String,
	email: String,//uid
	avatar: String
})

const User = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: String, default: '' },
		phone: { type: String, default: '' },
		address: {
			city: { type: String, default: '' },
			country: { type: String, default: '' },
			latitude: { type: Number, default: 0 },
			longitude: { type: Number, default: 0 }
		},
		farmIds: { type: Array, default: [] },
		deviceIds: { type: Array, default: [] },
		status: { type: Number, default: 1 },//-1: lock, 0: inactive, 1: active
		news: { type: Object, default: {} },
		role: { type: Number, default: 1 },//0: sysadmin, 1: user
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'User',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

User.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

User.pre('save', async function(next) {
	/*if(this.avatar && this.avatar.indexOf("base64") > 0){
		const [avatar, password] = await Promise.all([
			writeImg(this),
			bcryptPass(this)
		])
		this.avatar = avatar
		this.password = password
	}*/
	
	/*let password = await bcryptPass(this)
	if(this.avatar && this.avatar.indexOf("base64") > 0){
		let avatar = await writeImg(this)
		this.avatar = avatar	
	}
	if(this.address){

	}*/
	if(this.avatar && this.avatar.indexOf("base64") > 0){
		let avatar = await writeImg(this)
		this.avatar = avatar
	}
	
	this.meta.updatedAt = (new Date()).getTime();

	next()
})

User.methods = {
	getShort() {
		return {
			name: this.name, 
			email: this.email, 
			avatar: this.avatar
		}
	},
	comparePassword(newPass, hadBcryptPass) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(newPass, hadBcryptPass, (err, isMatch) => {
				if (!err) {
					resolve(isMatch)
				} else {
					reject(err)
				}
			})
		})
	},
	getTotalElectricity() {
		return this.electricity.reduce((total, { usageAmount }) => {
			total += usageAmount
			return total
		}, 0)
	},
	getGroups() {

	},
	getFarms() {

	},
	getDevices() {

	}
}

User.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

User.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

User.set('toJSON', { getters: true, virtuals: true })
User.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('UserShort', UserShort)
module.exports = mongoose.model('User', User)
