<template>
  <div class="LevelsPanel">
    <div class="LevelsPanel__group">
      <template v-for="level in levels">
        <button
          class="LevelsPanel__button"
          :class="{
            [`is-level-${level.id}`]: true,
            'is-active': selectedLevels.includes(level.id)
          }"
          @click="select(level.id)"
        >
          {{ level.label }}
        </button>
      </template>
    </div>
    <div class="LevelsPanel__caption">Levels</div>
  </div>
</template>

<script lang="ts">
import { LEVELS } from '@/constants';
import { useSettingsStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'LevelsPanel',
  data: () => ({
    selectedLevels: LEVELS.map(({ id }) => id),
    levels: [...LEVELS].reverse()
  }),
  computed: {
    ...mapStores(useSettingsStore)
  },
  methods: {
    select(selectedLevel: number) {
      this.selectedLevels = this.selectedLevels.includes(selectedLevel)
        ? this.selectedLevels.filter(level => level !== selectedLevel)
        : [...this.selectedLevels, selectedLevel];
    }
  }
};
</script>

<style scoped src="./LevelsPanel.css"></style>
