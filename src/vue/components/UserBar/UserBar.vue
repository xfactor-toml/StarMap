<template>
  <div
    class="UserBar"
    :class="{ connected: walletStore.connected }"
  >
    <button
      v-if="walletStore.connected"
      class="UserBar__button is-mint"
      @mouseenter="$client.onHover()"
      @click="$emit('openPlasmaMintPopup')"
    >Get plasma</button>
    <div class="UserBar__search">
      <div
        class="UserBar__search-field"
        v-if="searchVisible"
        v-click-outside="hideSearchField"
      >
        <SearchInput
          v-model="searchKey"
          @close="closeSearchField"
        />
      </div>
      <button
        class="UserBar__button is-search"
        :disabled="searchKey.length > 0"
        @mouseenter="$client.onHover()"
        @click="openSearchField"
      />
    </div>
    <button
      class="UserBar__button is-settings"
      :class="{ active: settingsVisible }"
      @mouseenter="$client.onHover()"
      @click="toggleSettings"
    />
    <template v-if="walletStore.connected">
      <template v-if="userBoxes.length > 0">
        <button
          class="UserBar__button is-box"
          :data-count="userBoxes.length"
          @mouseenter="$client.onHover()"
          @click="openBox"
        />
      </template>
      <div class="UserBar__account">
        {{ walletStore.shortAddress }}
      </div>
    </template>
    <button
      v-else
      class="UserBar__button is-wallet"
      :class="{ active: walletConnectVisible }"
      @mouseenter="$client.onHover()"
      @click="openWalletConnect"
    />
    <div
      class="UserBar__popup"
      v-if="walletConnectVisible"
    >
      <WalletConnectPopup
        @close="hideWalletConnect"
      />
    </div>
    <div
      class="UserBar__popup"
      v-if="settingsVisible"
      v-click-outside="hideSettingsPopup"
    >
      <SettingsPopup
        :fullscreen="uiStore.fullscreen.active"
        :musicVolume="settingsStore.volume.music"
        :sfxVolume="settingsStore.volume.sfx"
        @click="$client.onClick()"
        @hover="$client.onHover()"
        @setMusicVolume="settingsStore.volume.changeMusicVolume"
        @setSfxVolume="settingsStore.volume.changeSfxVolume"
        @toggleFullscreen="$client.toggleFullscreen()"
      />
    </div>
  </div>
</template>

<script lang="ts">

import { SettingsPopup } from '@/components/SettingsPopup';
import { SearchInput } from '@/components/SearchInput';
import { WalletConnectPopup } from '@/components/WalletConnectPopup';
import { useBattleStore, useScenesStore, useSettingsStore, useUiStore, useWalletStore } from '@/stores';
import { default as vClickOutside } from 'click-outside-vue3';
import { mapStores } from 'pinia';
import { SceneName } from '@/types';

export default {
  name: 'UserBar',
  components: {
    SearchInput,
    SettingsPopup,
    WalletConnectPopup,
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data: () => ({
    settingsVisible: false,
    searchVisible: false,
    searchKey: '',
    walletConnectVisible: false,
  }),
  watch: {
    searchKey() {
      this.$client.search(this.searchKey);
    }
  },
  computed: {
    ...mapStores(useBattleStore, useSettingsStore, useScenesStore, useUiStore, useWalletStore),
    userBoxes() {
      return this.battleStore.rewards.boxesIds
    }
  },
  methods: {
    toggleSettings() {
      this.$client.onClick();
      this.settingsVisible = !this.settingsVisible;
    },
    hideSettingsPopup() {
      this.settingsVisible = false;
    },
    openWalletConnect() {
      this.$client.onClick();
      this.walletConnectVisible = true
    },
    hideWalletConnect() {
      this.walletConnectVisible = false;
    },
    openSearchField() {
      if (!this.searchKey) {
        this.$client.onClick();
        this.searchVisible = true;
      }
    },
    hideSearchField() {
      if (!this.searchKey) {
        this.closeSearchField()
      }
    },
    closeSearchField() {
      this.searchVisible = false;
      this.searchKey = ''
    },
    openBox() {
      this.scenesStore.setScene(SceneName.Battle, {
        mode: 'rewards'
      });
    }
  },
};
</script>

<style scoped src="./UserBar.css"></style>
