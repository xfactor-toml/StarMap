<template>
  <div class="interface">
    <div class="interface__logo" />
    <div class="interface__settings" v-click-outside="hideSettings">
      <button
        class="interface__settings-button"
        :class="{ active: settingsVisible }"
        @mouseenter="$emit('settingsToggleHover')"
        @click="toggleSettings"
      />
      <div class="interface__settings-popup" v-if="settingsVisible">
        <SettingsPopup
          :fullscreen="fullscreen"
          :musicVolume="musicVolume"
          :sfxVolume="sfxVolume"
          @setMusicVolume="$emit('setMusicVolume', $event)"
          @setSfxVolume="$emit('setSfxVolume', $event)"
          @toggleFullscreen="$emit('toggleFullscreen')"
          @volumeButtonClick="$emit('volumeButtonClick')"
          @volumeButtonHover="$emit('volumeButtonHover')"
          @fullscreenToggleClick="$emit('fullscreenToggleClick')"
          @fullscreenToggleHover="$emit('fullscreenToggleHover')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SettingsPopup } from '../..';
import { default as vClickOutside } from 'click-outside-vue3';

export default {
  name: 'Interface',
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    },
    musicVolume: {
      type: Number,
      required: true
    },
    sfxVolume: {
      type: Number,
      required: true
    }
  },
  components: {
    SettingsPopup
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data: () => ({
    settingsVisible: false
  }),
  methods: {
    toggleSettings() {
      this.settingsVisible = !this.settingsVisible;
      this.$emit('settingsToggleClick');
    },
    hideSettings() {
      this.settingsVisible = false;
    }
  }
};
</script>

<style scoped src="./Interface.css"></style>
