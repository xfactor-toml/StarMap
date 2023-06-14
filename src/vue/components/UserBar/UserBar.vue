<template>
  <div class="UserBar" v-click-outside="hideSettings">
    <button
      class="UserBar__button is-settings"
      :class="{ active: settingsVisible }"
      @mouseenter="$client.onHover()"
      @click="toggleSettings"
    />
    <button
      class="UserBar__button is-wallet"
      :class="{ active: settingsVisible }"
      :title="connected ? 'Connected' : 'Connect'"
      @mouseenter="$client.onHover()"
      @click="connect"
    />
    <div class="UserBar__popup" v-if="settingsVisible">
      <SettingsPopup
        :fullscreen="settingsStore.fullscreen"
        :musicVolume="settingsStore.musicVolume"
        :sfxVolume="settingsStore.sfxVolume"
        @setMusicVolume="settingsStore.changeMusicVolume"
        @setSfxVolume="settingsStore.changeSfxVolume"
        @toggleFullscreen="$client.toggleFullscreen()"
        @volumeButtonClick="$client.onClick()"
        @volumeButtonHover="$client.onHover()"
        @fullscreenToggleClick="$client.onClick()"
        @fullscreenToggleHover="$client.onHover()"
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
    ...mapStores(useSettingsStore),
    connected() {
      return this.$wallet.connected;
    }
  },
  methods: {
    connect() {
      this.$wallet.connect();
    },
    toggleSettings() {
      this.$client.onClick();
      this.settingsVisible = !this.settingsVisible;
    },
    hideSettings() {
      this.settingsVisible = false;
    }
  }
};
</script>

<style scoped src="./UserBar.css"></style>
