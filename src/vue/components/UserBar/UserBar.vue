<template>
  <div
    class="UserBar"
    :class="{ connected: walletStore.connected }"
  >
    <div class="UserBar__buttons">
      <button
        :class="`UserBar__button is-box ${userInventoryVisible && 'active'}`"
        :data-count="userBoxes.length"
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
    >{{ walletStore.login }}
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
   
  </div>
  <transition name="fade">
    <div class="bar-icon">
      <button
          :class="`UserBar__button is-box ${userInventoryVisible && 'active'}`"
          :data-count="userBoxes.length"
          @mouseenter="$client.onHover()"
          @click="openUserInventory"/>
      <div
        v-if="walletStore.connected"
        class="UserBar__account"
        @click="showUserMenu"
      >{{ walletStore.login }}
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
      <div>
          <div v-if="userMenuVisible" class="UserMenu__body">
            <transition name="fade">     
              <div class="UserMenu__content">
                  <img src="/gui/images/menu-border.svg">
                  <div class="UserMenu__icons">
                    <div v-for="item in items" :key="item" @click="selected(item)"
                    class="UserMenu__icon"
                    :class="[ currentTab === item ? 'active' : '.']"
                    >
                        <img :src="`/gui/images/${item}.svg`">
                    </div>
                  </div>
                  <div class="UserMenu__separate__line">
                      <img src="/gui/images/menu-bar-line.svg">
                  </div>
              </div>          
             </transition>
           
              <SearchInput  
              v-if="searchVisible"
              v-click-outside="hideSearchField"
              v-model="searchKey"
              @close="closeSearchField" />

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
       </div>
    </div>
    
  </transition>
  <transition name="fade">
    <UserInventoryPopup
      v-click-outside="hideUserInventory"
      v-if="userInventoryVisible"
      @close="hideUserInventory"
    />
  </transition>
  
    
</template>

<script lang="ts">
import { SettingsPopup } from '@/components/SettingsPopup';
import { SearchInput } from '@/components/SearchInput';
import { UserInventoryPopup } from '@/components/UserInventoryPopup';
import { useSettingsStore, useUiStore, useWalletStore, useBattleStore } from '@/stores';
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
    userMenuVisible: false,
    searchKey: '',
    items: ["search", "settings","wallet","log-out","close"],
    currentTab: null,
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
      useWalletStore,
      useBattleStore
    ),
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
    selected(card) {
      this.currentTab = card;
      switch (card) {
        case 'search':
          return this.searchVisible = true;
          break;
        case 'settings':
          return this.settingsVisible = true;
          break;
        case 'wallet':
          return this.walletStore.openPopup();
          break;
        case 'log-out':
          return this.walletStore.reset();
          break;
        case 'close':
          return this.userMenuVisible = false;
          break;
      }    
    },
    showUserMenu() {
       this.userMenuVisible = true;
    }
  },

};
</script>

<style scoped src="./UserBar.css"></style>
