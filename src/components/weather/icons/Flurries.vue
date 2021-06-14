<template lang="pug">
.flurries
	.cloud
	.snow
		.flake
		.flake
</template>
<style lang="stylus">
.flurries
	position absolute
	top 50%
	left 68%
	font-size 1em
	color #f6f6f6

.snow
	position absolute
	z-index 2
	top 50%
	left 20%
	width 3.75em
	height 3.75em
	margin 0.375em 0 0 -2em
	background currentColor

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

.flake
	&:before, &:after
		content '\2745'
		position absolute
		top 50%
		left 50%
		margin -1.025em 0 0 -1.0125em
		color #000
		list-height 1em
		opacity 0.2
		animation spin 8s linear infinite reverse
	&:after
		margin 0.125em 0 0 -1em
		font-size 1.5em
		opacity 0.4
		animation spin 14s linear infinite
	&:nth-child(2)
		&:before
			margin -0.5em 0 0 0.25em
			font-size 1.25em
			opacity 0.2
			animation spin 10s linear infinite
		&:after
			margin 0.375em 0 0 0.125em
			font-size 2em
			opacity 0.4
			animation spin 16s linear infinite reverse

@keyframes spin
	100%
		transform rotate(360deg)

</style>
