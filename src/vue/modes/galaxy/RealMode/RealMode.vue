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

    <template v-for="starGame in uiStore.star.starGameInitList">
      <StarDefenderProcess 
        v-if="stardefender == 'SEARCH GAME' || stardefender == 'PLAY WITH A BOT' || stardefender == 'DUEL WAITING'"
        :position="uiStore.star.starGameInitList[0].position2d"
        />   

      <StarDefenderButton
        v-else="uiStore.star.starGameVisible "
        :title="starGame.gameTitle"
        :name="starGame.starName"
        :position="starGame.position2d"
        @click="showStarDefender"
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
     return  this.uiStore.stardefender.starDefenderMenu
   }
  },
  methods: {
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
    this.uiStore.stardefender.setStarDefenderMenu('MAIN MENU');
    },
    
    unmounted() {
      this.uiStore.star.hideStarPanel();
      this.hideAllPanels();
    },
 
}
}
</script>

<style scoped src="./RealMode.css"></style>
