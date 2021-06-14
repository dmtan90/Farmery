import { Message } from 'element-ui'
const config = {
	center: true,
	dangerouslyUseHTMLString: true,
	customClass: 'custom-tip',
	showClose: true
}

export default ['info', 'success', 'warning', 'error'].reduce((tip, type) => {
	tip[type] = (msg, duration = 1500) => {
		return Promise.resolve(Message({
			message: msg,
			type: type,
			duration: duration,
			...config
		}))
	}
	return tip
}, {})
