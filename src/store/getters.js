export default {
  	token: state => state.user.token,
  	name: state => state.user.name,
	email: state => state.user.email,
	address: state=> state.user.address,
	avatar: state => state.user.avatar,
  	status: state => state.user.status,
  	cityID: state => state.weather.cityID,
  	enable: state => state.weather.enable,
	now: state => state.weather.now
}
