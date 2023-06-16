<template>
  <div
    class="StarBoostPanel"
    :class="{
      'is-fetching': fetching,
      'is-connected': connected
    }"
    ref="tooltip"
  >
    <div class="StarBoostPanel__header">
      <div class="StarBoostPanel__title">Boost {{ type }}.</div>
      <button
        class="StarBoostPanel__close"
        type="button"
        title="close"
        @click="$emit('hide')"
        @mouseenter="$emit('hover')"
      />
    </div>
    <div class="StarBoostPanel__body">
      <template v-if="connected">
        <div class="StarBoostPanel__group">
          <div class="StarBoostPanel__level">
            <div class="StarBoostPanel__level-progress">
              <div class="StarBoostPanel__level-value">400 / 1000</div>
            </div>
          </div>
        </div>
        <div class="StarBoostPanel__group">
          <div class="StarBoostPanel__label is-white">Plasma - {{ plasma * 2 }}</div>
          <div class="StarBoostPanel__slider">
            <PlasmaSlider v-model="plasma" />
          </div>
        </div>
        <div class="StarBoostPanel__group">
          <div class="StarBoostPanel__label">Available in the wallet:</div>
          <div
            class="StarBoostPanel__wallet"
            :class="{
              'is-blocked': !canBuy
            }"
          >
            <div class="StarBoostPanel__price is-balance">
              <template v-if="!fetching">{{ roundNumber(balance) }}</template>
            </div>
            <div class="StarBoostPanel__currency">{{ currency }}</div>
          </div>
        </div>
      </template>
      <div class="StarBoostPanel__group">
        <button class="StarBoostPanel__button">Boost {{ type }}.</button>
      </div>
      <template v-if="type === 'exp'">
        <div class="StarBoostPanel__group">
          <button class="StarBoostPanel__button is-yellow" disabled>Level up</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { roundNumber } from '@/utils';
import { Star } from '@/models';
import { PlasmaSlider } from '@/components';
import { useSettingsStore, useStarsStore } from '@/stores';
import { mapStores } from 'pinia';
import { PropType } from 'vue';
import { StarBoostPanelType } from '@/types';

export default {
  name: 'StarBoostPanel',
  components: {
    PlasmaSlider
  },
  props: {
    star: {
      type: Object as PropType<Star>,
      required: true
    },
    type: {
      type: String as PropType<StarBoostPanelType>,
      default: 'exp'
    }
  },
  data: () => ({
    plasma: 0,
    approved: false,
    balance: 0,
    connected: true,
    creationCost: 0,
    createdStar: null,
    creating: false,
    fetching: false,
    installed: false
  }),
  computed: {
    ...mapStores(useSettingsStore, useStarsStore),
    currency() {
      return this.$wallet.currency;
    },
    canBuy() {
      return this.balance > 0 && this.balance >= this.creationCost;
    }
  },
  methods: {
    roundNumber,
    async approve() {
      const approvedPlasma = await this.$wallet.approvePlasma(this.creationCost);

      this.approved = approvedPlasma >= this.creationCost;
    },
    async create() {
      this.creating = true;

      const createdStar = await this.$wallet.createStar(
        this.starName,
        this.starPosition.galaxy.toContractFormat()
      );

      this.creating = false;

      if (createdStar === null) {
        return;
      }

      this.createdStar = new Star(createdStar);
      this.starsStore.addStar(this.createdStar);
      this.settingsStore.hideStarTooltip();

      this.$client.onStarCreated(this.createdStar);
    }
  },
  async mounted() {
    this.fetching = true;
    this.balance = await this.$wallet.getBalance();
    this.creationCost = await this.$wallet.getCreationCost();
    this.installed = this.$wallet.installed;
    this.connected = this.$wallet.connected;
    this.fetching = false;
  }
};
</script>

<style src="./StarBoostPanel.css"></style>
