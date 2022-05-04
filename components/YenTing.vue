<template>
  <div>
    <canvas class="static" ref="canvas"></canvas>
    <h1 class="url">live.yentinglo.net</h1>

    <p style="text-align:center;">Welcome! wait for YenTing...</p>
  </div>
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
    this.ctx.fillStyle = "#e6e6e6"
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.setSize(this.canvas)


    this.draw()

    window.addEventListener('resize', this.setSize)
    window.requestAnimationFrame(this.draw)
  },
  methods: {
    draw() {
      //const imageData = this.ctx.getImageData(0, 0, this.width, this.height)
      //this.ctx.fillRect(0, 0, this.width, this.height);
      const imageData = this.ctx.getImageData(0, 0, this.width, this.height)
      const data = imageData.data

      const contrast = 0.07
      for (let i = 0; i < data.length;) {
        const c = 255*(1 - contrast) + Math.random()*255*contrast
        data[i]     = c;
        data[i + 1] = c;
        data[i + 2] = c;

        i += 4 * Math.round(Math.random()*128);
      }
      this.ctx.putImageData(imageData, 0, 0);

      window.requestAnimationFrame(this.draw)
    },
    setSize() {
      this.width = window.innerWidth *   0.125;
      this.height = window.innerHeight * 0.125;
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.ctx.fillStyle = "#e6e6e6"
      this.ctx.fillRect(0, 0, this.width, this.height);
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
  z-index: -1;
}


.url {
    margin: 2em;
    text-align: center;
}
</style>
