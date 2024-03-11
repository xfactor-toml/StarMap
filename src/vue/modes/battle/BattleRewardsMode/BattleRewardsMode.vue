<template>
  <div class="BattleRewardsMode">
    <div class="BattleRewardsMode__image"/>
    <template v-if="rewards.waitingBox">
      <div class="BattleRewardsMode__loader">
        <Loader/>
      </div>
    </template>
    <template v-else>
      <div class="BattleRewardsMode__content">
        <template v-if="rewards.list.length">
          <div class="BattleRewardsMode__label">Reward:</div>
          <div class="BattleRewardsMode__rewards">
            <template
              v-for="(reward, index) in rewards.list"
              :key="reward.name + index"
            >
              <div class="BattleRewardsMode__reward">
                <div class="BattleRewardsMode__rewardTile">
                  <img
                    class="BattleRewardsMode__rewardImage"
                    :src="reward.image"
                  />
                </div>
                <div class="BattleRewardsMode__caption">
                  {{ reward.name }}
                </div>
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <button
            class="BattleRewardsMode__button"
            @click="rewards.openBox"
          />
        </template>
      </div>
      <div class="BattleRewardsMode__footer">
        <button
          class="BattleRewardsMode__close"
          @click="$client.onCloseBox"
        >Close
        </button>
      </div>
    </template>
  </div>
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

<style scoped src="./BattleRewardsMode.css"/>
