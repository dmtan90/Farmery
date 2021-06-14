<template lang="pug">
.org-add-component
	el-form.org-add-form(:model="org" label-width="150px"  center status-ico)
		el-row(:gutter="20")
			el-col(:xs="24" :md="8")
				avatar-upload.avatar-upload-component(:avatar.sync="org.avatar" :is-init="true")
			el-col(:xs="24" :md="16")
				el-form-item.org-form-input(:label="$t('commom.name')")
					el-input(type="text" v-model="org.name" :placeholder="$t('commom.upTo64Chars')" maxlength="64" clearable size="small")
				el-form-item(:label="$t('commom.status')")
					el-select(v-model="org.status" :placeholder="$t('admin.org.selectOrgStatus')" size="small")
						el-option(v-for="item in statusOptions" :key="item.value" :label="item.name" :value="item.value")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('commom.update') }}
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
	props: ['id'],
	methods: {
		...mapActions('org', ['get','update']),
		async loadData() {
			this.get(this.id).then(e => {
				if(e.success){
					this.org = e.org
				}
			})
		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			isLoading: false,
			statusOptions: [
				{
					name: $t('commom.enabled'),
					value: true
				},
				{
					name: $t('commom.disabled'),
					value: false
				},
			],
			org: {
				_id: '',
				name: '',
				avatar: '',
				status: false
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
		this.update(this.org).then(e=>{
			this.isLoading = false
			if(e.success){
				notice.success(e.message, $t('commom.info'))
				this.$router.push({name: 'OrgManage'})
			}else{
				notice.error(e.message, $t('commom.error'))
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
