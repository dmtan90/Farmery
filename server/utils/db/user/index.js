const fs = require('fs')
const bcrypt = require('bcryptjs')
const config = require('config/file')
const { SALT_WORK_FACTOR } = require('config/auth')

module.exports = {
	async writeImg(user) {
		if (!user.avatar) { return config.avatar.user }
		const imgData = user.avatar.split(',')
		const imgEtx = imgData[0].match(/:(.*?);/)[1].split('/')[1]
		const img = `/avatar.${imgEtx}`
		const folderPath = config.avatar.path.user + user.email
		const filePath = folderPath + img

		await (!fs.existsSync(folderPath) && fs.mkdirSync(folderPath))

		await fs.writeFileSync(filePath, Buffer.from(imgData[1],'base64'))

		return config.avatar.url.user + user.email + img
	},
	async bcryptPass (user) {
		const salt = await bcrypt.genSaltSync(Number.parseInt(SALT_WORK_FACTOR))
		return bcrypt.hashSync(user.password, salt)
	}
}
