const mongoose = require('mongoose')
const { writeImg } = require('utils/db/farm')

const SensorType = [
	{
		"name": "LIGHT_SENSOR",
		"value": 1,
		"unit": "LUX"
	},
	{
		"name": "AIR_TEMPERATURE_SENSOR",
		"value": 2,
		"unit": "*C"
	},
	{
		"name": "AIR_HUMIDITY_SENSOR",
		"value": 3,
		"unit": "%"
	},
	{
		"name": "SOIL_TEMPERATURE_SENSOR",
		"value": 4,
		"unit": "*C"
	},
	{
		"name": "SOIL_HUMIDITY_SENSOR",
		"value": 5,
		"unit": "%"
	},
	{
		"name": "SOIL_EC_SENSOR",
		"value": 6,
		"unit": "ppm"
	},
	{
		"name": "SOIL_PH_SENSOR",
		"value": 7,
		"unit": "pH"
	},
	{
		"name": "WATER_TEMPERATURE_SENSOR",
		"value": 8,
		"unit": "*C"
	},
	{
		"name": "WATER_EC_SENSOR",
		"value": 9,
		"unit": "mS/cm"
	},
	{
		"name": "WATER_PH_SENSOR",
		"value": 10,
		"unit": "pH"
	},
	{
		"name": "WATER_ORP_SENSOR",
		"value": 11,
		"unit": "mV"
	},
	{
		"name": "BATTERY_SENSOR",
		"value": 12,
		"unit": "%"
	},
	{
		"name": "CO2_SENSOR",
		"value": 13,
		"unit": "ppm"
	},
	{
		"name": "WATER_LEVEL_SENSOR",
		"value": 14,
		"unit": "cm"
	},
	{
		"name": "WATER_LEAK_SENSOR",
		"value": 15,
		"unit": "true/false"
	},
	{
		"name": "ERROR_SENSOR",
		"value": 16,
		"unit": "true/false"
	},
	{
		"name": "UV_SENSOR",
		"value": 17,
		"unit": "uV"
	},
	{
		"name": "PRESSURE_SENSOR",
		"value": 18,
		"unit": "hPa"
	},
	{
		"name": "SOUND_SENSOR",
		"value": 19,
		"unit": "dB"
	},
	{
		"name": "VOC_SENSOR",
		"value": 20,
		"unit": "ppb"
	},
	{
		"name": "MAGNETIC_SENSOR",
		"value": 21,
		"unit": "mT"
	},
	{
		"name": "WIND_SENSOR",
		"value": 22,
		"unit": "m/s"
	},
	{
		"name": "VOLTAGE_SENSOR",
		"value": 23,
		"unit": "V"
	},
	{
		"name": "AMPERAGE_SENSOR",
		"value": 24,
		"unit": "A"
	},
	{
		"name": "POWER_ENERGY_SENSOR",
		"value": 25,
		"unit": "W"
	}
]

const RelayType = [
	{
		name: "SWITCH_CONTROLLER",
		value: 0
	},
	{
		name: "LAMP_CONTROLLER",
		value: 1
	},
	{
		name: "WATER_PUMP_CONTROLLER",
		value: 2
	},
	{
		name: "MISTING_PUMP_CONTROLLER",
		value: 3
	},
	{
		name: "FAN_CONTROLLER",
		value: 4
	},
	{
		name: "AIR_CONDITIONER_CONTROLLER",
		value: 5
	},
	{
		name: "CO2_CONTROLLER",
		value: 6
	},
	{
		name: "DOSING_PUMP_CONTROLLER",
		value: 7
	},
	{
		name: "OXYGEN_PUMP_CONTROLLER",
		value: 8
	},
	{
		name: "VALVE_INPUT",
		value: 9
	},
	{
		name: "VALVE_OUTPUT",
		value: 10
	},
	{
		name: "WASHING_MODE_CONTROLLER",
		value: 11
	},
	{
		name: "CALIBRATING_MODE_CONTROLLER",
		value: 12
	},
	{
		name: "NUTRIENT_A_CONTROLLER",
		value: 13
	},
	{
		name: "NUTRIENT_B_CONTROLLER",
		value: 14
	},
	{
		name: "NUTRIENT_C_CONTROLLER",
		value: 15
	},
	{
		name: "NUTRIENT_D_CONTROLLER",
		value: 16
	},
	{
		name: "ACID_PUMP_CONTROLLER",
		value: 17
	},
	{
		name: "ALKALI_PUMP_CONTROLLER",
		value: 18
	},
	{
		name: "CHILLER_WATER_CONTROLLER",
		value: 19
	},
	{
		name: "HEATER_WATER_CONTROLLER",
		value: 20
	},
	{
		name: "COOLER_AIR_CONTROLLER",
		value: 21
	},
	{
		name: "HEATER_AIR_CONTROLLER",
		value: 22
	},
	{
		name: "R1_CONTROLLER",
		value: 23
	},
	{
		name: "R2_CONTROLLER",
		value: 24
	},
	{
		name: "R3_CONTROLLER",
		value: 25
	},
	{
		name: "R4_CONTROLLER",
		value: 26
	},
];

