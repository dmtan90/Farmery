const moment = require('moment')
const config = require('config/notice')
const Notice = require('model/Notice')

module.exports = {
	async getNotice(account,condition = { $or: [{ 'receiver.account': account }, { 'sender.account': account }] }){
		const notice = await Notice.find(condition).sort({createdAt:-1})

		if (!notice || !notice.length) { return }

		moment.locale('vi-vn')

		return notice.reduce((result, e) => {

			let type = 'receive', el = 'sender'
			if (e.sender.account === account) {
				type = 'send'
				el = 'receiver'
			}

			[].push.call(result[e.type][type],{
				[el]: { name: e[el].name, account: e[el].account },
				message: e.system ? e.sysMessage[el] : e.message,
				date: moment(e.createdAt).fromNow(),
				status: e.system ? 'System information' : e.status,
				id: e.id,
				families:e.families
			})
			return result

		},config.type.reduce((result,e) => {
			result[e] = { receive: [], send: [] }
			return result
		}, {}))
	}
}
