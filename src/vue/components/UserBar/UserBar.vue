<template>
  <div class="UserBar" :class="{ connected: walletStore.connected }">
    <div class="UserBar__buttons">
      <button
        v-if="walletStore.connected"
        :class="['UserBar__button', 'is-box', { active: userInventoryVisible }]"
        :data-count="userBoxes.length"
        @mouseenter="$client.onHover()"
        @click="openUserInventory"
      />
      <div class="UserBar__search">
        <div
          v-if="searchVisible"
          class="UserBar__search-field"
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
    <div v-if="walletStore.connected" class="UserBar__account">
      {{ walletStore.login }}
    </div>
    <button
      v-else
      class="UserBar__button is-wallet"
      :class="{ active: walletStore.popup }"
      @mouseenter="$client.onHover()"
      @click="walletStore.openPopup"
    />
    <div
      v-if="settingsVisible"
      class="UserBar__popup"
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

  <transition name="fade">
    <div class="bar-icon">
      <button
      v-if="walletStore.connected"
      :class="['UserBar__button', 'is-box', { active: userInventoryVisible }]"
      :data-count="userBoxes.length"
      @mouseenter="$client.onHover()"
      @click="openUserInventory"
      />
      <div
        v-if="walletStore.connected"
        class="UserBar__account"
        @click="showUserMenu"
      >
        {{ walletStore.login }}
      </div>
      <button
        v-else
        class="UserBar__button menu-bar"
        @mouseenter="$client.onHover()"
        @click="showUserMenu"
      />
    </div>
  </transition>

  <transition name="fade">
    <div class="UserMenu">
      <transition name="fade">
        <div v-if="userMenuVisible" class="UserMenu__body">
          <div class="UserMenu__content">
            <img src="/gui/images/menu-border.svg" alt="Menu Border">
            <div class="UserMenu__icons">
              <div
                v-for="item in items"
                :key="item"
                @click="selected(item)"
                :class="['UserMenu__icon', { active: currentTab === item }]"
              >
                <img :src="`/gui/images/${item}.svg`" :alt="item">
              </div>
            </div>
            <div class="UserMenu__separate__line">
              <img src="/gui/images/menu-bar-line.svg" alt="Menu Bar Line">
            </div>
          </div>
          <div class="UserMenu__search">
            <div
              v-if="searchVisible"
              class="UserMenu__search-field"
              v-click-outside="hideSearchField"
            >
              <SearchInput
                v-model="searchKey"
                @close="closeSearchField"
              />
            </div>
          </div>
          
            <SettingsPopup
              v-if="settingsVisible"
              v-click-outside="hideSettingsPopup"
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
      </transition>
    </div>
  </transition>

  <transition name="fade">
    <UserInventoryPopup
      v-if="userInventoryVisible"
      v-click-outside="hideUserInventory"
      @close="hideUserInventory"
    />
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { default as vClickOutside } from 'click-outside-vue3';
import { SettingsPopup } from '@/components/SettingsPopup';
import { SearchInput } from '@/components/SearchInput';
import { UserInventoryPopup } from '@/components/UserInventoryPopup';
import { useSettingsStore, useUiStore, useWalletStore, useBattleStore } from '@/stores';

export default defineComponent({
  name: 'UserBar',
  components: {
    SearchInput,
    SettingsPopup,
    UserInventoryPopup,
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      settingsVisible: false,
      searchVisible: false,
      userInventoryVisible: false,
      userMenuVisible: false,
      searchKey: '',
      items: ["search", "settings", "wallet", "log-out", "close"],
      currentTab: null,
    };
  },
  computed: {
    ...mapStores(useSettingsStore, useUiStore, useWalletStore, useBattleStore),
    userBoxes() {
      return this.battleStore.rewards.boxesIds;
    }
  },
  watch: {
    searchKey() {
      this.$client.search(this.searchKey);
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
    openSearchField() {
      if (!this.searchKey) {
        this.$client.onClick();
        this.searchVisible = true;
      }
    },
    hideSearchField() {
      if (!this.searchKey) {
        this.closeSearchField();
      }
    },
    closeSearchField() {
      this.searchVisible = false;
      this.searchKey = '';
    },
    openUserInventory() {
      this.userInventoryVisible = true;
    },
    hideUserInventory() {
      this.userInventoryVisible = false;
    },
    selected(card) {
      this.currentTab = card;
      switch (card) {
        case 'search':
          this.searchVisible = true;
          break;
        case 'settings':
          this.settingsVisible = true;
          break;
        case 'wallet':
          this.walletStore.openPopup();
          break;
        case 'log-out':
          this.walletStore.reset();
          this.userMenuVisible = false;
          break;
        case 'close':
          this.userMenuVisible = false;
          break;
      }
    },
    showUserMenu() {
      this.userMenuVisible = true;
    }
  },
});
</script>

<style scoped src="./UserBar.css"></style>