const mongoose = require('mongoose')
const { writeImg } = require('utils/db/farm')
const Device = require('./Device')

// this object is used for the VKIST AI gateway to upload the analysis data from the camera
const DeviceTimeline = new mongoose.Schema(
	{
		deviceId: { type: String, required: true },
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
		collection: 'DeviceTimeline',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

DeviceTimeline.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

DeviceTimeline.pre('save', async function(next) {
	let device = await Device.findById(this.deviceId)
	for(let i = 0; i < this.medias.length; i++){
		let media = this.medias[i]
		if(media.indexOf("base64") > 0){
			const [avatar] = await Promise.all([
				writeImg({avatar: media, name: device.name}),
			])
			media = avatar
			this.medias[i] = media
		}
	}
	
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

DeviceTimeline.methods = {
	getShort() {
		return {
			_id: this._id,
			deviceId: this.deviceId,
			ownerId: this.ownerId,
			subject: this.subject,
			content: this.content,
			medias: this.medias,
			tags: this.tags,
			status: this.status,
			date: this.date
		}
	}
}

DeviceTimeline.statics.findByName = function(name) {
	return this.find({ content: new RegExp(name, 'i') })
}

DeviceTimeline.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

DeviceTimeline.set('toJSON', { getters: true, virtuals: true })
DeviceTimeline.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('DeviceTimeline', DeviceTimeline)
