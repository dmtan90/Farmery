require('module-alias/register')

const { AppID, APIKey } = require('config/audio')
const fs = require('fs')
const http = require('http')
const crypto = require('crypto')
const hash = crypto.createHash('md5')

module.exports = async fileBase64 => {
	const curTime = Date.parse(new Date()) / 1000

	const xParam = { auf: '16k', aue: 'raw', scene: 'main' }

	const xParamBase64 = Buffer.from(JSON.stringify(xParam)).toString('base64')

	const bodyData = `data=${fileBase64}`

	const token = APIKey + curTime + xParamBase64 + bodyData
	hash.update(token)

	const xCheckSum = hash.digest('hex')

	const options = {
		hostname: 'api.xfyun.cn',
		port: 80,
		path: '/v1/service/v1/iat',
		method: 'POST',
		headers: {
			'X-Appid': AppID,
			'X-CurTime': curTime,
			'X-Param': xParamBase64,
			'X-CheckSum': xCheckSum,
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	}

	return new Promise((resolve,reject)=>{
		const req = http.request(options, function (res) {
			res.setEncoding('utf-8')
			res.on('data', result => resolve(result))
		})
		req.on('error', error => reject(error))
		req.write(bodyData)
		req.end()
	})

}
