import Token from '@/utils/store/token'
export default {
	name: '',
	email: '',
	role: 1,//0 is sysadmin, 1 is user
	address:'',
	avatar: '',
	news: {},
	token: Token.get(),
	keep: true,
	status: sessionStorage.getItem('status') || 'UNLOGIN',
	result: {},
	families:[]
}
