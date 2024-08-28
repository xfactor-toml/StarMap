<template>
  <div class="StartScene">
    <component :is="scenesStore.current.mode.getComponent()" />
    <!-- <PowerIndicator/> -->
    <RivCanvas
      v-if="showTestAnimation && activeAnimation"
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
import { config } from '@/config';

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
    activeAnimation: false,
    showTestAnimation: config.SHOW_RIV_TEST_ANIMATION,
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
    // document.body.addEventListener('click', this.handleClick);
  }
};
</script>

<style scoped src="./StartScene.css"></style>
