<template>
<canvas class="static" ref="canvas"></canvas>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      width: null,
      height: null,
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas;

    this.ctx = this.canvas.getContext('2d');
    this.setSize(this.canvas)


    this.draw()

    window.addEventListener('resize', this.setSize)
    window.requestAnimationFrame(this.draw)
  },
  methods: {
    draw() {
      this.ctx.fillRect(0, 0, this.width, this.height);
      const imageData = this.ctx.getImageData(0, 0, this.width, this.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const c = Math.random()*255
        data[i]     = c;
        data[i + 1] = c;
        data[i + 2] = c;
      }
      this.ctx.putImageData(imageData, 0, 0);

      window.requestAnimationFrame(this.draw)
    },
    setSize() {
      this.width = window.innerWidth *   0.125;
      this.height = window.innerHeight * 0.125;
      this.canvas.width = this.width
      this.canvas.height = this.height
    },
  },
}
</script>

<style>
.static {
  position: absolute;
  left: 0;
  top: 0;
  width: 100% !important;
  height: 100% !important;
  image-rendering: pixelated;
  display: block;
  line-height: 0;
  padding: 0;
  margin: 0;
}
</style>
