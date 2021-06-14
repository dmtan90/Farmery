<template lang="pug">
div.avatar-container
	el-upload(list-type="picture-card" :show-file-list="false" :limit="1"
		:on-remove = "handleAvatarRemove"
		accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
		action=""
		:auto-upload="false"
	  	:before-upload="beforeAvatarUpload" :on-change="handleSelectAvatar" ref="uploadAvatar")
		img.avatar(v-if="imgSrc" :src="imgSrc")
		i.el-icon-plus(v-else slot="default")
	p() {{ $t('components.form.avatarUpload.chooseAvatarHint') }}
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import tip from '@/utils/ui/tip'
import { Message } from 'element-ui'
import { compressImageBase64 } from '@/utils/global'

@Component({
	props:{
		isInit: Boolean,
		avatar: String
	},
	watch: {
		avatar: function(value, oldValue){
			this.imgSrc = value
		},
		isInit: function(value, oldValue){
			this.$refs.uploadAvatar.clearFiles()
		}
	},
	mounted() {
		if(this.avatar){
			this.imgSrc = this.avatar
		}
	},
	data(){
		return {
			imgSrc: ''
		}
	},
	methods: {
		errorHandler() {
	        return true
	    },
	    beforeAvatarUpload(file) {
			const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' 
			// const isLt2M = file.size / 1024 / 1024 < 2

			if (!isJPGorPNG) {
				tip.warning($t('components.form.avatarUpload.imageFormatHint'))
			}
			return isJPGorPNG
		},
		handleSelectAvatar(file, fileList) {
			var fn = this
			if(!this.beforeAvatarUpload(file.raw)) {
				fn.$refs.uploadAvatar.clearFiles()
				return
			}
			//console.log(file)
	      	compressImageBase64(file).then(base64 => {
	      		fn.imgSrc = base64
	        	fn.$emit('update:avatar', fn.imgSrc)
	        	fn.$refs.uploadAvatar.clearFiles()
	      	})
	      	/* var reader = new FileReader()
	      	reader.readAsDataURL(file.raw)
	      	reader.onload = function() {
	        	// this.result //  This is base64 encoding
	        	// fn.ruleForm.logoPhoto = this.result;
	       		// fn.regForm.faceuri = this.result.substring(23)
	        	fn.imgSrc = this.result
	        	fn.$emit('update:avatar', fn.imgSrc)
	        	fn.$refs.uploadAvatar.clearFiles()
	      	} */
	    },
		handleAvatarRemove() {
			this.imgSrc = ''
			this.$emit('update:avatar', null)
		}
	}
})
export default class AvatarUpload extends Vue {
}
</script>

<style lang="stylus">
imgSize = 100px
.avatar-container
	text-align center
	.el-upload--picture-card
		width imgSize
		height imgSize
	.el-upload-list__item
		width imgSize
		height imgSize
		z-index 999
		border none
		outline none
	.el-icon-plus
		vertical-align inherit
		line-height imgSize
	.avatar
		width imgSize
		height imgSize
		border-radius 5px
</style>
