<template>
  <div class="RealMode">
    <transition name="fade">
      <template v-if="uiStore.star.starPanel !== null">
        <StarPanel
          :starId="uiStore.star.starPanel.starId"
          :scale="uiStore.star.starPanel.scale"
          @callStarBoost="uiStore.star.showStarBoostPanel"
          @close="goToGalaxy"
        />
      </template>
    </transition>

    <transition name="fade">
      <template v-if="uiStore.overlay.visible">
        <div class="gui-overlay" @click="hideAllPanels" />
      </template>
    </transition>

    <transition name="fade">
      <template v-if="uiStore.star.starTooltip !== null">
        <StarTooltipV2
          :star="uiStore.star.starTooltip.star"
          :position="uiStore.star.starTooltip.position"
          @hide="uiStore.star.hideStarTooltip"
          @hideButtonHover="$client.onHover()"
          @diveIn="uiStore.star.diveIn"
          @diveInButtonHover="$client.onHover()"
        />
      </template>
    </transition>

    <template v-for="starGame in uiStore.star.starGameInitList" :key="starGame.id">
      <StarDefenderProcess 
        v-if="stardefender === 'SEARCH GAME' || stardefender === 'PLAY WITH A BOT' || stardefender === 'DUEL'"
        :selectedMenu="stardefender"
        :position="starGame.position2d"
      />   
      <StarDefenderButton
        v-else-if="uiStore.star.starGameVisible && uiStore.star.starTooltip == null"
        :title="starGame.gameTitle"
        :name="starGame.starName"
        :position="starGame.position2d"
        @click="showStarDefender"
        @showStarTooltip="showStarTooltip"
      />
    </template>

    <transition name="fade">
      <template v-if="uiStore.star.starBoostPanel !== null">
        <StarBoostPanel
          :starId="uiStore.star.starBoostPanel.starId"
          :type="uiStore.star.starBoostPanel.type"
          @hide="uiStore.star.hideStarBoostPanel"
          @hover="$client.onHover()"
        />
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { useUiStore } from '@/stores';
import { StarBoostPanel, StarPanel, StarTooltipV2, StarDefenderButton, StarDefenderProcess } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'RealMode',
  components: {
    StarBoostPanel,
    StarPanel,
    StarTooltipV2,
    StarDefenderButton,
    StarDefenderProcess
  },
  computed: {
    ...mapStores(useUiStore),
    stardefender() {
      return this.uiStore.stardefender.starDefenderMenu
    }
  },
  methods: {
    showStarTooltip() {
      const starData = {
        id: this.uiStore.star.starGameInitList[0].id,
        owner: 'owner',
        params: {
          name: this.uiStore.star.starGameInitList[0].starName,
          isLive: true,
          creation: 121,
          updated: 121,
          level: 12,
          fuel: 12,
          levelUpFuel: 1,
          fuelSpendings: 1,
          habitableZoneMin: 1,
          habitableZoneMax: 1,
          planetSlots: 1,
          mass: 1,
          race:  "Waters",
          coords: {
              X: 1,
              Y: 1,
              Z: 1
          }
        }
      }
      this.uiStore.star.showStarTooltip({
        eventName: "SHOW_STAR_PREVIEW",
        starData: starData,
        pos2d: this.uiStore.star.starGameInitList[0].position2d
      }, 500);
    },
    hideAllPanels() {
      if (!this.uiStore.overlay.active) return;
      this.uiStore.star.hideStarBoostPanel();
      this.uiStore.star.hideStarTooltip();
    },

    goToGalaxy() {
      this.uiStore.star.hideStarPanel();
      this.$client.onLeftPanelGalaxyClick();
    },

    showStarDefender() {
      console.log('showStarDefender')
      this.uiStore.stardefender.setStarDefenderMenu('MAIN MENU');
    },
    
    unmounted() {
      this.uiStore.star.hideStarPanel();
      this.hideAllPanels();
    },
  },
  watch: {
    'uiStore.star.starGameInitList': {
      deep: true,
      handler() {
        this.$forceUpdate();
      }
    }
  }
}
</script>

<style scoped src="./RealMode.css"></style>
