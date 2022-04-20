<template>
  <canvas v-pan="pset" class="px-canvas" width="8" height="16"></canvas>
</template>


<script>
import Vue from 'vue'
import Hammer from 'hammerjs'

Vue.directive('pan', {
  bind(el, binding) {
    console.log('boundt')
    if (typeof binding.value === 'function') {
      const mc = new Hammer(el)
      mc.get('pan').set({
        direction: Hammer.DIRECTION_ALL,
        threshold: 0,
      })
      mc.get('press').set({
        time: 0,
      })
      mc.on('press', binding.value)
    }
  },
})

export default {
  data() {
    return {
    }
  },
  methods: {
    pset(e) {
      console.log(e)
    },
    untouch() {
    },
  },
}
</script>

<style>
.px-canvas {
  background: black;
  width: 260px !important;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
  margin-top: 1rem;
}
</style>
