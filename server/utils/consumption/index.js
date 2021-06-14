const { Power } = require('config/bulb')
module.exports = {
	filterConsumption(consumption) {
		let usageAmount = 0
		let usageTime = 0

		const { length } = consumption

		consumption[length] = {
			usageTime: Date.now()
		}

		for (let i = 0; i < length; ++i) {
			if (!consumption[i].usageAmount) {
				continue
			}
			const currtime = Math.floor(consumption[i].usageTime / 1000)
			const nextTime = Math.floor(consumption[i + 1].usageTime / 1000)

			const useHour = (nextTime - currtime) / 3600
			const usePower = consumption[i].usageAmount / 100

			usageTime += useHour
			usageAmount += Power * usePower * useHour
		}
		usageTime = usageTime.toFixed(1)
		usageAmount = usageAmount.toFixed(2)
		return {
			usageTime,
			usageAmount
		}
	}
}

/**
 * 100
 * 0
 * 40
 * 20
 * 0
 * 100
 * 20
 * 50
 * 0
 */
