export default {
	filterWeek(time) {
		if (!time) {
			return
		}
		let endTime
		switch (time) {
			case 'Every Monday':
				endTime = 1
				break
			case 'Every Tuesday':
				endTime = 2
				break
			case 'Every Wednesday':
				endTime = 3
				break
			case 'Every Thursday':
				endTime = 4
				break
			case 'Every Friday':
				endTime = 5
				break
			case 'Every Saturday':
				endTime = 6
				break
			case 'Every Sunday':
				endTime = 7
				break
		}
		return endTime
	}
}
