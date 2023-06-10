<template>
  <div class="InterfaceScreen">
    <component :is="mode" class="InterfaceScreen__mode" />
    <Logo class="InterfaceScreen__logo" />
    <UserBar class="InterfaceScreen__userbar" />
  </div>
</template>

<script lang="ts">
import { Logo, SettingsPopup, StarPanel, Tooltip, UserBar } from '@/components';
import { PhantomMode, RealMode } from '@/modes';
import { useSettingsStore, useClientStore } from '@/stores';
import { mapStores } from 'pinia';
import { GuiModeName } from '@/types';
import { Component } from 'vue';

export default {
  name: 'InterfaceScreen',
  components: {
    Logo,
    SettingsPopup,
    StarPanel,
    Tooltip,
    UserBar
  },
  computed: {
    ...mapStores(useSettingsStore, useClientStore),
    mode() {
      const modes: Record<GuiModeName, Component | null> = {
        phantom: PhantomMode,
        real: RealMode,
        season: null
      };

      return modes[this.settingsStore.mode.name];
    }
  }
};
</script>

<style scoped src="./InterfaceScreen.css"></style>
