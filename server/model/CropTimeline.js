const mongoose = require('mongoose')
const { writeImg } = require('utils/db/farm')
const Crop = require('./Crop')

const CropTimeline = new mongoose.Schema(
	{
		cropId: { type: String, required: true },
		ownerId: { type: String, default: '' },
		owner: { type: Object },
		subject: { type: String, default: '' },
		content: { type: String, default: '' },
		medias: { type: Array, default: [] },
		tags: { type: Array, default: [] },
		status: { type: Boolean, required: true, default: true },
		date: { type: Number, default: (new Date()).getTime() },
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'CropTimeline',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

CropTimeline.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

CropTimeline.pre('save', async function(next) {
	let crop = await Crop.findById(this.cropId)
	for(let i = 0; i < this.medias.length; i++){
		let media = this.medias[i]
		if(media.indexOf("base64") > 0){
			const [avatar] = await Promise.all([
				writeImg({avatar: media, name: crop.name}),
			])
			media = avatar
			this.medias[i] = media
		}
	}
	
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

CropTimeline.methods = {
	getShort() {
		return {
			_id: this._id,
			cropId: this.cropId,
			subject: this.subject,
			content: this.content,
			medias: this.medias,
			status: this.status,
			date: this.date
		}
	}
}

CropTimeline.statics.findByName = function(name) {
	return this.find({ content: new RegExp(name, 'i') })
}

CropTimeline.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

CropTimeline.set('toJSON', { getters: true, virtuals: true })
CropTimeline.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('CropTimeline', CropTimeline)
