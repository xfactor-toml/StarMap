<template>
  <div
    class="StarCreationPanel"
    :class="{
      'is-fetching': fetching,
      'is-connected': walletStore.connected
    }"
    ref="tooltip"
  >
    <div class="StarCreationPanel__header">
      <img class="StarCreationPanel__preview" :src="preview" />
      <div class="StarCreationPanel__create">Create star</div>
      <button
        class="StarCreationPanel__close"
        type="button"
        title="close"
        @click="$emit('hide')"
        @mouseenter="$emit('hover')"
      />
    </div>
    <div class="StarCreationPanel__body">
      <template v-if="walletStore.connected">
        <input
          ref="input"
          v-model="starName"
          class="StarCreationPanel__name"
          placeholder="Come up with a name for the star"
        />
        <div class="StarCreationPanel__group">
          <div class="StarCreationPanel__label">Cost:</div>
          <div class="StarCreationPanel__wallet">
            <div class="StarCreationPanel__price">
              <template v-if="!fetching">{{ roundNumber(creationCost) }}</template>
            </div>
            <div class="StarCreationPanel__currency">{{ currency }}</div>
          </div>
        </div>
        <div class="StarCreationPanel__group">
          <div class="StarCreationPanel__label">Available in the wallet:</div>
          <div
            class="StarCreationPanel__wallet"
            :class="{
              'is-blocked': !canBuy
            }"
          >
            <div class="StarCreationPanel__price is-balance">
              <template v-if="!fetching">{{ roundedBalance }}</template>
            </div>
            <div class="StarCreationPanel__currency">{{ currency }}</div>
          </div>
        </div>
      </template>
      <div
        class="StarCreationPanel__group"
        :class="{
          'is-notice': message
        }"
      >
        <template v-if="message">
          <div class="StarCreationPanel__notice" v-html="message" />
        </template>
        <template v-else-if="createdStar">
          <div class="StarCreationPanel__button">Created</div>
        </template>
        <template v-else>
          <template v-if="approved">
            <button
              class="StarCreationPanel__button"
              :disabled="!ready || creating"
              @click="create"
              @mouseenter="$emit('hover')"
            >
              {{ creating ? 'Pending...' : 'Create' }}
            </button>
          </template>
          <template v-else>
            <button
              class="StarCreationPanel__button"
              :disabled="!ready || approving"
              @click="approve"
              @mouseenter="$emit('hover')"
            >
              {{ approving ? 'Approving...' : 'Approve' }}
            </button>
          </template>
        </template>
      </div>
    </div>
    <div class="StarCreationPanel__footer" />
  </div>
</template>

<script lang="ts">
import { mobileUrl } from '~/blockchain/config';
import { roundNumber } from '@/utils';
import { PropType } from 'vue';
import { Star, StarPosition } from '@/models';
import { useSettingsStore, useStarsStore, useUiStore, useWalletStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  name: 'StarCreationPanel',
  props: {
    starPosition: {
      type: Object as PropType<StarPosition>
    }
  },
  data: () => ({
    approved: false,
    approving: false,
    balance: 0,
    creationCost: 0,
    createdStar: null,
    creating: false,
    fetching: false,
    preview: './gui/images/phantom-star.png',
    starName: ''
  }),
  computed: {
    ...mapStores(useSettingsStore, useStarsStore, useUiStore, useWalletStore),
    roundedBalance() {
      return roundNumber(this.balance, this.balance > 1000 ? 2 : 4);
    },
    currency() {
      return this.$wallet.currency;
    },
    canBuy() {
      return this.balance > 0 && this.balance >= this.creationCost;
    },
    message() {
      if (this.fetching) {
        return '';
      }

      if (!this.walletStore.installed) {
        return `Wallet not installed<br><a href="${mobileUrl}" target="_blank">install</a>`;
      }

      if (!this.walletStore.connected) {
        return 'Wallet not connected';
      }

      if (!this.starName) {
        return 'No name has been created<br>for the star';
      }

      if (!this.canBuy) {
        return 'Insufficient funds to purchase';
      }

      return '';
    },
    ready() {
      return !this.fetching && !this.message.length;
    }
  },
  methods: {
    roundNumber,
    async approve() {
      this.approving = true;

      const approvedPlasma = await this.$wallet.provider.approvePlasma(this.creationCost);

      this.approving = false;
      this.approved = approvedPlasma >= this.creationCost;
    },
    async create() {
      this.creating = true;

      const createdStar = await this.$wallet.provider.createStar(
        this.starName,
        this.starPosition.galaxy.toContractFormat()
      );

      this.creating = false;

      if (createdStar === null) {
        return;
      }

      this.createdStar = new Star(createdStar);
      this.starsStore.addStar(this.createdStar);
      this.uiStore.star.hideStarTooltip();

      this.$client.onStarCreated(this.createdStar);
    }
  },
  async mounted() {
    this.fetching = true;
    this.balance = await this.$wallet.provider.getBalance();
    this.creationCost = await this.$wallet.provider.getCreationCost();

    if (this.walletStore.connected) {
      (this.$refs.input as HTMLElement)?.focus();
    }

    this.fetching = false;
  }
};
</script>

<style src="./StarCreationPanel.css"></style>
