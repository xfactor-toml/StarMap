<template>
  <div class="ViewsPanel" :class="{ 'is-hidden': hidden }">
    <div class="ViewsPanel__group">
      <template v-for="view in settingsStore.mode.views">
        <button
          class="ViewsPanel__button"
          :class="[
            `is-${view.name}`,
            {
              'is-active': view.name === settingsStore.view,
              'is-disabled': !view.enabled
            }
          ]"
          @click="settingsStore.setView(view.name)"
        >
          {{ view.label }}
        </button>
      </template>
    </div>
    <button class="ViewsPanel__toggle" @click="toggle" />
  </div>
</template>

<script lang="ts">
import { useSettingsStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'ViewsPanel',
  data: () => ({
    hidden: false
  }),
  computed: {
    ...mapStores(useSettingsStore)
  },
  methods: {
    toggle() {
      this.hidden = !this.hidden;
    }
  }
};
</script>

<style scoped src="./ViewsPanel.css"></style>
