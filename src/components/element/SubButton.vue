<template lang="pug">
	el-button.sub-button(@click="changeShowStatus({name:'Registry',status:true})") {{btnText}}
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { mapMutations } from 'vuex'

@Component({
	methods: {
		...mapMutations('dialog', ['changeShowStatus'])
	},
	props:{
		btnText:{
			required: true,
			type: String
		}
	}
})
export default class SubButton extends Vue {}
</script>

<style lang="stylus" scoped>
.sub-button
	font-size 110%
	background-color transparent
	border solid 3px #333
	letter-spacing 2px
	transition .3s
	color #333
	&:hover
		border-color #f1f1f1
		color #fff
		background-color #333

</style>
