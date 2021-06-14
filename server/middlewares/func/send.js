module.exports = () => {
	let render = (ctx, isSuccess) => (msg = 'success', data = {}) => {
		ctx.set('Content-Type', 'application/json')
		ctx.body = JSON.stringify({
			success: isSuccess,
			...data,
			message: msg
		})
	}
	return async (ctx, next) => {
		ctx.send = render(ctx, true)
		ctx.sendError = render(ctx, false)
		await next()
	}
}
