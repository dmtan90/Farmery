const Org = require('controller/organization')
const User = require('controller/user')
const Farm = require('controller/farm')
const Zone = require('controller/zone')
const Crop = require('controller/crop')
const Plant = require('controller/plant')
const Device = require('controller/device')
const DeviceModel = require('controller/devicemodel')
const Sensor = require('controller/sensor')
const Relay = require('controller/relay')
const IFTTT = require('controller/ifttt')

const Notice = require('controller/notice')

const org = require('koa-router')()
const auth = require('koa-router')()
const farm = require('koa-router')()
const zone = require('koa-router')()
const crop = require('koa-router')()
const plant = require('koa-router')()
const device = require('koa-router')()
const model = require('koa-router')()
const sensor = require('koa-router')()
const relay = require('koa-router')()
const ifttt = require('koa-router')()

const notice = require('koa-router')()
const forecast = require('koa-router')()

auth
	.get('/userInfo', User.getUserInfo)
	.post('/userInfo', User.updateUserInfo)
	.delete('/news/:type', User.newsToZero)
	.get('/user/search', User.search)

notice.post('/farm', Notice.refuse).put('/farm', Notice.agree)

org
	.get('/get', Org.get)
	.get('/gets', Org.gets)
	.get('/count', Org.count)
	.get('/countUser', Org.countUser)
	.get('/getOwnOrgs', Org.getOwnOrgs)
	.get('/getShareOrgs', Org.getShareOrgs)
	.get('/getShareAdminOrgs', Org.getShareAdminOrgs)
	.get('/getShareUserOrgs', Org.getShareUserOrgs)
	.get('/search', Org.search)
	.put('/create', Org.create)
	.post('/update', Org.update)
	.get('/exist', Org.hasExisted)
	.put('/registerMember', Org.registerMember)

farm
	.get('/get', Farm.get)
	.get('/gets', Farm.gets)
	.get('/count', Farm.count)
	.get('/getOwnFarms', Farm.getOwnFarms)
	.get('/getShareFarms', Farm.getShareFarms)
	.get('/getShareAdminFarms', Farm.getShareAdminFarms)
	.get('/getShareUserFarms', Farm.getShareUserFarms)
	.get('/search', Farm.search)
	.put('/create', Farm.create)
	.post('/update', Farm.update)
	.get('/exist', Farm.hasExisted)
	.put('/member', Farm.join)
	.get('/member', Farm.getMember)
	.post('/invite', Farm.invite)

zone
	.get('/get', Zone.get)
	.get('/gets', Zone.gets)
	.get('/count', Zone.count)
	.put('/create', Zone.create)
	.post('/update', Zone.update)
	.post('/rename', Zone.rename)
	.delete('/delete', Zone.delete)
	.get('/getZoneByFarm', Zone.getZoneByFarm)
	.get('/getTypes', Zone.getTypes)
	.get('/getUnits', Zone.getUnits)
	.get('/getCultivations', Zone.getCultivations)

crop
	.get('/get', Crop.get)
	.post('/gets', Crop.gets)
	.get('/count', Crop.count)
	.put('/create', Crop.create)
	.post('/update', Crop.update)
	.delete('/delete', Crop.delete)
	.get('/getCropByFarm', Crop.getCropByFarm)
	.get('/getUnits', Crop.getUnits)
	.get('/getTimeline', Crop.getTimeline)
	.post('/getTimelines', Crop.getTimelines)
	.put('/createTimeline', Crop.createTimeline)
	.post('/updateTimeline', Crop.updateTimeline)
	.delete('/deleteTimeline', Crop.deleteTimeline)
	.post('/exportTimeline', Crop.exportTimeline)

plant
	.get('/get', Plant.get)
	.get('/gets', Plant.gets)
	.get('/count', Plant.count)
	.put('/create', Plant.create)
	.post('/update', Plant.update)
	.delete('/delete', Plant.delete)

device
	.get('/get', Device.get)
	.get('/gets', Device.gets)
	.get('/count', Device.count)
	.put('/create', Device.create)
	.post('/update', Device.update)
	.delete('/delete', Device.delete)
	.get('/exist', Device.hasExisted)
	.get('/getByRelayId', Device.getByRelayId)
	.get('/getBySensorId', Device.getBySensorId)
	.get('/getTimeline', Device.getTimeline)
	.post('/getTimelines', Device.getTimelines)
	.put('/createTimeline', Device.createTimeline)
	.post('/updateTimeline', Device.updateTimeline)
	.delete('/deleteTimeline', Device.deleteTimeline)
	.post('/exportTimeline', Device.exportTimeline)

sensor
	.get('/timeseries', Sensor.getSeries)
	.post('/timeseries', Sensor.exportSeries)
	.put('/setThreshold', Sensor.setThreshold)
	.post('/updateThreshold', Sensor.updateThreshold)
	.delete('/deleteThreshold', Sensor.deleteThreshold)
	.get('/getThreshold', Sensor.getThreshold)
	.get('/getThresholds', Sensor.getThresholds)
	.get('/getThresholdsByDeviceId', Sensor.getThresholdsByDeviceId)

relay
	.get('/timeseries', Relay.getSeries)
	.post('/setState', Relay.setState)
	.put('/setTimer', Relay.setTimer)
	.post('/updateTimer', Relay.updateTimer)
	.delete('/deleteTimer', Relay.deleteTimer)
	.get('/getTimer', Relay.getTimer)
	.get('/getTimers', Relay.getTimers)
	.get('/getTimersByDeviceId', Relay.getTimersByDeviceId)

model
	.get('/get', DeviceModel.get)
	.get('/gets', DeviceModel.gets)
	.get('/count', DeviceModel.count)
	.get('/getSensorType', DeviceModel.getSensorType)
	.get('/getRelayType', DeviceModel.getRelayType)
	.put('/create', DeviceModel.create)
	.post('/update', DeviceModel.update)
	.delete('/delete', DeviceModel.delete)

ifttt
	.get('/get', IFTTT.get)
	.get('/gets', IFTTT.gets)
	.put('/create', IFTTT.create)
	.post('/update', IFTTT.update)
	.delete('/delete', IFTTT.delete)

auth.use('/org', org.routes()).use(org.allowedMethods())
auth.use('/farm', farm.routes()).use(farm.allowedMethods())
auth.use('/zone', zone.routes()).use(zone.allowedMethods())
auth.use('/crop', crop.routes()).use(crop.allowedMethods())
auth.use('/plant', plant.routes()).use(plant.allowedMethods())
auth.use('/device', device.routes()).use(device.allowedMethods())
auth.use('/sensor', sensor.routes()).use(sensor.allowedMethods())
auth.use('/relay', relay.routes()).use(relay.allowedMethods())
auth.use('/devicemodel', model.routes()).use(model.allowedMethods())
auth.use('/ifttt', ifttt.routes()).use(ifttt.allowedMethods())
auth.use('/notice', notice.routes()).use(notice.allowedMethods())

module.exports = auth
