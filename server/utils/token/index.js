const fs = require('fs')
const jwt = require('jsonwebtoken')
const { privateKey } = require('config/key')
module.exports = {
	async generate(data) {
		const created = Math.floor(Date.now() / 1000)
		const exp = created + 3600 * 24 * 30

		const cert = fs.readFileSync(privateKey)
		const token = await jwt.sign({ data, exp }, cert, { algorithm: 'RS256' })
		return token
	}
}
