const mongoose = require('mongoose')
const { writeImg } = require('utils/db/farm')
const { FarmShort, Farm } = require('./Farm')

const ZoneType = [
	{
		name: "SEEDING",
		value: 1
	},
	{
		name: "GROWING",
		value: 2
	}
];

const UnitType = [
	{
		name: "M2",
		value: 1
	},
	{
		name: "HA",
		value: 2
	}
];

const CultivationType = [
	{
		name: "OUTDOOR FIELD",
		value: 1
	},
	{
		name: "GREENHOUSE (INDOOR)",
		value: 2
	},
	{
		name: "VERTICAL (INDOOR)",
		value: 3
	}
];

const ZoneShort = new mongoose.Schema({
	_id: String,
	avatar: String,
	name: String,
	cultivationType: Number,
	zoneType: Number,
	zoneSize: Number,
	status: Boolean
})

const Zone = new mongoose.Schema(
	{
		farmId: { type: String, required: true },
		name: { type: String, required: true, default: '' },
		avatar: { type: String, required: true, default: '' },
		status: { type: Boolean, required: true, default: true },
		farm: { type: Object },
		cultivationType: {
			name: { type: String, required: true, default: 'GREENHOUSE (INDOOR)' },
			value: { type: Number, required: true, default: 1 },
		},
		zoneType: {
			name: { type: String, required: true, default: 'SEEDING' },
			value: { type: Number, required: true, default: 1 },
		},
		zoneSize: {
			value: { type: Number, required: true, default: 1 },
			name: { type: String, required: true, default: 'M2' },
			unit: { type: Number, required: true, default: 1 },
		},
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Zone',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Zone.pre('update', async function(next) {
	console.log(this)
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Zone.pre('save', async function(next) {
	if(this.avatar.indexOf("base64") > 0){
		const [avatar] = await Promise.all([
			writeImg(this),
		])
		this.avatar = avatar
	}
	
	this.meta.updatedAt = (new Date()).getTime();

	next()
})

Zone.methods = {
	getUnits(){
		return UnitType
	},

	getTypes(){
		return ZoneType
	},

	getCultivations(){
		return CultivationType
	},
	getShort() {
		return {
			_id: this._id,
			avatar: this.avatar,
			name: this.name,
			cultivationType: this.cultivationType.value,
			zoneType: this.zoneType.value,
			zoneSize: this.zoneSize.value,
			status: this.status
		}
	}
}

Zone.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

Zone.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

Zone.set('toJSON', { getters: true, virtuals: true })
Zone.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('ZoneShort', ZoneShort)
module.exports = mongoose.model('Zone', Zone)