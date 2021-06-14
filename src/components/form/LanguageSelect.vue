<template lang="pug">
el-dropdown.language-container(@command="handleChangeLanguage")
	span(class="el-dropdown-link")
		gb-flag(:code="code" size="medium")
		i.el-icon-arrow-down.el-icon--right
	el-dropdown-menu(slot="dropdown")
		el-dropdown-item(v-for="(item,idx) in languages" :key="idx" :command="item.value")
			gb-flag(:code="item.code" size="small")
			| {{ item.name }}
</template>

<script>
import { Component, Vue, Watch} from 'vue-property-decorator'
import { mapState, mapActions, mapMutations } from 'vuex'

@Component({
	components:{
		
	},
	computed:{
		...mapState('ui', ['language'])
	},
	watch:{
		
	},
	mounted() {
		this.setLanguage(this.language)
		this.getCode(this.language)
	},
	methods: {
		...mapMutations('ui',['setLanguage']),
		handleChangeLanguage(lang){
			this.setLanguage(lang)
			this.getCode(lang)
			window.location.reload()
		},
		getCode(lang){
			for(let i = 0; i < this.languages.length; i++){
				const language = this.languages[i]
				if(language.value === lang){
					this.code = language.code
					break
				}
			}
		}
	},
	data() {
		return {
			languages: [
				{name: 'Tiếng Việt', value: 'vn', code: 'vn'},
				{name: 'English', value: 'en', code: 'gb'}
			],
			code: 'vn'
		}
	}
})
export default class LanguageSelect extends Vue {
	
}
</script>

<style lang="stylus">
.language-container
	width 100%
	.el-dropdown-link
		display flex
		.gb-flag
			border-radius 10px
		.el-icon-arrow-down
			line-height 35px
.el-dropdown-menu__item
	display flex
	vertical-align middle
	.gb-flag
		margin-top 5px
		margin-right 5px
</style>
