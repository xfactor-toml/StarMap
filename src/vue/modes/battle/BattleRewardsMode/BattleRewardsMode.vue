<template>
  <transition name="fade">
    <div class="BattleRewardsMode">
      <div class="BattleRewardsMode__container">
        <template v-if="rewards.waitingBox">
          <div class="BattleRewardsMode__loader">
            <Loader />
          </div>
        </template>
        <template v-else>
          <img src="/gui/images/battle-results/reward-bg.svg">
          <div class="BattleRewardsMode__container-content">        
            <div class="BattleRewardsMode__closebtn" @click="$client.onCloseBox">
                <img src="/gui/images/shop-menu/close.svg" />
              </div>
            <div class="BattleRewardsMode__header">
              <h1 class="BattleRewardsMode__title orbitron-font --semi-bold ">REWARD</h1>
              <div class="BattleRewardsMode__img">
                <img src="/gui/images/battle-results/reward-icon.svg" />
              </div>
            </div>
            <div class="BattleRewardsMode__content">
              <template v-if="rewards.list.length">
                <div class="BattleRewardsMode__rewards">
                  <template v-for="(reward, index) in rewards.list" :key="reward.name + index">
                    <div class="BattleRewardsMode__reward">
                      <img src="/gui/images/battle-results/reward-item-bg.svg">
                      <div class="BattleRewardsMode__rewardTile">
                        <img class="BattleRewardsMode__rewardImage" :src="reward.image" />
                      </div>
                      <div class="BattleRewardsMode__caption">
                        <p>{{ reward.name }}</p>
  
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else>
                <button class="BattleRewardsMode__button" @click="rewards.openBox" />
              </template>
            </div>
            <div class="BattleRewardsMode__footer">
              <div class="BattleResultsMode__button white orbitron-font --semi-bold" @click="$client.onCloseBox">
                <img src="/gui/images/battle-results/play-again.svg">
                <div class="orbitron-font --semi-bold">OK</div>
              </div>
              <!-- <button class="BattleRewardsMode__close" @click="$client.onCloseBox">Close
            </button> -->
            </div>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { useBattleStore, useUiStore } from '@/stores';
import { Loader } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'BattleRewardsMode',
  components: {
    Loader
  },
  computed: {
    ...mapStores(useBattleStore, useUiStore),
    rewards() {
      return this.battleStore.rewards
    },
  },
  mounted() {
    this.uiStore.blur.enable()
  },
  beforeUnmount() {
    this.uiStore.blur.disable()
  },
  unmounted() {
    this.rewards.reset()
  }
};
</script>

<style scoped src="./BattleRewardsMode.css" />
