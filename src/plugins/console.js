export default function() {
	if (window.console && window.console.log) {
		console.log(
			'\n %c Smart Farm %c https://agrhub.com \n',
			'color:#FFFFFB;background:#ffa628;padding:5px 0;border-radius:.5rem 0 0 .5rem;',
			'background: #efefef;padding:5px 0 5px;border-radius:0 .5rem .5rem 0;'
		)
		console.log(
			`%c Page load consumed ${(
				Math.round(performance.now() * 100) /
				100 /
				1000
			).toFixed(2)}s`,
			'background: #fff;color: #333;text-shadow: 0 0 2px #eee, 0 0 3px #eee, 0 0 3px #eee, 0 0 2px #eee, 0 0 3px #eee;'
		)
		if (!localStorage.getItem('access')) {
			localStorage.setItem('access', new Date().getTime())
		}
		let _access = new Date(parseInt(localStorage.getItem('access')))
		let access = `${_access.getFullYear()} Year ${_access.getMonth() +
			1} Month ${_access.getDate()} Date`
		let re = /x/
		let i = 0
		if (!localStorage.getItem('hit')) {
			localStorage.setItem('hit', 0)
		} else {
			i = parseInt(localStorage.getItem('hit'))
		}
		re.toString = function() {
			localStorage.setItem('hit', ++i)
			return `This is the ${i} times you have opened the console on this site since ${access}, what secret do you want to know`
		}
		console.log(re)
	}
}