/*export interface IDeviceModel extends Document {
	uid: Number;
	name: String;
	status: Boolean;
	sensors: Array<Number>;
	relays: Array<Number>;
	meta: {
	    createdAt: Number;
	    updatedAt: Number;
	};
}*/

const DeviceModel = new mongoose.Schema(
	{
		uid: { type: Number, required: true, unique: true },
		name: { type: String, required: true, uppercase: true, unique: true, default: '' },
		status: { type: Boolean, required: true, default: true },//false: inactive, true: active
		avatar: { type: String, required: true, default: '' },
		sensors: { type: Array, required: true, default: [] },//Array<SensorType>
		relays: { type: Array, required: true, default: [] },//Array<RelayType>
		dataFormat: { type: String, default: '' },//for mesh device e.g uid#LIGHT_SENSOR#AIR_TEMPERATURE_SENSOR#AIR_HUMIDITY_SENSOR#WATER_PUMP_CONTROLLER#LAMP_CONTROLLER
		meta: {
		    createdAt: { type: Number, required: true, default: (new Date()).getTime() },
		    updatedAt: { type: Number, required: true, default: (new Date()).getTime() }
		}
	},
	{
		collection: 'DeviceModel',
		timestamps: true,
		safe: true,
		wtimeout: 10000
	}
)

DeviceModel.pre('update', async function(next) {
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

DeviceModel.pre('save', async function(next) {
	if(this.avatar.indexOf("base64") > 0){
		const [avatar] = await Promise.all([
			writeImg(this),
		])
		this.avatar = avatar
	}
	this.meta.updatedAt = (new Date()).getTime();
	next()
})

DeviceModel.methods = {
	getSensor(value){
		let sensor = null
		for(let i = 0; i < SensorType.length; i++){
			const sens = SensorType[i]
			if(value === sens.value){
				sensor = sens
				break
			}
		}
		return sensor
	},
	getSensorByName(name){
		let sensor = null
		for(let i = 0; i < SensorType.length; i++){
			const sens = SensorType[i]
			if(name === sens.name){
				sensor = sens
				break
			}
		}
		return sensor
	},
	getRelay(value){
		let relay = null
		for(let i = 0; i < RelayType.length; i++){
			const rel = RelayType[i]
			if(value === rel.value){
				relay = rel
				break
			}
		}
		return relay
	},
	getRelayByName(name){
		let relay = null
		for(let i = 0; i < RelayType.length; i++){
			const rel = RelayType[i]
			if(name === rel.name){
				relay = rel
				break
			}
		}
		return relay
	},
	getSensorType(){
		return SensorType
	},
	getRelayType(){
		return RelayType
	},
	//for mesh device
	parseData(data){
		let res = {
			uid: "",
			sensors: [],
			relays: []
		}
		if(data != undefined && data.indexOf("#") > 0 
			&& this.dataFormat != undefined && this.dataFormat != ""){
			const points = data.split("#");
			const formats = this.dataFormat.split("#")
			for(let i = 0; i < formats.length; i++){
				if(formats[i] == "uid"){
					res.uid = points[i].toUpperCase()
				}
				else{
					const sensor = this.getSensorByName(formats[i])
					if(sensor){
						res.sensors.push({
							sensor_type: sensor.value,
							sensor_value: parseFloat(points[i])
						})
					}
					else{
						const relay = this.getRelayByName(formats[i])
						if(relay){
							res.sensors.push({
								controller_type: relay.value,
								controller_is_on: (points[i] === "true" ? true : false)
							})
						}
					}
				}
			}
		}
		console.log(res)
		return res
	}
}

DeviceModel.statics.findByName = function(name) {
	return this.find({ name: new RegExp(name, 'i') })
}

DeviceModel.statics.findByIds = function(ids) {
	let filter = { $or: [] }
	ids.forEach(id => {
		filter.$or.push({ _id: mongoose.Types.ObjectId(id) })
	})
	return this.find(filter)
}

DeviceModel.set('toJSON', { getters: true, virtuals: true })
DeviceModel.set('toObect', { getters: true, virtuals: true })

module.exports = mongoose.model('DeviceModel', DeviceModel)
