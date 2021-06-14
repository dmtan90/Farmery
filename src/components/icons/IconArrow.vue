<template lang="pug">
.arrow-wrap
	- let n=0
	while n++<2
		.arrow(class=`arrow-${n}`)
</template>

<style lang="stylus">
.arrow
  position absolute
  left 49.5%
  top 95%
  transform-origin 50% 50%
  transform translate3d(-50%, 0%, 0)
.arrow-1
  animation arrow-movement 2s ease-in-out infinite

.arrow-2
  animation arrow-movement 2s 1s ease-in-out infinite

.arrow:before,
.arrow:after
  background #ccc
  content ""
  display block
  height 3px
  position absolute
  top 0
  left 0
  width 13px
  box-shadow 1px 1px 20px 0px #fff

.arrow:before
  transform rotate(45deg) translateX(-10%)
  transform-origin top left

.arrow:after
  transform rotate(-45deg) translateX(10%)
  transform-origin top right

@keyframes arrow-movement
  0%
    opacity 0
    top 92%

  70%
    opacity 1

  100%
    opacity 0

</style>
