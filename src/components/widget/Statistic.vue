<template lang="pug">
.card-component(@click="handleClick")
	i.card-icon(:class="data.icon")
	.card-title(:span="24" type="flex" align="middle" justify="center")
		|{{ data.name }}
	el-row.card-value
		el-col(:span="24")
			|{{ data.total }}
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import { mapState,mapActions } from 'vuex'

@Component({
	components:{

	},
	computed:{
	},
	props:{
		// { name: '', icon: '', total: 0, route: '' }
		data: Object
	},
	watch:{
		data: function(newVal, oldVal){
			this.data = newVal
		}
	},
	methods:{
		handleClick() {
			this.$router.push({ name: this.data.route })
		}
	},
	mounted() {
	},
	data() {
		return {

		}
	}
})
export default class StatisticCard extends Vue{
}
</script>

<style lang="stylus">
.card-component
	box-shadow 2px 3px 10px #ccc
	border-radius 10px
	width 100%
	height 120px
	padding 10px
	background-color #FFFFFF
	position relative
	cursor pointer
	.card-title
		font-size 16px
		margin-bottom 20px
		color #909399
	.card-icon
		font-size 24px
		position absolute
		color #409EFF
		left 10px
		top 10px
	.card-value
		font-size 32px
		text-align center
		color #606266
		font-weight 500

</style>
