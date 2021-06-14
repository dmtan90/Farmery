<template lang="pug">
.user-close(@click="$router.go(-1)"): i.el-icon-close
</template>
<style lang="stylus">
.user-close
	position absolute
	top 20px
	right 20px
	transform scale(1.5)
	text-shadow 0 0 1px #ccc
	cursor pointer
	transition .2s
	&:hover
		transform scale(1.3)
		text-shadow 0 0 2px #99
</style>
