const mongoose = require('mongoose')
const { FarmShort, Farm } = require('./Farm')
const { ZoneShort, Zone } = require('./Zone')
const { PlantShort, Plant } = require('./Plant')

const UnitType = [
	{
		name: "POTS",
		value: 1
	},
	{
		name: "TRAYS",
		value: 2
	}
]

const CropShort = new mongoose.Schema({
	_id: String,
	name: String,
	startDate: Number,
	endDate: Number,
	status: Boolean,
	size: {
		value: Number,
		unit: Number,
	}
})

const Crop = new mongoose.Schema(
	{
		zoneId: { type: String, required: true },
		plantId: { type: String, required: true },
		name: { type: String, required: true, default: '' },
		status: { type: Boolean, required: true, default: true },
		zone: { type: Object },
		plant: { type: Object },
		startDate: { type: Number, required: true, default: (new Date()).getTime() },
		endDate: { type: Number, required: true, default: (new Date()).getTime() },
		tags: { type: Array, default: [] },
		size: {
			value: { type: Number, required: true, default: 1 },
			unit: {
				name: { type: String, required: true, default: 'POTS' },
				value: { type: Number, required: true, default: 1 },
			}
		},
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Crop',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Crop.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Crop.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Crop.methods = {
	getUnits() {
		return UnitType
	},
	getShort() {
		return {
			_id: this._id,
			name: this.name,
			startDate: this.startDate,
			endDate: this.endDate,
			status: this.status,
			size: {
				value: this.size.value,
				unit: this.size.unit.value,
			}
		}
	}
}

Crop.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

Crop.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

Crop.set('toJSON', { getters: true, virtuals: true })
Crop.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('CropShort', CropShort)
module.exports = mongoose.model('Crop', Crop)
