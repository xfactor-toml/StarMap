<template>
  <Preloader v-if="settingsStore.screen === 'preloader'" />
  <WelcomeScreen
    v-if="settingsStore.screen === 'welcome'"
    :agreementAccepted="settingsStore.agreementAccepted"
    @run="state => emit('run', state)"
    @runButtonHover="emit('buttonHover', 'run')"
    @agreement="emit('agreement')"
    @agreementClick="handleAgreementClick"
    @agreementHover="emit('buttonHover', 'agreement')"
  />
  <Interface
    v-if="settingsStore.screen === 'interface'"
    :fullscreen="settingsStore.fullscreen"
    :musicVolume="settingsStore.musicVolume"
    :sfxVolume="settingsStore.sfxVolume"
    @setMusicVolume="settingsStore.changeMusicVolume"
    @setSfxVolume="settingsStore.changeSfxVolume"
    @toggleFullscreen="settingsStore.toggleFullscreen"
    @settingsToggleClick="emit('buttonClick', 'settings')"
    @settingsToggleHover="emit('buttonHover', 'settings')"
    @volumeButtonClick="emit('buttonClick', 'volume')"
    @volumeButtonHover="emit('buttonHover', 'volume')"
    @fullscreenToggleClick="emit('buttonClick', 'fullscreen')"
    @fullscreenToggleHover="emit('buttonHover', 'fullscreen')"
  />
  <transition name="fade">
    <div v-if="settingsStore.overlay" class="gui-overlay" @click="emit('overlayClick')" />
  </transition>
  <transition name="fade">
    <StarPanel
      v-if="elementsStore.starPanel.visible"
      :name="elementsStore.starPanel.data.name"
      :description="elementsStore.starPanel.data.description"
      :level="elementsStore.starPanel.data.level"
      :race="elementsStore.starPanel.data.race"
      :planetSlots="elementsStore.starPanel.data.planetSlots"
      :energy="elementsStore.starPanel.data.energy"
      :life="elementsStore.starPanel.data.life"
      :scale="elementsStore.starPanel.data.scale"
      :raceImageUrl="getRaceImage(elementsStore.starPanel.data.race, 'star-panel')"
      @hide="emit('buttonClick', 'starPanelHide')"
      @hideButtonHover="emit('buttonHover', 'starPanelHide')"
      @play="emit('buttonClick', 'starPanelPlay')"
      @playButtonHover="emit('buttonHover', 'starPanelPlay')"
    />
  </transition>
  <transition name="fade">
    <Tooltip
      v-if="elementsStore.tooltip.visible"
      :name="elementsStore.tooltip.data.name"
      :description="elementsStore.tooltip.data.description"
      :textAutofit="elementsStore.tooltip.data.textAutofit"
      :level="elementsStore.tooltip.data.level"
      :race="elementsStore.tooltip.data.race"
      :position="elementsStore.tooltip.data.pos2d"
      :scale="elementsStore.tooltip.data.scale"
      :raceImageUrl="getRaceImage(elementsStore.tooltip.data.race, 'tooltip')"
      @hide="emit('buttonClick', 'tooltipHide')"
      @hideButtonHover="emit('buttonHover', 'tooltipHide')"
      @diveIn="emit('buttonClick', 'tooltipDiveIn')"
      @diveInButtonHover="emit('buttonHover', 'tooltipDiveIn')"
    />
  </transition>
  <div class="version">v0.25</div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { Interface, Preloader, StarPanel, Tooltip, WelcomeScreen } from './components';
import { EventEmitterMixin } from './mixins/event-emitter';
import { useSettingsStore, useElementsStore } from './stores';
import { getRaceImage } from './helpers';

export default {
  name: 'App',
  components: {
    Interface,
    Preloader,
    StarPanel,
    Tooltip,
    WelcomeScreen
  },
  mixins: [EventEmitterMixin],
  computed: {
    ...mapStores(useSettingsStore, useElementsStore)
  },
  methods: {
    getRaceImage,
    handleAgreementClick(agreementAccepted: boolean) {
      this.settingsStore.acceptAgreement(agreementAccepted);
      this.emit('buttonClick', 'agreement');
    }
  }
};
</script>
