<template lang="pug">
el-select.cascader(v-model="city" placeholder="Select city" size="small" @change="fillAddress" clearable)
	el-option(v-for="item in cities" :key="item.value" :label="item.label" :value="item.value")
</template>

<script>
import { Component, Vue, Watch} from 'vue-property-decorator'
import CityInfo from 'config/city'

@Component({
	props:{
		isInit:Boolean,
		address: Object
	},
	watch: {
		address: function(value, oldValue){
			if(value){
				this.city = value.city
			}
		}
	},
	mounted() {
		if(this.address && this.address.city){
			this.city = this.address.city
		}
	}
})
export default class CitySelect extends Vue {
	city = ''
	cities = CityInfo.cities


	@Watch('isInit')
	toInit(value, oldValue) {
		this.city = ''
	}
	fillAddress() {
		if(!this.city){
			return
		}
		console.log(this.city)
		let address = {
			city: this.city,
			country: 'Vietnam',
			latitude: 0,
			longitude: 0
		}

		for (let city of this.cities) {
			if (city.value === address.city) {
				if(city.country){
					address.country = city.country
				}
				address.longitude = city.coord.lon
				address.latitude = city.coord.lat
				break
			}
		}
		this.$emit('update:address', address)
	}
}
</script>

<style lang="stylus">
.cascader
	width 100%
</style>
