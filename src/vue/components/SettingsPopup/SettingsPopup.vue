<template>
  <div class="settings-popup">
    <ul class="settings-popup__list">
      <li class="settings-popup__item">
        <span class="settings-popup__label">Music</span>
        <div class="settings-popup__controls">
          <VolumeControl
            :initialVolume="musicVolume"
            @change="$emit('setMusicVolume', $event)"
            @click="$emit('volumeButtonClick')"
            @mouseenter="$emit('volumeButtonHover')"
          />
        </div>
      </li>
      <li class="settings-popup__item">
        <span class="settings-popup__label">Sfx</span>
        <div class="settings-popup__controls">
          <VolumeControl
            :initialVolume="sfxVolume"
            @change="$emit('setSfxVolume', $event)"
            @click="$emit('volumeButtonClick')"
            @mouseenter="$emit('volumeButtonHover')"
          />
        </div>
      </li>
      <li class="settings-popup__item">
        <span class="settings-popup__label">Fullscreen</span>
        <div class="settings-popup__controls">
          <button
            class="settings-popup__fullscreen"
            :class="{ 'is-active': fullscreen }"
            @click="$emit('toggleFullscreen'), $emit('fullscreenToggleClick')"
            @mouseenter="$emit('fullscreenToggleHover')"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { VolumeControl } from "../VolumeControl";

export default {
  name: "SettingsPopup",
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
    VolumeControl
  }
};
</script>

<style scoped src="./SettingsPopup.css"></style>
