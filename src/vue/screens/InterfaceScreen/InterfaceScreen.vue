<template>
  <div class="InterfaceScreen">
    <div class="InterfaceScreen__content">
      <component :is="mode" />
    </div>
    <div class="InterfaceScreen__logo">
      <Logo />
    </div>
    <div class="InterfaceScreen__userbar">
      <UserBar />
    </div>
    <template v-if="settingsStore.mode.views.length">
      <div class="InterfaceScreen__views">
        <ViewsPanel />
      </div>
    </template>
    <transition name="fade">
      <template v-if="settingsStore.view === 'galaxy'">
        <div class="InterfaceScreen__levels">
          <LevelsPanel />
        </div>
      </template>
    </transition>
    <div class="InterfaceScreen__modes">
      <ModesPanel />
    </div>
  </div>
</template>

<script lang="ts">
import { LevelsPanel, Logo, ModesPanel, UserBar, ViewsPanel } from '@/components';
import { PhantomMode, RealMode } from '@/modes';
import { useSettingsStore, useClientStore } from '@/stores';
import { mapStores } from 'pinia';
import { GuiModeName } from '@/types';
import { Component } from 'vue';

export default {
  name: 'InterfaceScreen',
  components: {
    LevelsPanel,
    Logo,
    ModesPanel,
    UserBar,
    ViewsPanel
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
