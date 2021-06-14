const Notice = require('model/Notice')
const Farm = require('model/Farm')
const User = require('model/User')

const NoticeApi = {
	async refuse(ctx) {
		const { receiver, sender, id } = ctx.request.body

		const noticeInfo = {
			sender,
			receiver,
			type: 'farm',
			system: true,
			sysMessage: {
				sender: `${sender.name} Has declined your invitation`,
				receiver: `You have declined ${receiver.name} invitation`
			},
			id: Date.now().toString()
		}

		const [isSaveSuccess] = await Promise.all([
			new Notice(noticeInfo).save(),
			Notice.updateOne({ id }, { status: 'rejected' })
		])

		isSaveSuccess
			? ctx.send('Successfully rejected!')
			: ctx.sendError('Refused to fail due to irresistible factors!')
	},
	async agree(ctx) {
		const { receiver, sender, id,families } = ctx.request.body
		const showFamilies = families.map(e=>e.displayName).join('、')

		const noticeInfo = {
			sender,
			receiver,
			type: 'farm',
			system: true,
			sysMessage: {
				sender: `${sender.name} Has agreed to your invitation`,
				receiver: `You have agreed group invitation from ${receiver.name}, joined ${showFamilies} group`
			},
			id: Date.now().toString()
		}

		const [isSaveSuccess] = await Promise.all([
			new Notice(noticeInfo).save(),
			Notice.updateOne({ id }, { status: 'joined' })
		])
		const syncFuncs = []
		families.forEach(family => {
			syncFuncs.push(Family.updateOne({ name:family.name }, { $push: { users: sender } }))
			syncFuncs.push(User.updateOne({ email:sender.account }, { $push: { families: family } }))
		})
		await Promise.all(syncFuncs)

		isSaveSuccess
			? ctx.send('Successfully joined!')
			: ctx.sendError('Failed to join due to irresistible factors!')
	}
}

module.exports = NoticeApi
