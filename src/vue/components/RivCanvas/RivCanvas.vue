<template>
  <canvas
    ref="canvas"
    class="RivCanvas"
    width="200"
    height="200"
  />
</template>

<script lang="ts">
import { Rive } from "@rive-app/canvas";

export default {
  name: 'RivCanvas',
  data() {
    return {
      riv: null
    }
  },
  mounted() {
    this.riv = new Rive({
        src: '/rocket.riv',
        canvas: this.$refs.canvas,
        autoplay: true,
    });
  }
};
</script>

<style scoped src="./RivCanvas.css"></style>
