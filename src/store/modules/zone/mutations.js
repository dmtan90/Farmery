export default{
	setZones(state, zones) {
		state.zones = zones
	},
	deleteDeviceById(state, id) {
		state.devices.forEach((e, i) => {
			if (e.id === id) {
				state.devices.splice(i,1)
			}
		})
	},
	renameDeviceById(state, device) {
		state.devices.forEach(e => {
			if (e.id === device.id) {
				e.name = device.name
			}
		})
	},
	addDevice(state, device) {
		state.device.push(device)
	}
}
