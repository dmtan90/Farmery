<template lang="pug">
.electric-add-component
	el-form.plant-add-form(:model="plant" label-width="150px"  center status-ico)
		el-row(:gutter="20")
			el-col(:xs="24" :md="8")
				avatar-upload.avatar-upload-component(:avatar.sync="plant.avatar" :is-init="true")
			el-col(:xs="24" :md="16")
				el-form-item.electric-form-input(:label="$t('common.name')")
					el-input(type="text" v-model="plant.name" :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable size="small")
				el-form-item.electric-form-input(:label="$t('admin.plant.description')")
					el-input(type="textarea" v-model="plant.description" :placeholder="$t('admin.plant.descriptionHint')" clearable size="small")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click="submitForm" :loading="isLoading" round style="width: 150px" size="small") {{ $t('common.create') }}
	.plant-add-tip
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
		...mapActions('plant', ['create']),
		async loadData() {
			
		}
	},
	mounted() {
		this.loadData()
	},
	data() {
		return {
			isLoading: false,
			plant: {
				name: '',
				avatar: '',
				description: ''
			}
		}
	}
})
export default class PlantAdd extends Vue{	
	submitForm() {
		console.log(this.plant)
		// e.g AA:BB:CC:DD:EE:FF
		if(!this.plant.name || this.plant.name.length > 64 || this.plant.name === ''){
			return notice.warning(this.$t('admin.plant.plantNameHintError'))
		}
		this.plant.name = this.plant.name.toUpperCase()

		if(this.plant.avatar === ''){
			return notice.warning(this.$t('admin.plant.plantAvatarHintError'))
		}

		if(this.plant.description === ''){
			return notice.warning(this.$t('admin.plant.plantDescriptionHintError'))
		}

		this.isLoading = true
		// this.bulb.showStatus = this.bulb.status ? 'ON' : 'OFF'
		this.create(this.plant).then(e=>{
			this.isLoading = false
			if(e.success){
				notice.success(e.message, this.$t('common.info'))
				this.$router.push({name: 'PlantManage'})
			}else{
				notice.error(e.message, this.$t('common.error'))
			}
		})
	}
}
</script>

<style lang="stylus">
.electric-add-component
	position relative
	height 400px
	overflow-y scroll
	overflow-x hidden
	margin 30px
.plant-add-form
	margin-left auto
	margin-right auto
.plant-add-tip
	font-size .8em
	margin-bottom 20px
	& *
		padding 5px 0
.electric-form-input
	width 86%
</style>
