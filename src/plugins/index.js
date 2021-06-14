module.exports = require('fs').readdirSync(__dirname).reduce((obj, file) => {
	return file === 'index.js' ? obj : obj[file.split('.')[0]] = require(file)
}, {})
