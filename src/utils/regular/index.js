const Regular = (function() {
	const rules = {
		email(str) {
			return (/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/).test(str)
		},
		mobile(str) {
			return (/^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/).test(str)
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
		},
		name(str) {
			// console.log(str)
			return (str.length >= 3 && str.length <= 32)
			// return (/^([a-zA-Z0-9 \u0000-\u007F]+){3,32}$/).test(str)
			// return (/^\pL+[\pL\pZ\pP]{2,32}$/).test(str)
		},
		qq(str) {
			return (/^[1-9][0-9]{4,10}$/).test(str)
		},
		wechat(str) {
			return (/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/).test(str)
		}

	}
	//Interface
	return function(type,str) {
		//If the type is a function, expand the rules, otherwise it will validate the data
		if (type.constructor === Function) {
			rules[str] = type
		} else {
			return rules[type] ? rules[type](str) : false
		}
	}
}())

export default Regular
