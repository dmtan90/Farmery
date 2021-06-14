<template lang="pug">
.org-add-component
	el-form.org-add-form(:model="org" label-width="150px"  center status-ico)
		el-row(:gutter="20")
			el-col(:xs="24" :md="8")
				avatar-upload.avatar-upload-component(:avatar.sync="org.avatar" :is-init="true")
			el-col(:xs="24" :md="16")
				el-form-item.org-form-input(:label="$t('common.name')")
					el-input(type="text" v-model="org.name" :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable size="small")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('common.add') }}
	.org-add-tip
</template>

<script>
import {Component, Vue} from 'vue-property-decorator'
import AvatarUpload from '~/form/AvatarUpload'
import { mapActions, mapState } from 'vuex'
import notice from '@/utils/ui/notice'

@Component({
	components: {
		AvatarUpload
	},
	props: {
	},
	methods: {
		...mapActions('org', ['create']),
		async loadData() {
			
		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			isLoading: false,
			org: {
				name: '',
				avatar: ''
			}
		}
	}
})
export default class OrgAdd extends Vue{	
	submitForm() {
		console.log(this.org)
		// e.g AA:BB:CC:DD:EE:FF
		if(!this.org.name || this.org.name.length > 64 || this.org.name === ''){
			return notice.warning(this.$t('admin.org.orgNameHintError'))
		}
		this.org.name = this.org.name.toUpperCase()

		this.isLoading = true
		// this.bulb.showStatus = this.bulb.status ? 'ON' : 'OFF'
		this.create(this.org).then(e=>{
			this.isLoading = false
			if(e.success){
				notice.success(e.message, this.$t('common.info'))
				this.$router.push({name: 'OrgManage'})
			}else{
				notice.error(e.message, this.$t('common.error'))
			}
		})
	}
}
</script>

<style lang="stylus">
.org-add-component
	position relative
	height 400px
	overflow-y scroll
	overflow-x hidden
	margin 30px
.org-add-form
	margin-left auto
	margin-right auto
.org-add-tip
	font-size .8em
	margin-bottom 20px
	& *
		padding 5px 0
.org-form-input
	width 86%
</style>
