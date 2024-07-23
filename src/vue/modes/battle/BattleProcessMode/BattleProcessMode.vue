<template>
  <div class="BattleProcessMode">
    <button class="BattleProcessMode__settingsButton" :class="{ active: settingsPopupVisible }"
      @mouseenter="$client.onHover()" @click="toggleSettingsPopup" />
    <div class="BattleProcessMode__settingsPopup" v-if="settingsPopupVisible" v-click-outside="hideSettingsPopup">
      <SettingsPopup :fullscreen="uiStore.fullscreen.active" :musicVolume="settingsStore.volume.music"
        :sfxVolume="settingsStore.volume.sfx" :battle="true" @click="$client.onClick()" @hover="$client.onHover()"
        @setMusicVolume="settingsStore.volume.changeMusicVolume" @setSfxVolume="settingsStore.volume.changeSfxVolume"
        @toggleFullscreen="$client.toggleFullscreen()" @exitFromBattle="exitFromBattle" />
    </div>
    <div class="BattleProcessMode__content">
      <div v-for="player in [
        battleStore.process.players.connected,
        battleStore.process.players.current
      ]" class="BattleProcessMode__section">
        <template v-if="player" :key="player.address">
          <div class="BattleProcessMode__column">
            <div class="BattleProcessMode__caption">
              Player<br>{{ player.isNick ? player.address : getShortAddress(player.address) }}
            </div>
          </div>
          <div class="BattleProcessMode__column">
            <div class="BattleProcessMode__caption">
              Star<br>{{ player.star }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showBattleControlPanel" class="BattleProcessMode__panel">
        <BattleControlPanel :skills="battleStore.process.state.skills"
          :skillsPendingList="battleStore.process.skillsPendingList" :cooldown="battleStore.process.cooldown"
          :level="battleStore.process.state.level" :gold="battleStore.process.state.gold"
          :items="battleStore.shop.state.items"
          @setVisible="setBattleControlPanelVisible" @action="$client.onBattleAction" />
      </div>
    </transition>

    <transition name="fade">
      <div v-if="!showBattleControlPanel" class="BattleShop__panel">
        <BattleShop @scoreClose="setBattleControlPanelShow" />
      </div>
    </transition>
    
    <EmotionsSelect v-if="battleStore.emotions.selectorCoords" :coords="battleStore.emotions.selectorCoords"
      @select="$client.onEmotionSelect" @close="battleStore.emotions.closeSelector" />
    <PlayerEmotion v-if="battleStore.emotions.playerEmotion && !battleStore.emotions.selectorCoords"
      :type="battleStore.emotions.playerEmotion.type" :coords="battleStore.emotions.playerEmotion.coords"
      @close="battleStore.emotions.removePlayerEmotion" />
  </div>
</template>

<script lang="ts">
import { useBattleStore, useSettingsStore, useUiStore } from '@/stores';
import { BattleControlPanel, EmotionsSelect, PlayerEmotion, SettingsPopup } from '@/components';
import BattleShop from '@/components/BattleShop/BattleShop.vue';
import { getShortAddress } from '@/utils';
import { mapStores } from 'pinia';
import { default as vClickOutside } from 'click-outside-vue3';

export default {
  name: 'BattleProcessMode',
  components: {
    BattleControlPanel,
    EmotionsSelect,
    PlayerEmotion,
    SettingsPopup,
    BattleShop,
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      settingsPopupVisible: false,
      showBattleControlPanel: true,
    }
  },
  computed: mapStores(useBattleStore, useSettingsStore, useUiStore),
  methods: {
    getShortAddress,
    toggleSettingsPopup() {
      this.$client.onClick();
      this.settingsPopupVisible = !this.settingsPopupVisible;
    },
    hideSettingsPopup() {
      this.settingsPopupVisible = false;
    },
    exitFromBattle() {
      this.$client.onBattleExit()
      this.battleStore.process.reset()
    },
    setBattleControlPanelVisible() {
      this.showBattleControlPanel = !this.showBattleControlPanel;
    },
    setBattleControlPanelShow() {
      this.showBattleControlPanel = !this.showBattleControlPanel;
    }
  }
};
</script>

<style scoped src="./BattleProcessMode.css" />
