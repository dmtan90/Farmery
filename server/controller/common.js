const svgCaptcha = require('svg-captcha')

const CommonApi = {
	async getCaptcha(ctx) {
		const captcha = await svgCaptcha.createMathExpr({
			noise: 2,
			fontSize: 35,
			height: 40,
			width: 80
		})
		ctx.session.captcha = captcha.text
		ctx.body = {success:true,captcha:captcha.data}
	}
}

module.exports = CommonApi
