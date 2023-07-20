<template>
  <div class="UserBar">
    <div class="UserBar__search">
      <div
        class="UserBar__search-field"
        v-if="searchVisible"
        v-click-outside="hideSearchField"
      >
        <SearchInput v-model="searchKey"/>
      </div>
      <button
        class="UserBar__button is-search"
        :class="{ active: searchVisible }"
        @mouseenter="$client.onHover()"
        @click="toggleSearch"
      />
    </div>
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
import { useSettingsStore } from '@/stores';
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
    toggleSearch() {
      this.$client.onClick();
      this.searchVisible = !this.searchVisible;
    },
    hideSettingsPopup() {
      this.settingsVisible = false;
    },
    hideSearchField() {
      this.searchVisible = false;
      this.searchKey = ''
    },
  }
};
</script>

<style scoped src="./UserBar.css"></style>
