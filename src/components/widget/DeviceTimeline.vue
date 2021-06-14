<template lang="pug">
.device-timeline-component
	div(style="display:flex")
		el-date-picker(v-model="query.time"
			type="daterange"
			range-separator="-"
			start-placeholder="Start date"
			end-placeholder="End date"
			style="width: 200px"
			size="small")
		el-input(size="small" v-model="query.name" maxlength="128" :placeholder="$t('components.widget.cropProcess.searchHint')" style="margin-left: 10px; width: 200px")
		el-button(round size="small" type="primary" @click="loadTimeline()" :disabled="loading" :loading="loading" style="margin-left: 10px; width: 100px")
			i.el-icon-search
			| {{ $t('common.filter') }}
		el-button(round size="small" type="success" @click="handleExport()" :disabled="loading" :loading="loading" style="margin-left: 10px; width: 100px")
			i.el-icon-printer
			| {{ $t('common.export') }}
		el-button(round size="small" type="" @click="handleAddPost" :disabled="loading" :loading="loading" style="margin-left: 10px; width: 100px")
			i.el-icon-edit-outline
			| {{ $t('components.widget.cropProcess.newPost') }}
	.container(v-if="device && device.tags && device.tags.length > 0" style="margin-top: 10px; height: 50px; width: 100%; overflow-y: scroll;")
		.tag-container()
			div(v-for="(tag,idx) in device.tags" :key="idx" @click="handleSelectTag(tag)" style="margin-right: 10px; float: left")
				el-tooltip(:content="tag" placement="top")
					el-avatar()
						| {{ tag }}
	div.container(style="margin-top:20px" v-loading="loading")
		div.block(style="background-color: #F6F8F8;padding:10px; min-height: 400px; max-height: 600px; overflow-y:scroll")
			el-timeline()
				el-timeline-item(v-for="(timeline,index) in timelineList" :key="index" :timestamp="parseDate(timeline.date, 'YYYY/MM/DD HH:mm')" placement="top")
					el-card()
						el-button.remove-icon(size="small" type="text" @click="handleRemoveTimeline(index)")
							i.el-icon-close
						span(style="display: inline-flex")
							el-tooltip(:content="timeline.owner ? timeline.owner.name : 'Unknown'" placement="top")
								el-avatar(shape="circle" size="small" fit="cover" :src="timeline.owner ? timeline.owner.avatar : ''" style="margin-right:5px")
									img(src="/img/no-image.png")
							h4(style="line-height: 32px") {{ timeline.subject }}
						p() {{ timeline.content }}
						div(style="margin-top: 20px")
							.avatar-container(v-for="(avatar, idx) in timeline.medias" :key="idx" @click="handlePictureCardPreview(avatar)" style="display: contents")
								el-avatar(shape="square" :size="100" fit="cover" :src="avatar" style="margin-right:5px")
									img(src="/img/no-image.png")
						p(v-if="timeline.tags && timeline.tags.length > 0")
							el-tag(v-for="(tag,idx) in timeline.tags" :key="idx" size="mini" style="margin-right: 10px") {{ tag }}
				el-timeline-item(v-if="timelineList.length === 0" :timestamp="parseDate((new Date()).getTime(), 'YYYY/MM/DD HH:mm')" placement="top")
					el-card()
						h4()
							| {{ $t('components.widget.cropProcess.noPostHint') }}
						p()
							| {{ $t('components.widget.cropProcess.postNow') }}
	el-dialog.add-timeline-dialog(:title="$t('components.widget.cropProcess.addTimeline')" :visible.sync="dialogAddTimelineVisible" append-to-body)
		el-form(v-model="newTimelineForm" label-width="130px" style="margin-top: 20px")
			el-form-item(:label="$t('components.widget.cropProcess.subject')")
				el-input(size="small" v-model="newTimelineForm.subject" maxlength="128" :placeholder="$t('components.widget.cropProcess.subjectHint')")
			el-form-item(:label="$t('components.widget.cropProcess.content')")
				el-input(size="small" type="textarea" v-model="newTimelineForm.content" maxlength="2048" :placeholder="$t('components.widget.cropProcess.contentHint')")
			el-form-item(:label="$t('components.widget.cropProcess.tags')")
				el-input(size="small" v-model="newTimelineForm.tags" maxlength="128" :placeholder="$t('components.widget.cropProcess.tagsHint')")
			el-form-item(:label="$t('components.widget.cropProcess.date')")
				el-date-picker(v-model="newTimelineForm.date" type="date" :placeholder="$t('components.widget.cropProcess.dateHint')" size="small" width="250px")
			el-form-item(:label="$t('components.widget.cropProcess.medias')")
				el-upload(action="#"
					list-type="picture-card"
					:file-list="fileList"
					:on-change="handleSelectImage"
					accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
					:auto-upload="false" ref="mediaUpload")
					i.el-icon-plus(slot="default")
					div(slot="file" slot-scope="{file}")
						img(class="el-upload-list__item-thumbnail" :src="file.url" alt="")
						span(class="el-upload-list__item-actions")
							span(class="el-upload-list__item-preview" @click="handlePictureCardPreview(file.url)")
								i.el-icon-zoom-in()
							span(class="el-upload-list__item-preview" @click="handleRemove(file, fileList)")
								i.el-icon-delete()
					div(slot="tip" class="el-upload__tip") {{ $t('components.widget.cropProcess.limitSizeHint') }}
		div(slot="footer" class="dialog-footer")
			el-button(type="primary" size="small" @click="handleAddTimeline" :disabled="loading" :loading="loading" style="width: 100px")
				i.el-icon-s-promotion
				| {{ $t('components.widget.cropProcess.postNow') }}
	el-dialog(:visible.sync="dialogPreviewVisible" append-to-body)
		img(width="100%" :src="dialogImageUrl" alt="")
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { mapState, mapActions } from 'vuex'
import Moment from 'moment-timezone'
import notice from '@/utils/ui/notice'
import { downloadFileWithBlob, compressImageBase64 } from '@/utils/global'

