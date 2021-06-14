const fs = require('fs')
const config = require('config/file')

module.exports = {
	async writeImg({avatar, name}) {
		if (!avatar) { return config.avatar.family }
		const imgData = avatar.split(',')
		const imgEtx = imgData[0].match(/:(.*?);/)[1].split('/')[1]
		const imgName = (new Date()).getTime()
		const img = `/${imgName}.${imgEtx}`
		const folderPath = config.avatar.path.family + name.trim(' ')
		const filePath = folderPath + img

		await (!fs.existsSync(folderPath) && fs.mkdirSync(folderPath))

		await fs.writeFileSync(filePath, Buffer.from(imgData[1],'base64'))

		return config.avatar.url.family + name.trim(' ') + img
	},
	async path2Image(path, ext) {
		let buffer = null;
		try{
			const paths = path.split('/');
			const img = paths[paths.length - 1];
			const imgs = img.split('.');
			const imgEtx = imgs[1];
			const imgName = imgs[0];
			ext = imgEtx;
			const folderName =  paths[paths.length - 2];
			const folderPath = config.avatar.path.family + folderName.trim(' ')
			const filePath = folderPath + '/' + img
			buffer = await fs.readFileSync(filePath);
		}catch(e){
			console.log(e)
		}
		return buffer;
	}
}
