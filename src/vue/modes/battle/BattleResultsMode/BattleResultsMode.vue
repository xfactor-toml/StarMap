<template>
  <transition name="fade">

    <div class="BattleResultsMode">
      <template v-if="results">
        <div class="BattleResultMode__container" :data-type="results.type">
          <img :src="getImagePath" />
          <div class="BattleRewardsMode__closebtn" @click="close">
                <img src="/gui/images/shop-menu/close.svg"/>
          </div>
          <div class="BattleResultMode__container-content">
            <div class="BattleResultsMode__header">
              <h1 class="BattleResultsMode__title orbitron-font --semi-bold" :data-type="results.type">
                {{ title }}
              </h1>
              <h3 class="BattleResultsMode__player orbitron-font --medium">
                Player: {{ results.player }}
              </h3>
            </div>
            <div class="BattleResultsMode__body">
              <div class="BattleResultsMode__vs">
                <div class="BattleResultsMode__vs-player">
                  <img src="/gui/images/battle-results/player1.png" />
                  <div class="BattleResultsMode__vs-info">
                    <p class="BattleResultsMode__vs-info-owner --bold">LomaiPaletz</p>
                    <p class="BattleResultsMode__vs-info-level">1 LVL</p>
                  </div>
                </div>
                <h4 class="BattleResultsMode__vs-title">VS</h4>
                <div class="BattleResultsMode__vs-player">
  
                  <div class="BattleResultsMode__vs-info">
                    <p class="BattleResultsMode__vs-info-owner --bold">LomaiPaletz</p>
                    <p class="BattleResultsMode__vs-info-level">1 LVL</p>
                  </div>
                  <img src="/gui/images/battle-results/player1.png" />
                </div>
              </div>
              <div class="BattleResultsMode__rows">
                <div class="BattleResultsMode__row" v-for="item in rows" :key="item.key">
                  <div class="BattleResultsMode__value">{{ item.value }}</div>
                  <div class="BattleResultsMode__label">{{ item.label }}</div>
                  <div class="BattleResultsMode__value">{{ item.value }}</div>
                </div>
                <div class="BattleResultsMode__row" key="rating">
                  <div class="BattleResultsMode__value is-rating">
                    {{ formatNumber(results.rating.current) }}
                  </div>
                  <div class="BattleResultsMode__label">Raiting changed</div>
                  <div class="BattleResultsMode__value is-rating">
                    {{ formatNumber(results.rating.current) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="BattleResultsMode__footer">
              <Loader v-if="loading" />
              <template v-else>
                <div class="BattleResultsMode__button white orbitron-font --semi-bold" @click="openBox">
                  <img src="/gui/images/battle-results/play-again.svg">
                  <div class="orbitron-font --semi-bold">PLAY AGAIN</div>
                </div>
                <div v-if="results.box.show" class="BattleResultsMode__button orbitron-font --semi-bold">
                  <img src="/gui/images/battle-results/open-box.svg">
                  <div class="orbitron-font --semi-bold">OPEN BOX</div>
                </div>
                <!-- <button v-if="results.claim.show" class="BattleResultsMode__button" @click="claim">Claim rewards
              </button> -->
                <!-- <div v-if="!results.box.show && !results.claim.show" class="BattleResultsMode__button"
                @click="close">Close
            </div> -->
                <button v-if="!results.box.show" class="BattleResultsMode__button white orbitron-font --semi-bold"
                  @click="close">
                  <img src="/gui/images/battle-results/play-again.svg">
                  <div class="orbitron-font --semi-bold">EXIT</div>
                </button>
              </template>
            </div>
          </div>
        </div>
      </template>
      <template v-else>Not found</template>
    </div>
  </transition>
</template>

<script lang="ts">
import { useBattleStore, useUiStore, useScenesStore } from '@/stores';
import { getShortAddress, formatNumber } from '@/utils';
import { mapStores } from 'pinia';
import { Loader } from '@/components';
import { UISceneNames } from '@/types';
import { BattleResults } from '@/types';

export default {
  name: 'BattleResultsMode',
  components: {
    Loader
  },
  data: () => ({
    loading: false
  }),
  computed: {
    ...mapStores(useBattleStore, useUiStore, useScenesStore),
    results() {
      return this.battleStore.results.state
    },
    getImagePath() {
      if (this.battleStore.results.type == 'victory')
        return " /gui/images/battle-results/victory-bg.svg"
       
      else 
        return " /gui/images/battle-results/defeat-bg.svg"
    },

    ratingChange() {
      return this.results.rating.current - this.results.rating.previous
    },
    ratingIncreased() {
      return this.ratingChange >= 0
    },
    rows() {
      return [
        {
          key: 'damage',
          label: 'Damage done',
          value: formatNumber(this.results.demage)
        },
        {
          key: 'gold',
          label: 'Gold earner',
          value: formatNumber(this.results.gold)
        },
        {
          key: 'exp',
          label: 'Exp. received',
          value: formatNumber(this.results.exp)
        },
      ]
    },
    title() {
      if (this.battleStore.results.type == 'victory')
        return 'VICTORY'
      else
        return 'DEFEAT'
    }
  },
  methods: {
    getShortAddress,
    formatNumber,
    openBox() {
      this.loading = true
      this.$client.onOpenBox()
    },
    claim() {
      this.loading = true
      this.$client.onClaim()
    },
    close() {
      this.$client.onCloseBox()
    }
  },
  mounted() {
    // this.uiStore.blur.enable()
  },
  beforeUnmount() {
    // this.uiStore.blur.disable()
  }
};
</script>

<style scoped src="./BattleResultsMode.css" />
