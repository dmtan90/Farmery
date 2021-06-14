<template lang="pug">
.storm
	.cloud
	.lightning
		.bolt
		.bolt
</template>
<style lang="stylus">
.storm
	position absolute
	top 50%
	left 78%
	font-size 1em
	color #f6f6f6

.lightning
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

.bolt
	position absolute
	top 50%
	left 50%
	margin -0.25em 0 0 -0.125em
	color #fff
	opacity 0.3
	animation lightning 2s linear infinite
	&:before,&:after
		content ''
		position absolute
		z-index 2
		top 50%
		left 50%
		margin -1.625em 0 0 -1.0125em
		border-top 1.25em solid transparent
		border-right 0.75em solid
		border-bottom 0.75em solid
		border-left 0.5em solid transparent
		transform skewX(-10deg)
	&:after
		margin -0.25em 0 0 -0.25em
		border-top 0.75em solid
		border-right 0.5em solid transparent
		border-bottom 1.25em solid transparent
		border-left 0.75em solid
		transform skewX(-10deg)
	&:nth-child(2)
		width 0.5em
		height 0.25em
		margin -1.75em 0 0 -1.875em
		transform translate(2.5em, 2.25em)
		opacity 0.2
		animation lightning 1.5s linear infinite
		&:before
			margin -0.75em 0 0 -0.5em
			border-top 0.625em solid transparent
			border-right 0.375em solid
			border-bottom 0.375em solid
			border-left 0.25em solid transparent
		&:after
			margin -0.125em 0 0 -0.125em
			border-top 0.375em solid
			border-right 0.25em solid transparent
			border-bottom 0.625em solid transparent
			border-left 0.375em solid

@keyframes lightning
	45%
		color #999
		background #999
		opacity 0.2
	50%
		color #0cf
		background #0cf
		opacity 1
	55%
		color #999
		background #999
		opacity 0.2

</style>
