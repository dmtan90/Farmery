<template lang="pug">
.night-model(:class="{night:isNightModel}")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState} from 'vuex'
@Component({
	computed:{
		...mapState('ui',['isNightModel'])
	}
})
export default class NightModel extends Vue{}
</script>

<style lang="stylus">
.night-model
  position fixed
  top 0
  bottom 0
  left 0
  z-index 888
  visibility hidden
  width 100%
  height 100%
  background #000
  opacity 0
  pointer-events none
	transition all .4
  &.night
    visibility visible
    background-color #263238
    opacity .3
.night
	visibility visible
	background-color #263238
	opacity .3
</style>
