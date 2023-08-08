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
    <div
      v-if="walletStore.connected"
      class="UserBar__account"
    >{{ walletStore.shortAddress }}</div>
    <button
      v-else
      class="UserBar__button is-wallet"
      :class="{ active: settingsVisible }"
      @mouseenter="$client.onHover()"
      @click="connect"
    />
    <div
      class="UserBar__popup"
      v-if="settingsVisible"
      v-click-outside="hideSettingsPopup"
    >
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
import { SearchInput } from '@/components/SearchInput';
import { useSettingsStore, useWalletStore } from '@/stores';
import { default as vClickOutside } from 'click-outside-vue3';
import { mapStores } from 'pinia';

export default {
  name: 'UserBar',
  components: {
    SearchInput,
    SettingsPopup,
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data: () => ({
    settingsVisible: false,
    searchVisible: false,
    searchKey: ''
  }),
  watch: {
    searchKey() {
      this.$client.search(this.searchKey);
    }
  },
  computed: {
    ...mapStores(useSettingsStore, useWalletStore),
  },
  methods: {
    connect() {
      this.$wallet.connect();
    },
    toggleSettings() {
      this.$client.onClick();
      this.settingsVisible = !this.settingsVisible;
    },
    hideSettingsPopup() {
      this.settingsVisible = false;
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
  },
};

</script>

<style scoped src="./UserBar.css"></style>
