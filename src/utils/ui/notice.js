import { Notification } from 'element-ui'
const config = {
	dangerouslyUseHTMLString: true,
	customClass: 'custom-notice',
	showClose: true
}
export default ['info', 'success', 'warning', 'error'].reduce((notice, type) => {
	notice[type] = (message, title = 'Error', duration = 3000, position = 'top-right', offset = 0) => {
		return Promise.resolve(Notification({
			message,
			title,
			type,
			position,
			offset,
			duration,
			...config
		}))
	}
	return notice
}, {})
