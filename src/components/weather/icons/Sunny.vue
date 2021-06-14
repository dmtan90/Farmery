<template lang="pug">
.sunny: .sun: .rays
</template>
<style lang="stylus">
.sunny
	font-size 1em
	color #f6f6f6

.sun
	width 2.5em
	height 2.5em
	margin -1.25em
	background currentColor
	border-radius 50%
	box-shadow 0 0 0 0.375em orange
	animation spin 12s infinite linear

.rays
	position absolute
	top -2em
	left 50%
	width 0.375em
	height 1.125em
	margin-left -0.1875em
	background yellow
	border-radius 0.25em
	box-shadow 0 5.375em yellow
	&:before , &:after
		content ''
		position absolute
		top 0em
		left 0em
		display block
		width 0.375em
		height 1.125em
		transform rotate(60deg)
		transform-origin 50% 3.25em
		background yellow
		border-radius 0.25em
		box-shadow 0 5.375em yellow
	&:before
		transform rotate(120deg)

@keyframes spin
	to
		transform rotate(360deg)
</style>
