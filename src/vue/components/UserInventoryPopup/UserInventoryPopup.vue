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
          <button
            v-for="tab in tabs"
            :key="tab"
            :class="['UserInventoryPopup__tab', tab, currentTab === tab ? 'active' : '']"
            :data-count="userBoxes.length"
            @click="selectTab(tab)"
          />
        </div>
        <div :class="`UserInventoryPopup__content ${currentTab}`">
          <template v-if="currentTab === 'inventory'">
            <template v-if="walletStore.connected">
              <div class="UserInventoryPopup__list">
                <template v-for="item in assets" :key="item.name">
                  <div class="UserInventoryPopup__card" :data-rare="item.rare">
                    <div
                      v-if="item.name === 'VRP' || item.name === 'Trends'"
                      class="UserInventoryPopup__cardName"
                    >{{ item.name }}
                    </div>
                    <div class="UserInventoryPopup__cardFigure">
                      <img class="UserInventoryPopup__cardImage" :src="item.image" />
                    </div>
                    <div class="UserInventoryPopup__cardCaption"> {{ item.value }}</div>
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <button class="UserInventoryPopup__connect" @click="walletStore.openPopup">Connect</button>
            </template>
          </template>
          <template v-if="currentTab === 'events'">
            <div v-if="loading || buying" class="UserInventoryPopup__loader in-store">
              <Loader />
            </div>
            <div v-else class="UserInventoryPopup__list">
              <template v-for="item in events" :key="item.id">
                <div class="UserInventoryPopup__card is-store" :data-rare="item.rareness.toLowerCase()">
                  <div class="UserInventoryPopup__cardFigure" @click="selectCard(item)">
                    <img class="UserInventoryPopup__cardImage" :src="item.img_preview" />
                    <div
                      v-if="item.per_user"
                      class="UserInventoryPopup__cardCount"
                    >{{ item.per_user }}
                    </div>
                  </div>
                  <div class="UserInventoryPopup__cardCaption" @click="buy(item)">{{ item.cost }} {{ getCurrencyByField(item.currency) }}</div>
                </div>
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
    <InventoryCardPopup
      v-if="selectedCard"
      :title="selectedCard.item"
      :description="selectedCard.description"
      :image="selectedCard.img_full"
      :type="selectedCard.type"
      @close="selectCard(null)"
    />
    <BoxContentPopup
      v-if="boxContent.length > 0"
      :list="boxContent"
      @close="resetBoxes()"
    />
    <ConfirmPopup
      v-if="confirmation"
      :title="'Are you sure you want to make this purchase?'"
      @close="confirmResolver(false)"
      @confirm="confirmResolver(true)"
    />
  </div>
</template>

<script lang="ts">
import { BoxContentPopup, ConfirmPopup, InventoryCardPopup, Loader } from '@/components'
import { useBattleStore, useWalletStore } from '@/stores';
import { mapAssets } from '@/utils';
import { mapStores } from 'pinia';
import { BlockchainConnectService } from '~/blockchainTotal';

const baseTabs = ['inventory', 'events']

export default {
  name: 'UserInventoryPopup',
  components: {
    BoxContentPopup,
    ConfirmPopup,
    InventoryCardPopup,
    Loader,
  },
  data() {
    return {
      events: [],
      loading: false,
      buying: false,
      confirmation: false,
      confirmResolver: null,
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
    async buy(item) {
      const confirmed = await this.confirm()

      if (confirmed) {
        this.buying = true

        const service = BlockchainConnectService.getInstance()

        await service.store.BuyItem({
          telegramData: service.telegramAuthData,
          itemId: item.id,
          amount: 1
        })

        await this.fetchAssets()

        this.buying = false
      }

    },
    async openBox() {
      this.boxContent = await this.rewards.openBox()
      this.fetchAssets()
    },
    async fetchAssets() {
      const service = BlockchainConnectService.getInstance()

      this.loading = true

      const [
        userAssets,
        events,
        balances
      ] = await Promise.all([
        this.$wallet.provider.getUserAssets(),
        service.store.GetStoreItems(),
        service.store.GetUserItemBalanceAll(service.TelegramLogin())
      ])

      const storeItemsMap = Object.fromEntries(events.map((item) => [item.id, item]))
      const storeAssets = balances.map(({ itemId, balance }) => {
        const storeAsset = storeItemsMap[itemId]

        if (!storeAsset) {
          return null
        }

        return {
          name: storeAsset.item,
          image: storeAsset.img_preview,
          rare: storeAsset.rareness.toLowerCase(),
          value: balance
        }
      }).filter(Boolean)

      this.balance = userAssets.token || 0
      this.assets = [...mapAssets(userAssets), ...storeAssets]
      this.events = events

      this.loading = false
    },
    async confirm() {
      this.confirmation = true
      const confirmed = await new Promise(resolve => {
        this.confirmResolver = resolve
      })
      this.confirmation = false
      return confirmed
    },
    resetBoxes() {
      this.boxContent = []
    },
  },
  async mounted() {
    if (this.$wallet.connected) {
      this.fetchAssets()
    }
  }
};
</script>

<style scoped src="./UserInventoryPopup.css"></style>
