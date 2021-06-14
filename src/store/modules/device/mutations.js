export default{
	setPinTopDevice(state, uid) {
		state.pinTopDevice = uid
		localStorage.setItem('pinTopDevice', uid)
	}
}
