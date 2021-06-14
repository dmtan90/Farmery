const Regular = (function() {
	const rules = {
		email(str) {
			return (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/).test(str)
		},
		mobile(str) {
			return (/^1[3|4|5|7|8][0-9]{9}$/).test(str)
		},
		tel(str) {
			return (/^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/).test(str)
		},
		number(str) {
			return (/^[0-9]$/).test(str)
		},
		english(str) {
			return (/^[a-zA-Z]+$/).test(str)
		},
		text(str) {
			return (/^\w+$/).test(str)
		},
		chinese(str) {
			return (/^[\u4E00-\u9FA5]+$/).test(str)
		},
		lower(str) {
			return (/^[a-z]+$/).test(str)
		},
		upper(str) {
			return (/^[A-Z]+$/).test(str)
		},
		password(str) {
			return (/^[a-zA-Z0-9.!@#$%^&*()_+/*<>?{}:"|~]{6,12}$/).test(str)
		}
	}
	//Exposed interface
	return function(str, type) {
		//If the type is a function, expand the rules, otherwise it will validate the data
		if (type.constructor === Function) {
			rules[str] = type
		} else {
			return rules[type] ? rules[type](str) : false
		}
	}
}())

module.exports = Regular
