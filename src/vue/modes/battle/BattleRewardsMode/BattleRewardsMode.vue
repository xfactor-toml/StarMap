<template>
  <div class="BattleRewardsMode">
    <div class="BattleRewardsMode__image"/>
    <div class="BattleRewardsMode__content">
      <template v-if="rewards.list.length">
        <div class="BattleRewardsMode__label">Reward:</div>
        <div class="BattleRewardsMode__rewards">
          <template
            v-for="(reward, index) in rewards.list"
            :key="reward.name + index"
          >
            <div class="BattleRewardsMode__reward" >
              <img
                class="BattleRewardsMode__pic"
                :src="reward.image"
              />
              <div class="BattleRewardsMode__caption">
                {{ reward.name }}
              </div>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="BattleRewardsMode__title"/>
      </template>
    </div>
    <div class="BattleRewardsMode__footer">
      <button
        class="BattleRewardsMode__button"
        @click="$client.onCloseBox"
      >Close
    </button>
  </div>
  </div>
</template>

<script lang="ts">
import { useBattleStore, useUiStore } from '@/stores';
import { mapStores } from 'pinia'; 

export default {
  name: 'BattleRewardsMode',
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
  }
};
</script>

<style scoped src="./BattleRewardsMode.css"/>