@Component({
	components: {},
	props:{
		device: Object
	},
	watch: {
		device: function(value){
			this.device = value
		}
	},
	created() {
		if(this.device){
			this.loadTimeline()
		}
	},
	mounted() {
		// this.calendarApi = this.$refs.fullCalendar.getApi()
		window.onresize = () => {
			this.windowWidth = window.innerWidth
		}
		if(this.device){
			this.loadTimeline()
		}
	},

	methods: {
		...mapActions({
            'getTimeline': 'device/getTimeline',
            'getTimelines': 'device/getTimelines',
            'createTimeline': 'device/createTimeline',
            'updateTimeline': 'device/updateTimeline',
            'deleteTimeline': 'device/deleteTimeline',
            'exportTimeline': 'device/exportTimeline'
        }),
		loadDevice() {
			this.getDevice(this.id).then(e => {
				if(e.success){
					this.device = e.device
				}
				this.loadTimeline()
			})
		},
		loadFarm() {
		},
		handleChangeTime(){
		},
		handleExport(){
			let fn = this
			// console.log(this.query)
			if(!this.query.time || this.query.time.length != 2){
				return notice.error(this.$t('components.widget.cropProcess.timeFilterHintError'), this.$t('common.error'), 3000)
			}
			this.loading = true
			let startDate = Moment(this.query.time[0])
			let endDate = Moment(this.query.time[1])

			startDate.hour(0)
			startDate.minute(0)
			startDate.second(0)
			startDate.millisecond(0)

			endDate.hour(23)
			endDate.minute(59)
			endDate.second(59)
			endDate.millisecond(0)

			let params = {
				_id: this.device._id,
				startTime: startDate.valueOf(),
				endTime: endDate.valueOf()
			}

			this.exportTimeline(params).then(e => {
				this.loading = false
				if(e.success){
					let now = new Date()
					let filename = 'export_' + now.valueOf() + '.xlsx'
					let blob = new Blob([new Uint8Array(e.data.data)])
					downloadFileWithBlob(blob, filename)
				}
				else{
					notice.error(e.message, 'error', 2000)
				}
			})
		},
		parseDate(date, format){
			let now = Moment(date)
			if(format === undefined){
				format = 'YYYY-MM-DD HH:mm:ss'
			}
			return now.format(format)
		},
		loadTimeline(){
			let fn = this
			// console.log(this.query)
			if(!this.query.time || this.query.time.length != 2){
				return notice.error(this.$t('components.widget.cropProcess.timeFilterHintError'), this.$t('common.error'), 3000)
			}
			this.loading = true
			let startDate = Moment(this.query.time[0])
			let endDate = Moment(this.query.time[1])

			startDate.hour(0)
			startDate.minute(0)
			startDate.second(0)
			startDate.millisecond(0)

			endDate.hour(23)
			endDate.minute(59)
			endDate.second(59)
			endDate.millisecond(0)

			let params = {
				_id: this.device._id,
				name: this.query.name,
				startTime: startDate.valueOf(),
				endTime: endDate.valueOf()
			}

			this.getTimelines(params).then(e => {
				this.loading = false
				if(e.success){
					this.timelineList = e.timelines
				}
				else{
					notice.error(e.message, this.$t('common.error'), 2000)
				}
			})
        },
		handleRemove(file, fileList) {
			console.log(file)
			for(let i = 0; i < fileList.length; i++){
				if(file === fileList[i]){
					fileList.splice(i, 1)
					i--
				}
			}
			this.handleSelectImage(null, fileList)
			// this.fileList = fileList
		},
		handlePictureCardPreview(url) {
			console.log(url)
			this.dialogImageUrl = url
			this.dialogPreviewVisible = true
		},
		handleAddTimeline(){
			if(!this.newTimelineForm.subject){
				return notice.warning(this.$t('components.widget.cropProcess.subjectHintError'))
			}

			if(!this.newTimelineForm.content){
				return notice.warning(this.$t('components.widget.cropProcess.contentHintError'))
			}

			if(!this.newTimelineForm.date){
				return notice.warning(this.$t('components.widget.cropProcess.timeFilterHintError'))
			}

			let tags = []
			if(this.newTimelineForm.tags.length > 0){
				tags = this.newTimelineForm.tags.split(' ')
			}

			tags.forEach(tag => {
				// auto add # before tag
				if(tag[0] != '#'){
					tag = '#' + tag
				}
			})

			let params = {
				uid: this.device.uid,
				subject: this.newTimelineForm.subject,
				content: this.newTimelineForm.content,
				tags: tags,
				medias: this.newTimelineForm.medias,
				date: Moment(this.newTimelineForm.date).valueOf()
			}
			this.loading = true
			// console.log(params)
			this.createTimeline(params).then(e => {
				this.loading = false
				if(e.success){
					this.dialogAddTimelineVisible = false
					this.loadTimeline()
				}
				else{
					notice.error(e.message, this.$t('common.error'), 2000)
				}
			})
		},
		handleAddPost(){
			this.newTimelineForm = {
				subject: '',
		  		content: '',
		  		medias: [],
		  		tags: '',
		  		date: new Date()
			}
			// this.$refs.mediaUpload.clearFiles()
			this.fileList = []
			this.dialogAddTimelineVisible = true
		},
		verifyAvatarUpload(file) {
			const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
			// const isLt2M = file.size / 1024 / 1024 < 2

			if (!isJPGorPNG) {
				notice.warning(this.$t('components.widget.cropProcess.formatHintError'))
			}
			/* if (!isLt2M) {
				notice.warning('Uploaded avatar image size cannot exceed 2MB!')
			}
			return isJPGorPNG && isLt2M */
			return isJPGorPNG
		},
	    handleSelectImage(file, list){
	    	let fn = this
	    	if(file && !this.verifyAvatarUpload(file.raw)){
				console.log(list)
				list.splice(-1)
	    	}
	    	fn.fileList = list
	    	//convert all medias to base64
	    	fn.newTimelineForm.medias = []
			for(let i = 0 ; i < list.length; i++){
				let image = list[i]
				compressImageBase64(image).then(base64 => {
					fn.newTimelineForm.medias.push(base64)
	      		})
			}
	    },
	    handleRemoveTimeline(index){
	    	let fn = this
	  		this.$confirm(this.$t('components.widget.cropProcess.confirmDeletePost'), this.$t('common.confirm'),{
				confirmButtonText: this.$t('common.confirm'),
				cancelButtonText: this.$t('common.cancel')
			}).then(e => {
				console.log(e)
				fn.deleteTimeline(fn.timelineList[index].id).then(e=>{
					if(e.success){
						notice.success(e.message, this.$t('common.info'))
						fn.loadTimeline()
					}else{
						notice.error(e.message, this.$t('common.error'))
					}
				})
			}).catch(()=>{})
	    },
	    handleSelectTag(tag){
	    	console.log(tag)
	    	this.query.name = tag
	    	this.loadTimeline()
	    }
	},
	data() {
		let now = Moment()
		now.hour(23)
		now.minute(59)
		now.second(59)
		now.millisecond(999)
		let endTime = now.valueOf()
		let startTime = endTime - 30*24*60*60*1000
		return {
		  	listLoading: false,
		  	windowWidth: window.innerWidth,
		  	device: null,
		  	query: {
		  		time: [new Date(startTime), new Date(endTime)],
		  		name: ''
		  	},
		  	timelineList: [],
		  	newTimelineForm: {
		  		subject: '',
		  		content: '',
		  		tags: '',
		  		medias: [],
		  		date: new Date()
		  	},
		  	colors: ['#00A9FF', '#9E5FFF', '#FF4040', '#03BD9E', '#FF5583', '#BBDC00', '#9D9D9D'],
		  	dialogImageUrl: '',
        	dialogPreviewVisible: false,
        	dialogAddTimelineVisible: false,
        	loading: false,
        	fileList: []
		}
	},
})
export default class CropProgress extends Vue{
}
</script>

<style lang="stylus">
uploadSize = 100px
.device-timeline-component
	color #909399
	position relative
	.display
		display block
	.hidden
		display none
	.el-card
		margin-top 0px
		position relative
		.remove-icon
			position absolute
			right 20px
			top 10px
.add-timeline-dialog
	.el-upload.el-upload--picture-card
		width uploadSize
		height uploadSize
		.el-icon-plus
			vertical-align inherit
			line-height uploadSize
	.el-upload-list__item.is-ready
		width uploadSize
		height uploadSize
		div
			height uploadSize
</style>
