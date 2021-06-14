<template lang="pug">
.farm-create-component
	el-form.farm-form(:model="farm" label-width="200px" action="" center status-ico)
		el-row(:gutter="20")
			el-col(:xs="24" :md="8")
				avatar-upload.avatar-upload-component(:avatar.sync="farm.avatar" is-init=true)
			el-col(:xs="24" :md="16")
				el-form-item(:label="$t('admin.farm.org')")
					el-select(v-model="farm.orgId" :placeholder="$t('admin.farm.orgHint')" size="small")
						el-option(v-for="(item, index) in orgs" :key="index" :label="item.name" :value="item._id")
				el-form-item(:label="$t('admin.farm.farmName')")
					el-input(v-model="farm.name" type="text" :placeholder="$t('common.upTo64Chars')" maxlength="64" clearable @change="existHandle" size="small")
				el-form-item(:label="$t('common.address')")
					customer-address(:value="farm.address" @change="changeAddress" size="medium" hide-map="false")
	el-row(:span="24" type="flex" align="middle" justify="center")
		el-button(type="success" @click.native.prevent="submitForm" :loading="isLoading" round style="width:150px" size="small") {{ $t('common.create') }}
	.farm-create-tip(:span="24" type="flex" align="middle" justify="center")
		el-row
			textra(:data="words" :timer="3" :sequence="true" :infinite="true")
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import {mapActions,mapState} from 'vuex'
import AvatarUpload from '~/form/AvatarUpload'
import CustomerAddress from '~/form/CustomerAddress'
import notice from '@/utils/ui/notice'

@Component({
	computed:{
		...mapState('user',['name'])
	},
	components:{
		AvatarUpload,
		CustomerAddress
	},
	mounted() {
		this.loadOrg()
	},
	methods:{
		...mapActions('farm',['hasExisted','create']),
		...mapActions('org',['gets']),
		changeAddress(value){
	    	console.log(value)
	    	this.farm.address = {
	    		country: value.address[0],
	    		city: value.address[1],
				latitude: value.latitude,
				longitude: value.longitude
	    	}
	    },
	    loadOrg(){
	    	this.gets().then(e => {
	    		this.isLoading = false
	    		if(e.success){
	    			this.orgs = e.orgs
	    		}
	    	})
	    }
	}
})
export default class farmCreate extends Vue{
	disabled = false
	farm = {
		orgId: '',
		name:'',
		avatar: '',
		address: {}
	}
	orgs = []
	hasExistedWithName = false
	words=['The name provided to search cannot be repeated','You can choose the device you want to share']
	isLoading = true

	existHandle(){
		if(!this.farm.name){
			return
		}
		this.isLoading = true
		this.hasExisted(this.farm.name).then(e=>{
			this.isLoading = false
			if(e.success){
				this.hasExistedWithName = e.hasExisted
				e.hasExisted && notice.warning(this.$t('admin.device.farmNameExistedError'))
			}
		})
	}

	verify(){
		if(!this.farm.name){
			notice.warning(this.$t('admin.device.farmNameHintError'))
			return false
		}
		if(this.farm.name.length > 64){
			notice.warning(this.$t('admin.device.farmNameOverSize'))
			return false
		}
		if(this.farm.address === '' || this.farm.address === {}){
			notice.warning(this.$t('admin.device.addressHintError'))
			return false
		}
		if(this.hasExistedWithName){
			notice.warning(this.$t('admin.device.farmNameExistedError'))
			return false
		}
		return true
	}

	submitForm(){
		if(!this.verify()){
			return
		}
		const farm = this.farm
		farm.userName = this.name
		this.create(farm).then(e=>{
			if(e.success){
				notice.success(e.message, this.$t('common.info'))
				this.$router.push({name: 'FarmManage'})
			}else{
				notice.error(e.message, this.$t('common.error'))
			}
		})
	}
}
</script>

<style lang="stylus">
.farm-create-component
	padding 50px
.farm-form
	width 100%
	margin-left auto
	margin-right auto
	margin-bottom 40px
.farm-create-tip
	bottom 60px
	margin-top 20px
	font-size .9em
</style>
