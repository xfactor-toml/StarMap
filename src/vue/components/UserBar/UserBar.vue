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
    <div class="UserBar__buttons">
      <button
        v-if="walletStore.connected"
        :class="`UserBar__button is-box ${userInventoryVisible && 'active'}`"
        @mouseenter="$client.onHover()"
        @click="openUserInventory"
      />
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
    </div>
    <div
      v-if="walletStore.connected"
      class="UserBar__account"
    >{{ walletStore.shortAddress }}
    </div>
    <button
      v-else
      class="UserBar__button is-wallet"
      :class="{ active: walletStore.popup }"
      @mouseenter="$client.onHover()"
      @click="walletStore.openPopup"
    />
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
    <UserInventoryPopup
      v-if="userInventoryVisible"
      @close="hideUserInventory"
    />
  </div>
</template>

<script lang="ts">
import { SettingsPopup } from '@/components/SettingsPopup';
import { SearchInput } from '@/components/SearchInput';
import { UserInventoryPopup } from '@/components/UserInventoryPopup';
import { useSettingsStore, useUiStore, useWalletStore } from '@/stores';
import { default as vClickOutside } from 'click-outside-vue3';
import { mapStores } from 'pinia';

export default {
  name: 'UserBar',
  components: {
    SearchInput,
    SettingsPopup,
    UserInventoryPopup,
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data: () => ({
    settingsVisible: false,
    searchVisible: false,
    userInventoryVisible: false,
    searchKey: '',
  }),
  watch: {
    searchKey() {
      this.$client.search(this.searchKey);
    }
  },
  computed: {
    ...mapStores(
      useSettingsStore,
      useUiStore,
      useWalletStore
    ),
  },
  methods: {
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
    openUserInventory() {
      this.userInventoryVisible = true
    },
    hideUserInventory() {
      this.userInventoryVisible = false
    },
  },
};
</script>

<style scoped src="./UserBar.css"></style>
