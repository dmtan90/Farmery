import Regular from '@/utils/regular'
import i18n from '@/lang/i18n'
const eventType = 'blur'
export const checkAccount = [
	{
		validator: (rule, value, callback) => {
			if (!value) {
				return callback(new Error(i18n.t('utils.form.emailHintError')))
			}
			if (!Regular('mobile', value) && !Regular('email', value)) {
				return callback(new Error(i18n.t('utils.form.emailInvalidHintError')))
			}
			callback()
		},
		trigger: eventType
	}
]
export const checkPassword = [
	{
		validator: (rule, value, callback) => {
			if (!value) {
				return callback(new Error(i18n.t('utils.form.passwordHintError')))
			}
			if (!Regular('password', value)) {
				return callback(new Error(i18n.t('utils.form.passwordInvalidHintError')))
			}
			callback()
		},
		trigger: eventType
	}
]
export const checkName = (name = 'username') => [
	{
		validator: (rule, value, callback) => {
			if (!value && name !== 'username') {
				return callback(new Error(i18n.t('utils.form.pleaseEnterHint') + ' ' + name))
			}
			if (!value && name === 'username') {
				return callback()
			}
			if (value.length > 64) {
				return callback(new Error(name + i18n.t('utils.form.nameOver64Chars')))
			}
			if (value.length < 2) {
				return callback(new Error(name + i18n.t('utils.form.nameLower2Chars')))
			}
			if (!Regular('name', value)) {
				return callback(new Error(name + i18n.t('utils.form.nameInvalidHintError')))
			}
			callback()
		},
		trigger: eventType
	}
]
export const checkAddress = [
	{
		validator: (rule, value, callback) => {
			if (!value.length ) {
				return callback(new Error(i18n.t('utils.form.regionHintError')))
			}
			callback()
		},
		trigger: eventType
	}
]
export const checkCaptcha = [
	{
		validator: (rule, value, callback) => {
			if (!value) {
				return callback(new Error(i18n.t('utils.form.captchaHintError')))
			}
			if (typeof value !== 'number') {
				return callback(new Error(i18n.t('utils.form.captcharNumberHintError')))
			}
			if (value <= 0 || value > 20) {
				return callback(new Error(i18n.t('utils.form.captcharInvalidHintError')))
			}
			callback()
		},
		trigger: eventType
	}
]
