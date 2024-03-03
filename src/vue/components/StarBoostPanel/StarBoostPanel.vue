<template>
  <div class="StarBoostPanel" ref="tooltip">
    <div class="StarBoostPanel__header">
      <div class="StarBoostPanel__title">Boost {{ label }}</div>
      <button
        class="StarBoostPanel__close"
        type="button"
        title="close"
        @click="$emit('hide')"
        @mouseenter="$emit('hover')"
      />
    </div>
    <div class="StarBoostPanel__body">
      <div class="StarBoostPanel__group">
        <template v-if="fetching">
          <div class="StarBoostPanel__skeleton is-level" />
        </template>
        <template v-else>
          <div class="StarBoostPanel__level">
            <div class="StarBoostPanel__level-progress" :style="{ width: `${percent}%` }">
              <div class="StarBoostPanel__level-value">{{ current }} / {{ max }}</div>
            </div>
          </div>
        </template>
      </div>
      <template v-if="fetching">
        <div class="StarBoostPanel__group">
          <div class="StarBoostPanel__skeleton is-label" />
          <div class="StarBoostPanel__skeleton is-slider" />
        </div>
      </template>
      <template v-else>
        <div class="StarBoostPanel__group" v-if="!canLevelUp">
          <div class="StarBoostPanel__label is-white">Plasma - {{ requiredPlasma }}</div>
          <div class="StarBoostPanel__slider">
            <PlasmaSlider v-model="boostPercent" />
          </div>
        </div>
      </template>
      <div class="StarBoostPanel__group">
        <div class="StarBoostPanel__label">Available in the wallet:</div>
        <div
          class="StarBoostPanel__wallet"
          :class="{
            'is-blocked': !fetching && !canBuy
          }"
        >
          <template v-if="fetching">
            <div class="StarBoostPanel__skeleton is-balance" />
          </template>
          <template v-else>
            <div class="StarBoostPanel__price is-balance">
              {{ roundedBalance }}
            </div>
            <div class="StarBoostPanel__currency">{{ currency }}</div>
          </template>
        </div>
      </div>

      <div class="StarBoostPanel__group">
        <template v-if="fetching">
          <div class="StarBoostPanel__skeleton is-button" />
        </template>
        <template v-else>
          <template v-if="type === 'energy' || !canLevelUp">
            <template v-if="boostApproved">
              <button
                class="StarBoostPanel__button"
                :disabled="pending"
                @click="boost"
              >
                {{ pending ? 'Pending...' : `Boost ${label}` }}
              </button>
            </template>
            <template v-else>
              <button
                class="StarBoostPanel__button"
                :disabled="approving"
                @click="approve(requiredPlasma)"
              >
                {{ approving ? 'Approving...' : 'Approve ' }}
              </button>
            </template>
          </template>
        </template>
      </div>

      <template v-if="type === 'exp'">
        <div class="StarBoostPanel__group">
          <template v-if="fetching">
            <div class="StarBoostPanel__skeleton is-button" />
          </template>
          <template v-else>
            <template v-if="canLevelUp && !levelUpApproved">
              <button
                class="StarBoostPanel__button is-yellow"
                :disabled="!canLevelUp || approving"
                @click="approve(creationCost)"
              >
                {{ approving ? 'Approving...' : 'Approve' }}
              </button>
            </template>
            <template v-else>
              <button
                class="StarBoostPanel__button is-yellow"
                :disabled="!canLevelUp || levelUpPending"
                @click="levelUp"
              >
                {{ levelUpPending ? 'Pending...' : 'Level up' }}
              </button>
            </template>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { roundNumber } from '@/utils';
import { Star } from '@/models';
import { PlasmaSlider } from '@/components';
import { useStarsStore } from '@/stores';
import { mapStores } from 'pinia';
import { PropType } from 'vue';
import { StarBoostPanelType } from '@/types';

export default {
  name: 'StarNrgBoostPanel',
  components: {
    PlasmaSlider
  },
  props: {
    starId: {
      type: Number,
      required: true
    },
    type: {
      type: String as PropType<StarBoostPanelType>,
      default: 'exp'
    }
  },
  data: () => ({
    approving: false,
    allowed: 0,
    balance: 0,
    boostPercent: 50,
    creationCost: 0,
    fetching: false,
    pending: false,
    levelUpPending: false
  }),
  computed: {
    ...mapStores(useStarsStore),
    label() {
      return this.type === 'exp' ? 'exp' : 'nrg';
    },
    roundedBalance() {
      return roundNumber(this.balance, this.balance > 1000 ? 2 : 4);
    },
    star() {
      return this.starsStore.getById(this.starId);
    },
    max() {
      return this.type === 'exp' ? this.creationCost : 2.5;
    },
    current() {
      return this.type === 'exp' ? this.star.levelUpFuel : this.star.fuel;
    },
    percent() {
      return Math.min(this.current / (this.max / 100));
    },
    requiredAmount() {
      return roundNumber(Math.max(this.max - this.current, 0), 4, 'ceil');
    },
    requiredPlasma() {
      return roundNumber((this.requiredAmount * this.boostPercent) / 100, 4, 'ceil');
    },
    currency() {
      return this.$wallet.currency;
    },
    canBuy() {
      return this.balance > 0 && this.balance >= this.requiredAmount;
    },
    boostApproved() {
      return this.allowed >= this.requiredPlasma
    },
    canLevelUp() {
      return this.requiredAmount === 0;
    },
    levelUpApproved() {
      return this.allowed >= this.creationCost
    }
  },
  methods: {
    async approve(plasmaAmount) {
      this.approving = true;
      await this.$wallet.provider.approvePlasma(plasmaAmount);
      await this.fetchData()
      this.approving = false;
    },
    async boost() {
      this.pending = true;

      const boostMethod = {
        exp: 'refuelStarLevelUp',
        energy: 'refuelStarExistence'
      };

      const updatedStar = await this.$wallet.provider[boostMethod[this.type]](
        this.star.id,
        this.requiredPlasma
      );

      
      if (updatedStar) {
        this.starsStore.updateStar(new Star(updatedStar));
      }
      
      await this.fetchData();

      this.pending = false;
    },
    async levelUp() {
      this.levelUpPending = true;

      const updatedStar = await this.$wallet.provider.increaseStarLevel(this.starId);

      this.levelUpPending = false;

      if (updatedStar) {
        const star = new Star(updatedStar);

        this.starsStore.updateStar(star);
        this.$client.onStarUpdated(star);
      }

      this.fetchData();
    },
    async fetchData() {
      const [allowed, balance, creationCost] = await Promise.all([
        this.$wallet.provider.getAllowance(),
        this.$wallet.provider.getBalance(),
        this.$wallet.provider.getCreationCost(this.star.params.level + 1)
      ]);

      this.allowed = allowed;
      this.balance = balance;
      this.creationCost = creationCost;
    }
  },
  async mounted() {
    this.fetching = true;
    await this.fetchData();
    this.fetching = false;
  }
};
</script>

<style src="./StarBoostPanel.css"></style>
