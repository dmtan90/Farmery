const path = require('path')
const User = require('controller/user')
const Device = require('controller/device')
const Common = require('controller/common')

const api = require('koa-router')()

api
	.get('/captcha', Common.getCaptcha)
	.get('/exist', User.hasExisted)
	.post('/login', User.login)
	.post('/registry', User.registry)
	.put('/createTimeline', Device.createTimeline)
module.exports = api
