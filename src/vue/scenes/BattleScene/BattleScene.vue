<template>
  <div class="BattleScene">
    <transition
      :css="false"
      :mode="'out-in'"
      :appear="true"
      @enter="onEnter"
      @leave="onLeave"
    >
      <component :is="currentMode.getComponent()"/>
    </transition>
  </div>
</template>

<script lang="ts">
import { useScenesStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'BattleScene',
  computed: {
    ...mapStores(useScenesStore),
    previousMode() {
      return this.scenesStore.previous.mode
    },
    currentMode() {
      return this.scenesStore.current.mode
    }
  },
  methods: {
    async onEnter(el, done) {
      await this.currentMode?.onEnter?.(el)
      done()
    },
    async onLeave(el, done) {
      await this.previousMode?.beforeLeave?.(el)
      done()
    }
  }
};
</script>

<style scoped src="./BattleScene.css"></style>
