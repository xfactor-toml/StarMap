<template>
  <div
    class="StarCreationPanel"
    :class="{
      'is-fetching': fetching,
      'is-connected': connected
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
      <template v-if="connected">
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
              <template v-if="!fetching">{{ creationCost }}</template>
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
              <template v-if="!fetching">{{ balance }}</template>
            </div>
            <div class="StarCreationPanel__currency">{{ currency }}</div>
          </div>
        </div>
      </template>
      <div class="StarCreationPanel__group is-notice">
        <template v-if="errorMessage">
          <div class="StarCreationPanel__notice" v-html="errorMessage" />
        </template>
        <template v-else>
          <button
            class="StarCreationPanel__button"
            :disabled="!ready"
            @click="create"
            @mouseenter="$emit('hover')"
          >
            Create
          </button>
        </template>
      </div>
    </div>
    <div class="StarCreationPanel__footer" />
  </div>
</template>

<script lang="ts">
import { mobileUrl } from '~/blockchain/config';

export default {
  name: 'StarCreationPanel',
  data: () => ({
    balance: 0,
    connected: true,
    creationCost: 0,
    createdStar: null,
    fetching: false,
    installed: false,
    preview: './gui/images/phantom-star.png',
    starName: ''
  }),
  computed: {
    currency() {
      return this.$wallet.currency;
    },
    canBuy() {
      return this.balance > 0 && this.balance >= this.creationCost;
    },
    errorMessage() {
      if (this.fetching) {
        return '';
      }

      if (!this.installed) {
        return `Wallet not installed<br><a href="${mobileUrl}" target="_blank">install</a>`;
      }

      if (!this.connected) {
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
      return !this.fetching && !this.errorMessage.length;
    }
  },
  methods: {
    create() {
      this.$wallet.createStar(this.starName);
    }
  },
  async mounted() {
    this.fetching = true;
    this.balance = await this.$wallet.getBalance();
    this.creationCost = await this.$wallet.getCreationCost();
    this.installed = this.$wallet.installed;
    this.connected = this.$wallet.connected;

    if (this.connected) {
      this.$refs.input?.focus();
    }

    this.fetching = false;
  }
};
</script>

<style src="./StarCreationPanel.css"></style>
