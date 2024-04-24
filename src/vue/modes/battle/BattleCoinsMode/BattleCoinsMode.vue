<template>
  <div class="BattleCoinsMode">
    <div class="BattleCoinsMode__image"/>
    <template v-if="rewards.waitingBox">
      <div class="BattleCoinsMode__loader">
        <Loader/>
      </div>
    </template>
    <template v-else>
      <div class="BattleCoinsMode__content">
        <div class="BattleCoinsMode__label">Reward:</div>
        <div class="BattleCoinsMode__rewards">
            <div class="BattleCoinsMode__reward">
              <div class="BattleCoinsMode__rewardTile">
                <img
                  class="BattleCoinsMode__rewardImage"
                  src="/gui/images/icons/coins.png"
                />
              </div>
              <div class="BattleCoinsMode__caption">
                +{{ rewards.coins }}
              </div>
            </div>
        </div>
      </div>
      <div class="BattleCoinsMode__footer">
        <button
          class="BattleCoinsMode__close"
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
  name: 'BattleCoinsMode',
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

<style scoped src="./BattleCoinsMode.css"/>
