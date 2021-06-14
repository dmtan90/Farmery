const mongoose = require('mongoose')
const Farm = require('model/Farm')
const User = require('model/User')
const Device = require('model/Device')
const Sensor = require('model/Sensor')
const Relay = require('model/Relay')
const DeviceModel = require('model/DeviceModel')
const SensorSeries = require('model/SensorSeries')
const RelaySeries = require('model/RelaySeries')
const IFTTT = require('model/IFTTT')
const Crop = require('model/Crop')
const CropTimeline = require('model/CropTimeline')
const DeviceTimeline = require('model/DeviceTimeline')
const { writeImg } = require('utils/db/farm')
const { exportDeviceTimelines } = require('utils/exporter')
require('schedule/ScheduleTimer')
require('schedule/SystemTasks')
const log = require('utils/log')
//const Client = require('utils/mqtt')
//const pubDevice = require('utils/mqtt/pubDevice')
//const Usagelog = require('model/Usagelog')
//const { getUsagelog } = require('utils/db/usagelog')
//const Moment = require('moment-timezone')

const DeviceApi = {
	async hasExisted(ctx) {
		const account = ctx.state.user.data
		const { uid } = ctx.request.query
		const device = await Device.findOne({ uid, ownerId: account })
		ctx.send('', { hasExisted: !!device })
	},

	async update(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id, name, status, model, location, sensors, relays, share, cropId } = ctx.request.body

			let device = await Device.findById(_id)
			if(!device){
				return ctx.sendError('Device is not exited!')
			}

			if(device.ownerId !== account){
				return ctx.sendError('Permission denied!')
			}

			if(name !== undefined && name !== ""){
				device.name = name
			}

			let restartTask = false
			if(status !== undefined && device.status !== status){
				device.status = status
				restartTask = true
			}

			if(location != undefined){
				device.location = location
			}

			if(sensors != undefined && sensors.length > 0){
				sensors.forEach(async (sensor) => {
					let sens = device.getSensor(sensor.type)
					if(sensor.name !== sens.name){
						sens = await Sensor.findById(sensor._id)
						sens.name = sensor.name
						await sens.save()
					}
				})
			}

			if(relays != undefined && relays.length > 0){
				relays.forEach(async (relay) => {
					let rel = device.getRelay(relay.type)
					if(relay.name !== rel.name){
						rel = await Relay.findById(relay._id)
						rel.name = relay.name
						await rel.save()
					}
				})
			}

			if(model != undefined && model != device.model){
				let sensors = []
				let relays = []

				//disable all task before change model
				//await SystemTasks.setDeviceStatus(device, false)

				const deviceModel = await DeviceModel.findOne({ uid: model })
				if(!deviceModel){
					return ctx.sendError('Device model is not exited!')
				}
				device.model = model

				//remote old sensors
				await Sensor.deleteMany({deviceId: device._id})
				
				//remove old relays
				await Relay.deleteMany({deviceId: device._id})

				let sensorTypes = []
				let relayTypes = []
				deviceModel.sensors.forEach(sensorType => {
					sensorTypes.push(sensorType)
				})
				deviceModel.relays.forEach(relayType => {
					relayTypes.push(relayType)
				})

				sensorTypes.forEach(async (sensorType) => {
					//const sens = deviceModel.getSensor(sensorType)
					let sensor = new Sensor({
						deviceId: device._id,
						name: sensorType.name,
						type: sensorType.value,
						value: 0,
						unit: sensorType.unit,
					})
					sensors.push(sensor)
					await sensor.save()
				})

				relayTypes.forEach(async (relayType) => {
					//const rel = deviceModel.getRelay(relayType)
					let relay = new Relay({
						deviceId: device._id,
						name: relayType.name,
						type: relayType.value,
						state: false
					})
					relays.push(relay)
					await relay.save()
				})

				device.control.sensorIds = []
				device.control.sensors = []
				device.control.relayIds = []
				device.control.relays = []

				//await Sensor.insertMany(sensors)
				//await Relay.insertMany(relays)

				//Array.prototype.push.apply(device.control.sensors, sensors)
				//Array.prototype.push.apply(device.control.relays, relays)

				sensors.forEach(sensor => {
					device.control.sensors.push(sensor.getShort())
					device.control.sensorIds.push(sensor._id)
				})

				relays.forEach(relay => {
					device.control.relays.push(relay.getShort())
					device.control.relayIds.push(relay._id)
				})

				//save device before start tasks
				device = await device.save()

				if(sensors != undefined && Array.isArray(sensors) && sensors.length > 0){
					let devSensors = device.control.sensors
					for(let j = 0; j < sensors.length; j++){
						const sensor = sensors[j]
						if(sensor._id){
							let sen = await Sensor.findById(sensor._id)
							sen.name = sensor.name
							await sen.save()
							for(let i = 0; i < devSensors.length; i++){
								if(devSensors[i]._id.equals(sensor._id)){
									devSensors[i].name = sensor.name
									break
								}
							}
						}
					}
				}

				if(relays != undefined && Array.isArray(relays) && relays.length > 0){
					let devRelays = device.control.relays
					for(let j = 0; j < relays.length; j++){
						const relay = relays[j]
						if(relay._id){
							let rel = await Relay.findById(relay._id)
							rel.name = relay.name
							await rel.save()
							for(let i = 0; i < devRelays.length; i++){
								if(devRelays[i]._id.equals(relay._id)){
									devRelays[i].name = relay.name
									break
								}
							}
						}

					}
				}
				//console.log(device)
				restartTask = true
			}

			if(share){
				if(share.adminIds && share.adminIds.length >= 0){
					device.share.adminIds = share.adminIds
				}

				if(share.userIds && share.userIds.length >= 0){
					device.share.userIds = share.userIds	
				}
			}

			if(cropId){
				device.cropId = cropId;
			}
			
			const isSuccess = await device.save()

			if(isSuccess && restartTask){
				//SystemTasks.setDeviceStatus(device, device.status)
			}

			isSuccess 
				? ctx.send('Status information updated successfully!', { device }) 
				: ctx.sendError('Status message update failed due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Status message update failed due to force majeure!')
		}
		

		//const showStatus = status ? 'ON' : 'OFF'
		/*let payload = `${id},${name},${color},${brightness}`

		const usagelog = { ...bulb, showStatus, master: account }

		const codition = { $and: [{ master: account }, { id: bulb.id }] }

		const usageAmount = status ? +brightness : 0
		const data = { usageTime: Date.now(), usageAmount }

		const [, isDBSuccess] = await Promise.all([
			Client.publish('device', payload),
			Electric.updateOne(codition, bulb),
			Electric.updateOne(codition, { $push: { consumption: data } }),
			new Usagelog(usagelog).save()
		])
		const usagelogs = await getUsagelog(account)

		isDBSuccess
			? ctx.send('Status information updated successfully!', { usagelogs })
			: ctx.sendError('Status message update failed due to force majeure!')*/
	},

	async delete(ctx) {
		try{
			const account = ctx.state.user.data
			const { id } = ctx.query
			const device = await Device.findById(id)

			const isSuccess = await device.remove()

			if(isSuccess){
				//disable all tasks of device
				//SystemTasks.setDeviceStatus(device, false)
			}
			isSuccess 
				? ctx.send('successfully deleted') 
				: ctx.sendError('The deletion failed due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('The deletion failed due to force majeure!')
		}
		
	},

	async rename(ctx) {
		const account = ctx.state.user.data
		const { _id, name } = ctx.request.body
		const isSuccess = await Device.updateById(_id, { name })
		/*const isSuccess = await Device.updateOne(
			{ $and: [{ ownerId: account }, { id }] },
			{ name }
		)*/
		isSuccess
			? ctx.send('Renamed successfully')
			: ctx.sendError('Rename failed due to force majeure!')
	},

	async create(ctx) {
		try{
			const account = ctx.state.user.data
			const device = ctx.request.body
			const { uid, name, model } = device
			let dev = await Device.findOne({ uid: uid })
			if(dev){
				return ctx.sendError('Device is exited!')
			}

			const deviceModel = await DeviceModel.findOne({ uid: model })
			let sensorTypes = []
			let relayTypes = []
			if(deviceModel){
				deviceModel.sensors.forEach(sensorType => {
					sensorTypes.push(sensorType)
				})
				deviceModel.relays.forEach(relayType => {
					relayTypes.push(relayType)
				})
			}


			dev = new Device({ ...device, ownerId: account })
			await dev.save()

			let sensors = []
			let relays = []

			sensorTypes.forEach(async (sensorType) => {
				//const sens = deviceModel.getSensor(sensorType)
				let sensor = new Sensor({
					deviceId: dev._id,
					name: sensorType.name,
					type: sensorType.value,
					value: 0,
					unit: sensorType.unit,
				})
				sensors.push(sensor)
				await sensor.save()
			})

			relayTypes.forEach(async (relayType) => {
				let relay = new Relay({
					deviceId: dev._id,
					name: relayType.name,
					type: relayType.value,
					state: false
				})
				relays.push(relay)
				await relay.save()
			})

			//await Sensor.insertMany(sensors)
			sensors.forEach(sensor => {
				dev.control.sensors.push(sensor)
				dev.control.sensorIds.push(sensor._id)
			})

			//await Relay.insertMany(relays)
			relays.forEach(relay => {
				dev.control.relays.push(relay)
				dev.control.relayIds.push(relay._id)
			})

			const isSuccess = await dev.save()
			if(isSuccess){
				//enable all tasks of device
				//SystemTasks.setDeviceStatus(dev, true)
			}
			isSuccess 
				? ctx.send('The device adds successfully!', { dev }) 
				: ctx.sendError('Increased failure due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Increased failure due to force majeure!')
		}


		/*const payload = `${id},${name},${type}`
		const [isSaveSuccess] = await Promise.all([
			new Device({ ...device, master: account, sensors: sensors, relays: relays }).save(),
			Client.publish('device', payload)
		])

		if (isSaveSuccess) {
			ctx.send('The device adds successfully!')
		} else {
			ctx.sendError('Increased failure due to force majeure!')
		}*/
	},

	async getOwnDevices(ctx) {
		const account = ctx.state.user.data
		const devices = await Device.find({ownerId: account})

		if (devices) {
			ctx.send('The device data is successfully obtained!', { devices })
		} else {
			ctx.sendError('Failed to obtain device data!')
		}
	},

	async getShareDevices(ctx) {
		const account = ctx.state.user.data
		const filter = {
			$or: [
				{"share.adminIds": {$in: [account]} }, 
				{"share.userIds": {$in: [account]} }
			]
		}
		const devices = await Device.find(filter)

		if (devices) {
			ctx.send('The device data is successfully obtained!', { devices })
		} else {
			ctx.sendError('Failed to obtain device data!')
		}
	},

	async get(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			const device = await Device.findById(_id)
			if(!device){
				return ctx.sendError('Invalid device id!')
			}

			/*let device = null

			if(dev.ownerId === account){
				device = dev
			}

			dev.share.adminIds.forEach(uid => {
				if(uid === account){
					device = dev
				}
			})

			dev.share.userIds.forEach(uid => {
				if(uid === account){
					device = dev
				}
			})*/

			if(device){
				const sensors = await Sensor.find({deviceId: device._id})
				const relays = await Relay.find({deviceId: device._id})

				if(sensors){
					device.control.sensors = []
					device.control.sensorIds = []
					sensors.forEach(sensor => {
						device.control.sensors.push(sensor.getShort())
						device.control.sensorIds.push(sensor._id)
					})
				}

				if(relays){
					device.control.relays = []
					device.control.relayIds = []
					relays.forEach(relay => {
						device.control.relays.push(relay.getShort())
						device.control.relayIds.push(relay._id)
					})
				}
			}

			device 
				? ctx.send('The device data is successfully obtained!', { device }) 
				: ctx.sendError('Failed to obtain device data!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to obtain device data!')
		}
		
	},

	async getByRelayId(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			const relay = await Relay.findById(_id)
			if(!relay){
				return ctx.sendError('Invalid relay id!')
			}

			const device = await Device.findById(relay.deviceId)
			if(!device){
				return ctx.sendError('Invalid device id!')
			}

			/*let device = null

			if(dev.ownerId === account){
				device = dev
			}

			dev.share.adminIds.forEach(uid => {
				if(uid === account){
					device = dev
				}
			})

			dev.share.userIds.forEach(uid => {
				if(uid === account){
					device = dev
				}
			})*/

			if(device){
				const sensors = await Sensor.find({deviceId: device._id})
				const relays = await Relay.find({deviceId: device._id})

				if(sensors){
					device.control.sensors = []
					device.control.sensorIds = []
					sensors.forEach(sensor => {
						device.control.sensors.push(sensor.getShort())
						device.control.sensorIds.push(sensor._id)
					})
				}

				if(relays){
					device.control.relays = []
					device.control.relayIds = []
					relays.forEach(relay => {
						device.control.relays.push(relay.getShort())
						device.control.relayIds.push(relay._id)
					})
				}
			}

			device 
				? ctx.send('The device data is successfully obtained!', { device }) 
				: ctx.sendError('Failed to obtain device data!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to obtain device data!')
		}
		
	},

	async getBySensorId(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.request.query
			const sensor = await Sensor.findById(_id)
			if(!sensor){
				return ctx.sendError('Invalid sensor id!')
			}

			const device = await Device.findById(sensor.deviceId)
			if(!device){
				return ctx.sendError('Invalid device id!')
			}

			/*let device = null

			if(dev.ownerId === account){
				device = dev
			}

			dev.share.adminIds.forEach(uid => {
				if(uid === account){
					device = dev
				}
			})

			dev.share.userIds.forEach(uid => {
				if(uid === account){
					device = dev
				}
			})*/

			if(device){
				const sensors = await Sensor.find({deviceId: device._id})
				const relays = await Relay.find({deviceId: device._id})

				if(sensors){
					device.control.sensors = []
					device.control.sensorIds = []
					sensors.forEach(sensor => {
						device.control.sensors.push(sensor.getShort())
						device.control.sensorIds.push(sensor._id)
					})
				}

				if(relays){
					device.control.relays = []
					device.control.relayIds = []
					relays.forEach(relay => {
						device.control.relays.push(relay.getShort())
						device.control.relayIds.push(relay._id)
					})
				}
			}

			device 
				? ctx.send('The device data is successfully obtained!', { device }) 
				: ctx.sendError('Failed to obtain device data!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to obtain device data!')
		}
		
	},

	async gets(ctx) {
		const account = ctx.state.user.data
		let { name } = ctx.request.query
		let filter = {
			$or: [
				{"ownerId": account},
				{"share.adminIds": {$in: [account]} }, 
				{"share.userIds": {$in: [account]} }
			]
		}

		if(name != undefined && name != ""){
			filter["name"] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
		}

		//filter devices from share farms
		let farms = await Farm.find({
			$or: [
				{"ownerId": account }, 
				{"share.adminIds": {$in: [account]} }, 
				{"share.userIds": {$in: [account]} }
			]
		})

		let idObjects = []
		let ids = []
		for(let i = 0; i < farms.length; i++){
			const farm = farms[i]
			farm.deviceIds.forEach(id => {
				idObjects.push(mongoose.Types.ObjectId(id))
				ids.push(id)
			})
		}

		if(idObjects.length > 0){
			filter["$or"].push({"_id": {$in: idObjects}})
		}

		let devices = await Device.find(filter)
		for(let i = 0; i < devices.length; i++){
			let device = devices[i]
			const sensors = await Sensor.find({deviceId: device._id})
			const relays = await Relay.find({deviceId: device._id})

			if(sensors){
				device.control.sensors = []
				device.control.sensorIds = []
				sensors.forEach(sensor => {
					device.control.sensors.push(sensor.getShort())
					device.control.sensorIds.push(sensor._id)
				})
			}

			if(relays){
				device.control.relays = []
				device.control.relayIds = []
				relays.forEach(relay => {
					device.control.relays.push(relay.getShort())
					device.control.relayIds.push(relay._id)
				})
			}

			//fill share users for this device
			if(device.ownerId != account && ids.indexOf(device._id.toString()) >= 0){
				for(let i = 0; i < farms.length; i++){
					const farm = farms[i]
					if(farm.deviceIds.indexOf(device._id.toString()) >= 0){
						if(farm.share.adminIds.indexOf(account) >= 0){
							device.share.adminIds.push(account)
						}

						if(farm.share.userIds.indexOf(account) >= 0){
							device.share.userIds.push(account)
						}
						break
					}
				}
			}
		}

		if (devices) {
			ctx.send('The device data is successfully obtained!', { devices })
		} else {
			ctx.sendError('Failed to obtain device data!')
		}
	},

	async count(ctx) {
		const account = ctx.state.user.data
		let { name } = ctx.request.query
		let filter = {
			$or: [
				{ownerId: account},
				{"share.adminIds": {$in: [account]} }, 
				{"share.userIds": {$in: [account]} }
			]
		}

		if(name != undefined && name != ""){
			filter["name"] = { '$regex' : '.*' + name + '.*', '$options' : 'i' }
		}

		const count = await Device.countDocuments(filter)
		ctx.send('The device data is successfully obtained!', { count })
	},

	async getDeviceByUid(ctx) {
		try{
			const account = ctx.state.user.data
			const { uid } = ctx.request.query
			const device = await Device.findOne({ uid: uid })
			if(!device){
				ctx.sendError('Failed to obtain device data!')
				return
			}

			//let device = devices[0]

			/*devices.forEach(dev => {
				if(dev.ownerId === account){
					device = dev
				}

				dev.share.adminIds.forEach(uid => {
					if(uid === account){
						device = dev
					}
				})

				dev.share.userIds.forEach(uid => {
					if(uid === account){
						device = dev
					}
				})
			})*/

			device 
				? ctx.send('The device data is successfully obtained!', { device }) 
				: ctx.sendError('Failed to obtain electrical data!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to obtain electrical data!')
		}
	},

	async parseData(payload) {
		try{
			//payload = payload.trim()
			payload = payload.replace(/(?:\r\n|\r|\n|\t|\s)/g, '')
			log.debug("parseData payload: " + payload)
			let json = JSON.parse(payload)
			
			const gwUid = json["gateway_mac_address"]
			const latitude = json["latitude"]
			const longitude = json["longitude"]
			const timezone = json["timezone"]
			const gateway = await Device.findOne({uid: gwUid.toUpperCase()})
			if(!gateway){
				log.debug("Gateway " + gwUid + " is not registered")
				return
			}
			if(gateway.location === undefined){
				gateway.location = {
					latitude: 0,
					longitude: 0,
					timezone: "Asia/Ho_Chi_Minh"
				}
			}
			if(latitude != undefined 
				&& longitude != undefined 
				&& timezone != undefined 
				&& latitude != -1 
				&& longitude != -1 
				&& gateway.location.latitude === 0 && gateway.location.longitude === 0){
				gateway.location = {
					latitude: latitude,
					longitude: longitude,
					timezone: timezone
				}
				await gateway.save()
			}
			let sensors = []
			let relays = []
			let devices = []
			const rxCmd = json["device_rx_cmd"]
			if(rxCmd != undefined){
				let datas = rxCmd.split("#");
				if(datas.length > 2){
					const uid = datas[0]
					let device = await Device.findOne({uid: uid.toUpperCase()})
					if(!device){
						log.debug("Device " + uid + " is not registered")
						return
					}
					if(device.gatewayId != gateway._id){
						device.gatewayId = gateway._id
						await device.save()
					}

					if(device.location === undefined){
						device.location = {
							latitude: 0,
							longitude: 0,
							timezone: "Asia/Ho_Chi_Minh"
						}
					}
					if(latitude != undefined 
						&& longitude != undefined 
						&& timezone != undefined 
						&& latitude != -1 
						&& longitude != -1 
						&& device.location.latitude === 0 && device.location.longitude === 0){
						device.location = {
							latitude: latitude,
							longitude: longitude,
							timezone: timezone
						}
						//await device.save()
					}

					let model = await DeviceModel.findOne({uid: device.model})
					let res = model.parseData(rxCmd)
					if(res.uid != "" && (res.sensors.length > 0 || res.relays.length > 0)){
						for(let i = 0; i < res.sensors.length; i++){
							const sens = res.sensors[i]
							const type = sens.sensor_type
							//console.log("Get sensor type=" + type)
							let sensor = device.getSensor(type)
							if(sensor){
								sensor.value = sens.sensor_value
								sensors.push(sensor)
							}
						}
						for(let i = 0; i < res.relays.length; i++){
							const rel = res.relays[i]
							const type = rel.controller_type
							//console.log("Get relay type=" + type)
							let relay = device.getRelay(type)
							if(relay){
								relay.state = rel.controller_is_on
								relays.push(relay)
							}
						}
					}
					await device.save()
					devices.push(device)
				}
			}
			else{
				const deviceDatas = json["devices"]
				if(deviceDatas == undefined || deviceDatas.length == 0){
					return
				}
				
				for(let i = 0;i < deviceDatas.length; i++){
					const devData = deviceDatas[i]
					const uid = devData["device_mac_address"]
					const devState = devData["device_state"] //0 is online, 1 is offline
					if(devState == 1){
						continue
					}
					let device = await Device.findOne({uid: uid.toUpperCase()})
					if(!device){
						log.debug("Device " + uid + " is not registered")
						continue
					}
					if(device.gatewayId != gateway._id){
						device.gatewayId = gateway._id
						await device.save()
					}

					if(device.location === undefined){
						device.location = {
							latitude: 0,
							longitude: 0,
							timezone: "Asia/Ho_Chi_Minh"
						}
					}
					if(latitude != undefined 
						&& longitude != undefined 
						&& timezone != undefined 
						&& latitude != -1 
						&& longitude != -1 
						&& device.location.latitude === 0 && device.location.longitude === 0){
						device.location = {
							latitude: latitude,
							longitude: longitude,
							timezone: timezone
						}
						//await device.save()
					}
					
					const datas = devData["data"]
					for(let j = 0; j < datas.length; j++){
						const data = datas[j]
						if(data["controller_type"] != undefined){
							const type = data["controller_type"]
							//console.log("Get relay type=" + type)
							let relay = device.getRelay(type)
							if(relay){
								relay.state = data["controller_is_on"]
								relays.push(relay)
							}
						}
						else if(data["sensor_type"] != undefined){
							const type = data["sensor_type"]
							//console.log("Get sensor type=" + type)
							let sensor = device.getSensor(type)
							if(sensor){
								sensor.value = data["sensor_value"]
								sensors.push(sensor)
							}
						}
					}
					await device.save()
					devices.push(device)
				}
			}

			//console.log(sensors)
			//console.log(relays)

			let newSensors = []
			for(let i = 0; i < sensors.length; i++){
				let sensor = sensors[i]
				let oldSensor = await Sensor.findById(sensor._id)
				if(oldSensor){
					oldSensor.value = sensor.value
					await oldSensor.save()
					newSensors.push(oldSensor)

					let sensorSeries = new SensorSeries({
						sensorId: sensor._id,
						type: 'utm',
						value: sensor.value,
						unit: sensor.unit,
					})

					await sensorSeries.save()
				}
			}
			//await Sensor.insertMany(newSensors)

			let newRelays = []
			for(let i = 0; i < relays.length; i++){
				let relay = relays[i]
				let oldRelay = await Relay.findById(relay._id)
				if(oldRelay){
					oldRelay.state = relay.state
					await oldRelay.save()
					newRelays.push(oldRelay)

					let relaySeries = await RelaySeries.findOne({
						relayId: relay._id
					}).sort({'meta.updatedAt': -1})

					if(relaySeries == undefined){
						relaySeries = new RelaySeries({
							relayId: relay._id,
							type: 'utm',
							state: oldRelay.state,
							duration: 0,
						})
					}
					else if(relaySeries.state != oldRelay.state){
						let nowTS = (new Date()).getTime()
						let duration = nowTS - relaySeries.meta.createdAt
						duration = duration/1000
						relaySeries.duration = duration
						await relaySeries.save()

						relaySeries = new RelaySeries({
							relayId: relay._id,
							type: 'utm',
							state: oldRelay.state,
							duration: 0,
						})
					}
					else{
						let nowTS = (new Date()).getTime()
						let duration = nowTS - relaySeries.meta.createdAt
						duration = duration/1000
						relaySeries.duration = duration
					}
					await relaySeries.save()
				}
			}
			
			//trigger control by scripts
			let sensorIds = []
			sensors.forEach(s => {
				sensorIds.push(s._id)
			})
			let filter = {sensorId: {$in: sensorIds}, status: true}
			log.debug(filter);
			let scripts = await IFTTT.find(filter)
			for(let i = 0; i < scripts.length; i++){
				const script = scripts[i]
				//console.log(script)
				let sensor = null;
				for(let j = 0; j < sensors.length; j++){
					if(sensors[j]._id == script.sensorId){
						sensor = sensors[j];
						break;
					}
					}

				if(sensor != null){
				const condition = script.condition
					let exp = condition.value + ' ' + condition.expression + ' ' + sensor.value
				const relay = await Relay.findById(script.relayId)
				const action = script.action
					log.debug("=====================================");
					log.debug(exp);
					log.debug("=====================================");
				if(eval(exp)){
					//trigger action in seconds
					await ScheduleTimer.setRelayState(script.relayId, action.isOn, action.duration*60)
				}
				else{
					//trigger action
					//trigger action in seconds
					await ScheduleTimer.setRelayState(script.relayId, !action.isOn)
				}
			}
		}
		}
		catch(e){
			log.error(e)
			//return ctx.sendError('Failed to process data!')
		}
	},

	async createTimeline(ctx) {
		try{
			let account = null;
			if(ctx.state.user){
				account = ctx.state.user.data
			}
			const story = ctx.request.body
			const { uid, subject, content, medias, tags, date } = story

			let device = await Device.findOne({uid: uid.toUpperCase()})
			if(!device){
				return ctx.sendError('Device is not existed!')
			}

			if(!device.status){
				return ctx.sendError('Device is not available!')
			}

			if(subject === undefined){
				subject = ""
			}

			if(content === undefined){
				content = ""
			}

			if(medias === undefined){
				medias = []
			}

			if(tags === undefined){
				tags = []
			}

			if(date === undefined){
				date = (new Date()).getTime()
			}
			let owner = {};
			if(account){
				owner = await User.findOne({ email: account })
				owner = owner.getShort();
			}
			else{
				account = "Robot";
			}

			let params = {
				deviceId: device._id,
				ownerId: account,
				owner: owner,
				subject, content, medias, tags, date
			}

			let timeline = new DeviceTimeline({ ...params })
			let updateDevice = false;
			timeline.tags.forEach(tag => {
				if(device.tags.indexOf(tag) < 0){
					device.tags.push(tag);
					updateDevice = true;
				}
			})

			if(updateDevice){
				await device.save();
			}

			const isSuccess = await timeline.save()
			if(isSuccess && device.cropId !== ""){
				//push crop timeline
				let crop = await Crop.findById(device.cropId)
				if(crop){
					params = { cropId: device.cropId, ownerId: account, owner: owner, subject, content, medias, tags, date }
					let cropTimeline = new CropTimeline({ ...params })
					let updateCrop = false;
					cropTimeline.tags.forEach(tag => {
						if(crop.tags.indexOf(tag) < 0){
							crop.tags.push(tag);
							updateCrop = true;
						}
					})

					if(updateCrop){
						await crop.save();
					}

					await cropTimeline.save()
				}
			}
			isSuccess 
					? ctx.send('The device timeline adds successfully!', { timeline }) 
					: ctx.sendError('Failed to create device timeline data!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to create device timeline data!')
		}
	},

	async getTimeline(ctx) {
		const account = ctx.state.user.data
		const { _id } = ctx.request.query
		const timeline = await DeviceTimeline.findById(_id)
		if (timeline) {
			ctx.send('The device timeline data is successfully obtained!', { timeline })
		} else {
			ctx.sendError('Failed to obtain crop timeline data!')
		}
	},

	async updateTimeline(ctx) {
		try{
			const account = ctx.state.user.data
			const {_id, subject, content, medias, date, status } = ctx.request.body

			const timeline = await DeviceTimeline.findById(_id)
			if(!timeline){
				return ctx.sendError('Device timeline is not exited!')
			}

			if(subject){
				timeline.subject = subject
			}

			if(content){
				timeline.content = content
			}

			if(status != undefined){
				timeline.status = status
			}

			if(medias){
				timeline.medias = medias
			}

			if(tags){
				timeline.tags = tags
			}

			if(date){
				timeline.date = date
			}

			const isSuccess = await timeline.save()

			isSuccess 
					? ctx.send('Status information updated successfully!', { timeline }) 
					: ctx.sendError('Update failed due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('Update failed due to force majeure!')
		}
	},

	async deleteTimeline(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id } = ctx.query
			const isSuccess = await DeviceTimeline.findByIdAndDelete(_id)
			isSuccess 
				? ctx.send('successfully deleted') 
				: ctx.sendError('The deletion failed due to force majeure!')
		}
		catch(e){
			log.error(e)
			ctx.sendError('The deletion failed due to force majeure!')
		}
	},

	async getTimelines(ctx) {
		try{
			const account = ctx.state.user.data
			let { _id, name, startTime, endTime } = ctx.request.body

			const device = await Device.findById(_id);
			if(!device){
				return ctx.sendError('Device is not exited!')
			}

			let filter = {
				deviceId: _id
			}
			
			if(name !== undefined && name != ""){
				filter["$or"] = [
					{"content": { "$regex" : ".*" + name + ".*", "$options" : "i" }},
					{"subject": { "$regex" : ".*" + name + ".*", "$options" : "i" }},
					{"tags": { $in: [name] }}
				]
				// filter["content"] = { "$regex" : ".*" + name + ".*", "$options" : "i" }
			}

			if(startTime != undefined && endTime != undefined){
				filter["date"] = {"$gte": startTime, "$lte": endTime}
			}

			log.debug(filter)

			const timelines = await DeviceTimeline.find(filter).sort({ date: -1 })
			if (timelines) {
				ctx.send("The device timelines data is successfully obtained!", { timelines })
			} else {
				ctx.sendError("Failed to obtain device timelines data!")
			}
		}
		catch(e){
			log.error(e)
			ctx.sendError("Failed to obtain device data!")
		}
	},

	async exportTimeline(ctx) {
		try{
			const account = ctx.state.user.data
			const { _id, startTime, endTime } = ctx.request.body
			const device = await Device.findById(_id);
			if(!device){
				return ctx.sendError('Device is not exited!')
			}
			try{
				const buffer = await exportDeviceTimelines(_id, startTime, endTime);
				ctx.send('The export data is successfully obtained!', { data: buffer })
			}catch(e){
				log.error(e)
				ctx.sendError('Failed to export timeline data!')	
			}
		}
		catch(e){
			log.error(e)
			ctx.sendError('Failed to export timeline data!')
		}
	}
}

module.exports = DeviceApi
