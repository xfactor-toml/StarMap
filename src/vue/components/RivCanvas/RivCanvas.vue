<template>
  <div
    class="RivCanvas" 
    :style="{
      top: `${position.y}px`,
      left: `${position.x}px`,
      width: `${width}px`,
      height: `${height}px`,
    }"
  >
    <canvas
      v-if="active"
      ref="canvas"
      class="RivCanvas__canvas"
      :width="width + 4"
      :height="height + 4"
    />
  </div>
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
      default: 60
    },
    height: {
      type: Number,
      default: 60
    },
    position: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
      })
    },
  },
  data() {
    return {
      active: true,
      riv: null
    }
  },
  mounted() {
    this.riv = new Rive({
      src: this.src,
      canvas: this.$refs.canvas,
      autoplay: true,
      onLoop: ()=> {
        this.active = false
        this.$emit('end')
        },
    });
  }
};
</script>

<style scoped src="./RivCanvas.css"></style>
