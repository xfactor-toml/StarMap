<template>
  <div class="StartScene">
    <component :is="scenesStore.current.mode.getComponent()" />
    <!-- <PowerIndicator/> -->
    <RivCanvas
      v-if="activeAnimation"
      :src="'/expl.riv'"
      :position="pos"
      @end="() => activeAnimation = false"
    />
  </div>
</template>

<script lang="ts">
import { useScenesStore } from '@/stores';
import { PowerIndicator, RivCanvas } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'StartScene',
  components: {
    PowerIndicator,
    RivCanvas
  },
  data: () => ({
    pos: {
      x: 0,
      y: 0
    },
    activeAnimation: false
  }),
  methods: {
    handleClick(event: MouseEvent) {
      this.activeAnimation = true
      this.pos.x = event.clientX
      this.pos.y = event.clientY
    }
  },
  computed: mapStores(useScenesStore),
  mounted() {
    document.body.addEventListener('click', this.handleClick)
  }
};
</script>

<style scoped src="./StartScene.css"></style>
