module.exports = (ctx, msg, commonInfo) => {
	const getClientIp = () => {
		let ip = ctx.request.headers['x-forwarded-for']
		if(ctx.request.connection && ctx.request.connection.remoteAddress){
			ip = ctx.request.connection.remoteAddress
		}
		else if(ctx.request.socket.remoteAddress){
			ip = ctx.request.socket.remoteAddress
		}
		else if(ctx.request.connection.socket && ctx.request.connection.socket.remoteAddress){
			ip = ctx.request.connection.socket.remoteAddress
		}
		return ip
	}
	const {
		method, // request method get post or other
		url, // request link
		host, // The host of the client that sent the request
		headers // headers in the request
	} = ctx.request
	const client = {
		method,
		url,
		host,
		msg,
		ip: getClientIp(),
		referer: headers['referer'], // Source address of the request
		userAgent: headers['user-agent'] // Client information Device and browser information
	}
	return JSON.stringify(Object.assign(commonInfo, client))
}
