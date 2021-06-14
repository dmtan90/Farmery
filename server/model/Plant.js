const mongoose = require('mongoose')
const { writeImg } = require('utils/db/farm')

const PlantShort = new mongoose.Schema({
	_id: String,
	name: String,
	avatar: String
})

const Plant = new mongoose.Schema(
	{
		name: { type: String, required: true, default: '' },
		avatar: { type: String, required: true, default: '' },
		description: { type: String, required: true, default: '' },
		status: { type: Boolean, required: true, default: true },
		ownerId: { type: String, required: true, default: '' },
		owner: { type: Object },
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Plant',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Plant.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Plant.pre('save', async function(next) {
	if(this.avatar.indexOf("base64") > 0){
		const [avatar] = await Promise.all([
			writeImg(this),
		])
		this.avatar = avatar
	}
	
	this.meta.updatedAt = (new Date()).getTime();

	next()
})

Plant.methods = {
	getShort() {
		return {
			_id: this._id,
			name: this.name,
			avatar: this.avatar
		}
	}
}

Plant.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

Plant.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

Plant.set('toJSON', { getters: true, virtuals: true })
Plant.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('PlantShort', PlantShort)
module.exports = mongoose.model('Plant', Plant)
