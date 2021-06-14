export default{
	bind(el, binding, vNode) {

		// Ensure that the expression provided is a function
		if (typeof binding.value !== 'function') {
			// Get component name
			const compName = vNode.context.name
			// Pass warning to console
			let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be `
			if (compName) { warn += `Found in component '${compName}' ` }

			return console.warn(warn)
		}

		// Define variables
		let pressTimer = null

		// Define function handler
		// Create a timer (execute function after 1 second)
		let start = (e) => {

			if (e.type === 'click' && e.button !== 0) {
				return
			}

			if (pressTimer === null) {
				pressTimer = setTimeout(() => {
					// Execution function
					handler()
				}, 1000)
			}
		}

		// Cancel timer
		let cancel = (e) => {

			// Check if the timer has a value
			if (pressTimer !== null) {
				clearTimeout(pressTimer)
				pressTimer = null
			}
		}

		// Run function
		const handler = (e) => {
			// Execute the method passed to the instruction
			binding.value(e)
		}

		// Add event listener
		el.addEventListener('mousedown', start)
		el.addEventListener('touchstart', start)

		// Cancel timer
		el.addEventListener('click', cancel)
		el.addEventListener('mouseout', cancel)
		el.addEventListener('touchend', cancel)
		el.addEventListener('touchcancel', cancel)
	}
}
