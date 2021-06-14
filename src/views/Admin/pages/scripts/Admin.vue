<template lang="pug">
.script-admin-component
	el-row(:gutter="20" style="margin-top: 10px")
		<!-- el-col(:span="4")
			el-input(type="text" v-model="query.name" :placeHolder="Input script name" size="small")
		el-col(:span="3")
			el-button(type="primary" icon="el-icon-search" @click="searchIFTTTModel()" round style="width:100%" size="small")
				|Search -->
		el-col(:xs="12" :sm="6" :md="3")
			el-button(type="success" icon="el-icon-circle-plus-outline" @click="$router.push({name:'ScriptAdd'})" round style="width:100%" size="small")
				| {{ $t('admin.script.addScript') }}
	.scripts-list
		el-row(:gutter="20" v-if="ifttts.length > 0")
			el-col(:xs="24" :sm="12" :md="6" :xl="4" v-for="(ifttt, index) in ifttts" :key="index")
				ifttt-card(:ifttt.sync="ifttt" :index.sync="index" :onDelete.sync="loadData" style="width: 96%; margin-left: auto; margin-right: auto;")
		.when-script-is-null(v-else :span="24" type="flex" align="middle" justify="center")
			el-row
				| {{ $t('admin.script.noScriptHint') }}
			.script-add-button(:span="24" type="flex" align="middle" justify="center")
				el-button(type="success" @click.native.prevent="$router.push({name:'ScriptAdd'})" round) {{ $t('admin.script.addScript') }}
	.script-admin-tip(v-show="ifttts.length < 5" :span="24" type="flex" align="middle" justify="center")
			textra.tip(:data="words" :timer="3" :sequence="true" :infinite="true")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex'
import notice from '@/utils/ui/notice'
import IFTTTCard from '~/widget/IFTTT'

@Component({
	components: {
		'ifttt-card': IFTTTCard
	},
	methods: {
		...mapActions('ifttt',['gets', 'get', 'update', 'delete']),
		loadData() {
			this.gets().then(e => {
				if(e.success){
					this.ifttts = e.ifttts
				}
			})
		},
		searchIFTTTModel() {

		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			query: {
				name: ''
			},
			ifttts: [],
			words: this.$t('admin.script.tips'),
			options: {
				itemMargin: 10,
				containerWidth: document.body.clientWidth,
				itemClassName: 'item',
				gridWidth: 100,
				transitionDuration: '.5'
		    },
		}
	}
})
export default class ScriptsAdmin extends Vue{
}
</script>

<style lang="stylus">
.script-admin-component
	overflow-x hidden
	overflow-y scroll
.script-admin-tip
	font-size .8em
	bottom 60px
	margin-top 50px
.disabled-row
	opacity .8
	color transparent
	text-shadow 0 0 1px #666
	cursor not-allowed
.when-script-is-null
	margin 150px auto 50px
.scripts-list
	padding-top 15px
.script-add-button
	margin-top 40px
.script-delete-button
	transform translateX(-10px) translateY(2px) !important
	border-radius 0px !important
.script-disabled-button
	transform translateY(-2px) !important
	border-radius 0px !important
.scripts-table
	box-shadow 0 2px 10px #ccc
	border-radius 5px
	background-color transparent !important
</style>
