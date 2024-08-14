<template>
  <div class="LevelsPanel__mobile">
    <div v-if="uiStore.panels.visibility.levels" class="LevelsPanel">
      <div class="LevelsPanel__body">
        <div class="LevelsPanel__body-text">
          HEADING
        </div>
        <img src="/gui/images/modes/modes-active-background.png">
        <div class="LevelsPanel__body-content">
          <div class="LevelsPanel__group">
            <template v-for="level in starsStore.availableFilterLevels">
              <button class="LevelsPanel__button" :class="{
                [`is-level-${level.value}`]: true,
                'is-active': starsStore.levelsFilter.includes(level.value)
              }" @click="select(level.value)">
                {{ level.label }}
              </button>
            </template>
          </div>
        </div>
        <button class="LevelsPanel__toggle" @click="uiStore.panels.togglePanel('levels')" />

      </div>

    </div>

    <div v-if="!uiStore.panels.visibility.levels" class="LevelsPanel__start">
      <img src="/gui/images/modes/modes-start-background.svg">
      <div class="LevelsPanel__start-text">
        HEADING
      </div>
      <div class="LevelsPanel__start-icon" @click="uiStore.panels.togglePanel('levels')">
        <img src="/gui/images/modes/modes-toggle-button-revert.svg">
      </div>
    </div>
  </div>

  <div class="LevelsPanel__pc">
    <div class="LevelsPanel" :class="{ 'is-hidden': !uiStore.panels.visibility.levels }">
      <button class="LevelsPanel__toggle" @click="uiStore.panels.togglePanel('levels')" />
      <div class="LevelsPanel__group">
        <template v-for="level in starsStore.availableFilterLevels">
          <button class="LevelsPanel__button" :class="{
            [`is-level-${level.value}`]: true,
            'is-active': starsStore.levelsFilter.includes(level.value)
          }" @click="select(level.value)">
            {{ level.label }}
          </button>
        </template>
      </div>
      <div class="LevelsPanel__caption">Levels</div>
    </div>
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
