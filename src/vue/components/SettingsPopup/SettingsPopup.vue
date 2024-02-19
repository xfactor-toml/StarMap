<template>
  <div class="settings-popup">
    <ul class="settings-popup__list">
      <li class="settings-popup__item">
        <span class="settings-popup__label">Music</span>
        <div class="settings-popup__controls">
          <VolumeControl
            :initialVolume="musicVolume"
            @change="$emit('setMusicVolume', $event)"
            @click="$emit('click')"
            @mouseenter="$emit('hover')"
          />
        </div>
      </li>
      <li class="settings-popup__item">
        <span class="settings-popup__label">Sfx</span>
        <div class="settings-popup__controls">
          <VolumeControl
            :initialVolume="sfxVolume"
            @change="$emit('setSfxVolume', $event)"
            @click="$emit('click')"
            @mouseenter="$emit('hover')"
          />
        </div>
      </li>
      <li class="settings-popup__item">
        <span class="settings-popup__label">Fullscreen</span>
        <div class="settings-popup__controls">
          <button
            class="settings-popup__fullscreen"
            :class="{ 'is-active': fullscreen }"
            @click="$emit('toggleFullscreen'), $emit('click')"
            @mouseenter="$emit('hover')"
          />
        </div>
      </li>
      <template v-if="battle">
        <li class="settings-popup__item">
          <button
            class="settings-popup__exit"
            @click="$emit('exitFromBattle'), $emit('click')"
            @mouseenter="$emit('hover')"
          >Exit</button>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import { VolumeControl } from '@/components/VolumeControl';

export default {
  name: 'SettingsPopup',
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
    },
    battle: {
      type: Boolean,
      default: false
    },
  },
  components: {
    VolumeControl
  },
  emits: [
    'click',
    'hover',
    'setMusicVolume',
    'setSfxVolume',
    'toggleFullscreen',
    'exitFromBattle'
  ],
};
</script>

<style scoped src="./SettingsPopup.css"></style>
