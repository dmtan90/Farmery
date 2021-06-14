<template lang="pug">
	svg.svg-icon(aria-hidden="true" :height="getSize" :width="getSize" :class="name")
		use(:xlink:href="iconName")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'

@Component({
	props:{
		name:{
			type:String,required:true
		},
		size:{
			type:String,default:'1'
		}
	}
})
export default class IconSvg extends Vue{
	get iconName(){
		return `#icon-${this.name}`
	}
	get getSize(){
		return `${this.size}em`
	}
}
</script>

<style lang="stylus">
.svg-icon
  vertical-align -0.15em
  fill currentColor
  overflow hidden

</style>
