const mongoose = require('mongoose')

const LogType = [
	{
		name: "LOGIN",
		value: 1001
	},
	{
		name: "SIGNUP",
		value: 1002
	},
	{
		name: "LOGOUT",
		value: 1003
	},
	{
		name: "CHANGE PASSWORD",
		value: 1004
	},
	{
		name: "UPDATE PROFILE",
		value: 1005
	},
	{
		name: "UPDATE AVATAR",
		value: 1006
	},
	{
		name: "ADD FARM",
		value: 2001
	},
	{
		name: "UPDATE FARM",
		value: 2002
	},
	{
		name: "DELETE FARM",
		value: 2003
	},
	{
		name: "SHARE FARM",
		value: 2004
	},
	{
		name: "ADD ZONE",
		value: 3001
	},
	{
		name: "UPDATE ZONE",
		value: 3002
	},
	{
		name: "DELETE ZONE",
		value: 3003
	},
	{
		name: "ADD PLANT",
		value: 4001
	},
	{
		name: "UPDATE PLANT",
		value: 4002
	},
	{
		name: "DELETE PLANT",
		value: 4003
	},
	{
		name: "ADD CROP",
		value: 5001
	},
	{
		name: "UPDATE CROP",
		value: 5002
	},
	{
		name: "DELETE CROP",
		value: 5003
	},
	{
		name: "ADD DEVICE",
		value: 6001
	},
	{
		name: "UPDATE DEVICE",
		value: 6002
	},
	{
		name: "DELETE DEVICE",
		value: 6003
	},
	{
		name: "TOOGLE RELAY",
		value: 6004
	},
	{
		name: "UPDATE DEVICE SETTING",
		value: 6005
	},
];

/*export interface ILogShort extends Document {
	_id: String;
	logType: {
		name: String;
		value: Number;
	};
}

export interface ILog extends Document {
	name: String;
	logType: {
		name: String;
		value: Number;
	};
	description: String;//obect as json string
	status: Boolean;//true: show; false: hide
	meta: {
	    createdAt: Number;
	    updatedAt: Number;
	};
}*/

const LogShort = new mongoose.Schema(
	{
		name: String,
		logType: {
			name: String,
			value: Number
		}	
	}
)

const Log = new mongoose.Schema(
	{
		name: { type: String, required: true, default: '' },
		logType: {
			name: { type: String, required: true, default: '' },
			value: { type: Number, required: true, default: 1001 },
		},
		description: { type: String, required: true, default: '' },
		status: { type: Boolean, required: true, default: true },
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'Log',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

Log.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Log.pre('save', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

Log.methods = {
	
}

Log.set('toJSON', { getters: true, virtuals: true })
Log.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('LogShort', LogShort)
module.exports = mongoose.model('Log', Log)
