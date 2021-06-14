<template lang="pug">
.cloudy
	.cloud
	.cloud
</template>

<style lang="stylus">
.cloudy
	position absolute
	top 50%
	left 30%
	font-size 1em
	color #f6f6f6

.cloud
	position absolute
	z-index 1
	width 3.6875em
	height 3.6875em
	margin -1.84375em
	background currentColor
	border-radius 50%
	box-shadow -2.1875em 0.6875em 0 -0.6875em, 2.0625em 0.9375em 0 -0.9375em, 0 0 0 0.375em lightgray, -2.1875em 0.6875em 0 -0.3125em lightgray, 2.0625em 0.9375em 0 -0.5625em lightgray
	&:after
		content ''
		position absolute
		bottom 0
		left -0.5em
		display block
		width 4.5625em
		height 1em
		background currentColor
		box-shadow 0 0.4375em 0 -0.0625em lightgray
	&:nth-child(2)
		color-cloud = #000
		z-index 0
		background color-cloud
		box-shadow -2.1875em 0.6875em 0 -0.6875em color-cloud, 2.0625em 0.9375em 0 -0.9375em color-cloud, 0 0 0 0.375em color-cloud, -2.1875em 0.6875em 0 -0.3125em color-cloud, 2.0625em 0.9375em 0 -0.5625em color-cloud
		opacity 0.3
		transform scale(0.5) translate(6em, -3em)
		animation cloud 4s linear infinite
		&:after
			background color-cloud
			bottom -7px

@keyframes cloud
	0%
		opacity 0
	50%
		opacity 0.3
	100%
		opacity 0
		transform scale(0.5) translate(-200%, -3em)
</style>
