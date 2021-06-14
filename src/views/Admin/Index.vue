<template lang="pug">
el-container
	layout-aside
	el-container(direction="vertical")
		layout-header
		layout-main
</template>

<script>
import {Component,Vue} from 'vue-property-decorator'
import LayoutAside from '~/layout/Aside'
import LayoutHeader from '~/layout/Header'
import LayoutMain from '~/layout/Main'

@Component({
	components:{
		LayoutAside,
		LayoutHeader,
		LayoutMain
	}
})
export default class Admin extends Vue{}
</script>
