<template>
  <div class="UserInventoryPopup">
    <div class="UserInventoryPopup__overlay" @click="$emit('close')" />
    <div class="UserInventoryPopup__box">
      <div class="UserInventoryPopup__head">
        <div class="UserInventoryPopup__title">Open box</div>
      </div>
      <div class="UserInventoryPopup__balance">Balance VRP: {{ balance }}</div>
      <div class="UserInventoryPopup__body">
        <div class="UserInventoryPopup__tabs">
          <button v-for="tab in tabs" :key="tab"
            :class="['UserInventoryPopup__tab', tab, currentTab === tab ? 'active' : '']" @click="selectTab(tab)" />
        </div>
        <div :class="`UserInventoryPopup__content ${currentTab}`">
          <template v-if="currentTab === 'inventory'">
            <template v-if="walletStore.connected">
              <div class="UserInventoryPopup__list">
                <template v-for="item in assets" :key="item.name">
                  <div class="UserInventoryPopup__card" :data-rare="item.rare">
                    <div class="UserInventoryPopup__cardFigure">
                      <img class="UserInventoryPopup__cardImage" :src="item.image" />
                    </div>
                    <div class="UserInventoryPopup__cardCaption">{{ item.value }}</div>
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <button class="UserInventoryPopup__connect" @click="walletStore.openPopup">Connect</button>
            </template>
          </template>
          <template v-if="currentTab === 'events'">
            <div class="UserInventoryPopup__list">
              <template v-if="eventsLoading">
                Loading...
              </template>
              <template v-else>
                <template v-for="item in events" :key="item.id">
                  <div class="UserInventoryPopup__card is-store" :data-rare="item.rareness" @click="selectCard(item)">
                    <div class="UserInventoryPopup__cardFigure">
                      <img class="UserInventoryPopup__cardImage" :src="item.img_preview" />
                    </div>
                    <div class="UserInventoryPopup__cardCaption">{{ item.cost }} {{ getCurrencyByField(item.currency) }}</div>
                  </div>
                </template>
              </template>
            </div>
          </template>
          <template v-if="currentTab === 'unboxing'">
            <template v-if="rewards.waitingBox">
              <div class="UserInventoryPopup__loader">
                <Loader />
              </div>
            </template>
            <template v-else>
              <div class="UserInventoryPopup__count">{{ userBoxes.length }}</div>
              <button class="UserInventoryPopup__button" @click="openBox" />
            </template>
          </template>
        </div>
      </div>
    </div>
    <InventoryCardPopup v-if="selectedCard" :title="selectedCard.item" :description="selectedCard.description"
      :image="selectedCard.img_full" :type="selectedCard.type" @close="selectCard(null)" />
    <BoxContentPopup v-if="boxContent.length > 0" :list="boxContent" @close="resetBoxes()" />
  </div>
</template>

<script lang="ts">
import { BoxContentPopup, InventoryCardPopup, Loader } from '@/components'
import { useBattleStore, useWalletStore } from '@/stores';
import { mapAssets } from '@/utils';
import { mapStores } from 'pinia';
import { BlockchainConnectService } from '~/blockchainTotal';

const baseTabs = ['inventory', 'events']

export default {
  name: 'UserInventoryPopup',
  components: {
    BoxContentPopup,
    InventoryCardPopup,
    Loader,
  },
  data() {
    return {
      events: [],
      eventsLoading: false,
      balance: 0,
      currentTab: 'inventory',
      selectedCard: null,
      boxContent: [],
      assets: [],
    }
  },
  computed: {
    ...mapStores(
      useBattleStore,
      useWalletStore,
    ),
    userBoxes() {
      return this.battleStore.rewards.boxesIds
    },
    rewards() {
      return this.battleStore.rewards
    },
    tabs() {
      return this.userBoxes.length > 0 ? [...baseTabs, 'unboxing'] : baseTabs
    }
  },
  watch: {
    'walletStore.connected'() {
      this.fetchAssets()
    }
  },
  methods: {
    selectTab(tab) {
      this.currentTab = tab
    },
    selectCard(card) {
      this.selectedCard = card
    },
    getCurrencyByField(aCurrency: 'token' | 'trends'): string {
      switch (aCurrency) {
        case 'token':
          return 'VRP';
          break;
        case 'trends':
          return 'Trends';
          break;
      }
    },
    async openBox() {
      this.boxContent = await this.rewards.openBox()
      this.fetchAssets()
    },
    async fetchAssets() {
      const userAssets = await this.$wallet.provider.getUserAssets()
      
      this.balance = userAssets.token || 0
      this.assets = mapAssets(userAssets)
    },
    async fetchEvents() {
      this.eventsLoading = true
      this.events = await BlockchainConnectService.getInstance().store.GetStoreItems()
      this.eventsLoading = false
    },
    resetBoxes() {
      this.boxContent = []
    },
  },
  async mounted() {
    if (this.$wallet.connected) {
      this.fetchAssets()
      this.fetchEvents()
    }
  }
};
</script>

<style scoped src="./UserInventoryPopup.css"></style>
