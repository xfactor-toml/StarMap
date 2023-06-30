<template>
  <div class="LevelsPanel" :class="{ 'is-hidden': hidden }">
    <button class="LevelsPanel__toggle" @click="togglePanel" />
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
import { useSettingsStore, useStarsStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'LevelsPanel',
  data: () => ({
    hidden: false
  }),
  computed: {
    ...mapStores(useSettingsStore, useStarsStore)
  },
  methods: {
    select(selectedLevel: number) {
      const selectedLevels = this.starsStore.levelsFilter;
      const updatedLevels = selectedLevels.includes(selectedLevel)
        ? selectedLevels.filter(level => level !== selectedLevel)
        : [...selectedLevels, selectedLevel];

      this.starsStore.setLevelsFilter(updatedLevels);
    },
    togglePanel() {
      this.hidden = !this.hidden;
    }
  }
};
</script>

<style scoped src="./LevelsPanel.css"></style>
