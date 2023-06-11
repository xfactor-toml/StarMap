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
      <img class="StarCreationPanel__preview" :src="star.preview" />
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
            <div class="StarCreationPanel__price">{{ fetching ? '' : starPrice }}</div>
            <div class="StarCreationPanel__currency">plasma</div>
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
            <div class="StarCreationPanel__price">{{ fetching ? '' : wallet }}</div>
            <div class="StarCreationPanel__currency">plasma</div>
          </div>
        </div>
      </template>
      <div class="StarCreationPanel__group">
        <template v-if="notice">
          <div class="StarCreationPanel__notice" v-html="notice" />
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
          <!-- <button class="StarCreationPanel__button" @click="approve" @mouseenter="$emit('hover')">
          Approve
        </button> -->
        </template>
      </div>
    </div>
    <div class="StarCreationPanel__footer" />
  </div>
</template>

<script lang="ts">
import { Star } from '@/models';
import { PropType } from 'vue';

export default {
  name: 'StarCreationPanel',
  props: {
    star: {
      type: Object as PropType<Star>
    }
  },
  data: () => ({
    starName: '',
    connected: true,
    fetching: false,
    wallet: 10,
    starPrice: 0,
    ready: false
  }),
  computed: {
    canBuy() {
      return this.wallet > 0 || this.starPrice <= this.wallet;
    },
    notice() {
      if (this.fetching) {
        return '';
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
    }
  },
  methods: {
    create() {
      this.$emit('create');
    },
    approve() {
      this.$emit('approve');
    }
  },
  async mounted() {
    this.fetching = true;
    // this.connected = await this.$wallet.connect();

    this.$wallet.getBalance();

    if (this.connected) {
      this.$refs.input?.focus();
    }

    this.fetching = false;
  }
};
</script>

<style scoped src="./StarCreationPanel.css"></style>
