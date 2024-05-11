<template>
  <div class="BattleResultsMode">
    <template v-if="results">
      <div class="BattleResultsMode__header">
        <div class="BattleResultsMode__status" :data-type="results.type" />
      </div>
      <div class="BattleResultsMode__body">
        <div class="BattleResultsMode__player">
          Player: {{ getShortAddress(results.player) }}
        </div>
        <div class="BattleResultsMode__owner">
          Owner: {{ getShortAddress(results.owner) }}
        </div>
        <div class="BattleResultsMode__rows">
          <div class="BattleResultsMode__row" v-for="item in rows" :key="item.key">
            <div class="BattleResultsMode__label">{{ item.label }}:</div>
            <div class="BattleResultsMode__value">{{ item.value }}</div>
          </div>
          <div class="BattleResultsMode__row" key="rating">
            <div class="BattleResultsMode__label">Raiting changed:</div>
            <div class="BattleResultsMode__value is-rating">
              {{ formatNumber(results.rating.current) }}
              <span :class="`BattleResultsMode__ratingChange ${ratingIncreased ? 'is-increased' : ''}`">{{
                Math.abs(ratingChange) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="BattleResultsMode__footer">
        <Loader v-if="loading" />
        <template v-else>
          <button
            v-if="results.box.show"
            class="BattleResultsMode__button"
            @click="openBox"
          >Open Box lv.{{ results.box.level }}
          </button>
          <button
            v-if="results.claim.show"
            class="BattleResultsMode__button"
            @click="claim"
          >Claim rewards
          </button>
          <button
            v-if="!results.box.show && !results.claim.show"
            class="BattleResultsMode__button"
            @click="close"
          >Close
          </button>
        </template>
      </div>
    </template>
    <template v-else>Not found</template>
  </div>
</template>

<script lang="ts">
import { useBattleStore, useUiStore, useScenesStore } from '@/stores';
import { getShortAddress, formatNumber } from '@/utils';
import { mapStores } from 'pinia'; 
import { Loader } from '@/components';
import { UISceneNames } from '@/types';

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
    ratingChange() {
      return this.results.rating.current - this.results.rating.prevoius
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
    this.uiStore.blur.enable()
  },
  beforeUnmount() {
    this.uiStore.blur.disable()
  }
};
</script>

<style scoped src="./BattleResultsMode.css"/>
