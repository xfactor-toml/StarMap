<template>
  <div class="LevelsPanel" :class="{ 'is-hidden': !uiStore.panels.visibility.levels }">
    <button class="LevelsPanel__toggle" @click="uiStore.panels.togglePanel('levels')" />
    <div class="LevelsPanel__group">
      <template v-for="level in starsStore.availableFilterLevels">
        <button
          class="LevelsPanel__button"
          :class="{
            [`is-level-${level.value}`]: true,
            'is-active': starsStore.levelsFilter.includes(level.value)
          }"
          @click="select(level.value)"
        >
          {{ level.label }}
        </button>
      </template>
    </div>
    <div class="LevelsPanel__caption">Levels</div>
  </div>
</template>

<script lang="ts">
import { useStarsStore, useUiStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'LevelsPanel',
  computed: {
    ...mapStores(useStarsStore, useUiStore)
  },
  methods: {
    select(selectedLevel: number) {
      const selectedLevels = this.starsStore.levelsFilter;
      const updatedLevels = selectedLevels.includes(selectedLevel)
        ? selectedLevels.filter(level => level !== selectedLevel)
        : [...selectedLevels, selectedLevel];

      this.starsStore.setLevelsFilter(updatedLevels);
    }
  }
};
</script>

<style scoped src="./LevelsPanel.css"></style>
