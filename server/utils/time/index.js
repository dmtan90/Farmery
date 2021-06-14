const moment = require('moment')

module.exports = {
	getYesterday() {
		moment.locale('vi-vn')
		return moment().subtract(1, 'days').format('YYYY-MM-DD')
	}
}
