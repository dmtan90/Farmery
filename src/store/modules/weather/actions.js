export default {
	async setInfo({ commit },weatherInfo) {
		commit('Weather',weatherInfo)
		// commit('Sun',sunInfo)
		// commit('Air',airInfo)
	}
}
