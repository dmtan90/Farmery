import getNightModel from '@/utils/ui/nightModel'

export default {
	isHome: '',
	familyTab: 'receive',
	scriptFormFinishCount: 0,
	isNightModel: getNightModel(),
	isShowMenu: false,
	units: JSON.parse(localStorage.getItem('units')) || {
		temp: true,
		ec: true
	},
	language: localStorage.getItem('language') || 'vn'
}
