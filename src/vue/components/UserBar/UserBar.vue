<template>
  <div class="UserBar" v-click-outside="hideSettings">
    <button
      class="UserBar__settings-button"
      :class="{ active: settingsVisible }"
      @mouseenter="$client.handleGuiEvent('hover')"
      @click="toggleSettings"
    />
    <div class="UserBar__settings-popup" v-if="settingsVisible">
      <SettingsPopup
        :fullscreen="settingsStore.fullscreen"
        :musicVolume="settingsStore.musicVolume"
        :sfxVolume="settingsStore.sfxVolume"
        @setMusicVolume="settingsStore.changeMusicVolume"
        @setSfxVolume="settingsStore.changeSfxVolume"
        @toggleFullscreen="$client.toggleFullscreen()"
        @volumeButtonClick="$client.handleGuiEvent('click')"
        @volumeButtonHover="$client.handleGuiEvent('hover')"
        @fullscreenToggleClick="$client.handleGuiEvent('click')"
        @fullscreenToggleHover="$client.handleGuiEvent('hover')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { SettingsPopup } from '@/components/SettingsPopup';
import { useSettingsStore } from '@/stores';
import { default as vClickOutside } from 'click-outside-vue3';
import { mapStores } from 'pinia';

export default {
  name: 'UserBar',
  components: {
    SettingsPopup
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data: () => ({
    settingsVisible: false
  }),
  computed: {
    ...mapStores(useSettingsStore)
  },
  methods: {
    toggleSettings() {
      this.$client.handleGuiEvent('click');
      this.settingsVisible = !this.settingsVisible;
    },
    hideSettings() {
      this.settingsVisible = false;
    }
  }
};
</script>

<style scoped src="./UserBar.css"></style>
