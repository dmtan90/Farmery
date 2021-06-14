const Feedback = require('model/Feedback')

const FeedbackApi = {
	async addFeedback(ctx) {
		const account = ctx.state.user.data
		const feedback = ctx.request.body
		feedback.account = account

    	await new Feedback(feedback).save()

		ctx.send('Feedback is successful!')
	}
}

module.exports = FeedbackApi
