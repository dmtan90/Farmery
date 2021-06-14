<template lang="pug">
#app
	transition(:name="animation")
		router-view
	<!-- night-model -->
</template>
<script>
import {Component,Vue} from 'vue-property-decorator'
// import NightModel from '~/element/NightModel'
import { getRandomAnimation } from '@/utils/ui/animation'
import { mapState, mapActions } from 'vuex'

@Component({
	components:{
		// NightModel
	},
	computed:{
		...mapState('ui',['language'])
	},
	watch:{
		'$route'(to,from){
			this.changeAnimation()
		}
	},
	mounted() {
		// this.setLanguage(this.language)
	},
	methods: {
		...mapActions('ui',['setLanguage'])
	}
})
export default class App extends Vue{
	animation = getRandomAnimation()
	changeAnimation(){
		this.animation = getRandomAnimation()
	}
}
</script>
