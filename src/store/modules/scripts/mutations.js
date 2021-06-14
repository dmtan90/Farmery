export default {
	setScripts(state, scripts) {
		state.scripts = scripts
	},
	deleteScript(state, index) {
		state.scripts.splice(index,1)
	},
	disabledScript(state, index) {
		state.scripts[index].disabled = !state.scripts[index].disabled
	},
	addScript(state, script) {
		state.scripts.push(script)
	}
}
