<template>
  <canvas
    ref="canvas"
    class="RivCanvas"
    :width="width"
    :height="height"
  />
</template>

<script lang="ts">
import { Rive } from "@rive-app/canvas";

export default {
  name: 'RivCanvas',
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
  },
  data() {
    return {
      riv: null
    }
  },
  mounted() {
    this.riv = new Rive({
        src: this.src,
        canvas: this.$refs.canvas,
        autoplay: true,
    });
  }
};
</script>

<style scoped src="./RivCanvas.css"></style>
