<template>
  <div class="UserInventoryPopup">
    <div v-if="!showBoxConent" class="UserInventoryPopup__box">
      <div class="UserInventoryPopup__body">
        <div class="UserInventoryPopup__body-image">
          <img src="/gui/images/user-inventory/background.png">
          <div class="UserInventoryPopup__title --bold">
            {{ title }}
          </div>
          <div class="UserInventoryPopup__close" @click="$emit('close')" />
          <div class="UserInventoryPopup__balance">
            BALANCE: {{ balance }} tVRP 
          </div>
          <div class="UserInventoryPopup__tabs">
            <button v-for="tab in tabs" 
              :key="tab"
              :class="['UserInventoryPopup__tab', tab, currentTab === tab ? 'active' : '.', !tab ? 'empty-tab' : '']"
              :data-count="userBoxes.length" :disabled="!tab" :assets-count="assets.length"
              :events-count="events.length" 
              @click="selectTab(tab)" />
          </div>
          <div :class="`UserInventoryPopup__content ${currentTab}`">
            <template v-if="currentTab === 'inventory'">
              <template v-if="walletStore.connected">
                <div class="UserInventoryPopup__list">
                  <template v-for="item in assets" :key="item.name">
                    <div class="UserInventoryPopup__card">
                      <img :src="`/gui/images/user-inventory/inventory/${item.rare}.svg`" />
                      <div class="UserInventoryPopup__cardName">
                        {{item.name }}
                      </div>
                      <div class="UserInventoryPopup__cardFigure">
                        <img class="UserInventoryPopup__cardImage" :src="item.image" />
                      </div>
                      <div class="UserInventoryPopup__cardCaption"> 
                        {{ item.value }} VRP
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else>
                <button class="UserInventoryPopup__connect" @click="walletStore.openPopup">
                  Connect
                </button>
              </template>
            </template>
            <template v-if="currentTab === 'events'">
              <div 
                v-if="loading || buying" 
                class="UserInventoryPopup__loader in-store"
              >
                <Loader />
              </div>
              <div v-else class="UserInventoryPopup__list">
                <template v-for="item in events" :key="item.id">
                  <div 
                    class="UserInventoryPopup__card is-store" 
                    :data-rare="item.rareness.toLowerCase()"
                    :data-amount="item.per_user">
                    <img :src="`/gui/images/user-inventory/shop/${item.rareness.toLowerCase()}.svg`" />
                    <div class="UserInventoryPopup__cardFigure" @click="selectCard(item)">
                      <img class="UserInventoryPopup__cardImage" :src="item.img_preview" />
                    </div>
                    <div v-if="item.per_user !== null" class="UserInventoryPopup__cardCount">
                      Name | {{ item.per_user}}
                    </div>
                    <div class="UserInventoryPopup__cardCaption" @click="buy(item)">
                        <div  class="UserInventoryPopup__cardCaption-button">
                          {{ item.cost }} {{ item.currency }}
                        </div>               
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
          <div class="UserInventoryPopup__content_openbox">
            <template v-if="currentTab === 'unboxing'">
              <template v-if="rewards.waitingBox">
                <div class="UserInventoryPopup__loader">
                  <Loader />
                </div>
              </template>
              <template v-else>
                <div class="UserInventoryPopup__open-box">
                  <div class="UserInventoryPopup__count">
                    <img src="/gui/images/user-inventory/open-box.svg">
                    <div class="UserInventoryPopup__count-text">
                      {{ userBoxes.length }}
                    </div>
                  </div>
                  <div class="UserInventoryPopup__animation">
                    <div class="UserInventoryPopup__button" @click="openBox">
                      <img src="/gui/images/user-inventory/inventory/open-box.svg"> 
                      <div class="UserInventoryPopup__button-text">
                        OPEN BOX
                      </div>
                      <div v-for="(item , indes) in 8" class="UserInventoryPopup__button-animation">
                        <img src="/gui/images/user-inventory/open-box-animation.svg"> 
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
    <InventoryCardPopup 
      v-if="selectedCard" 
      :title="selectedCard.item" 
      :description="selectedCard.description"
      :image="selectedCard.img_full" 
      :type="selectedCard.type" @buy="buy(selectedCard)" 
      @close="selectCard(null)" />
    <transition name="fade">
      <BoxContentPopup 
        v-if="boxContent.length > 0 && showBoxConent" 
        :list="boxContent" 
        @close="resetBoxes()" 
      />
    </transition>
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
      events:[],
      loading: false,
      buying: false,
      confirmation: false,
      confirmResolver: null,
      balance: 0,
      currentTab: 'inventory',
      selectedCard: null,
      boxContent: [],
      showBoxConent: false,
      assets: [],
      title: 'INVENTORY'
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
      if (tab === 'inventory')
        this.title = 'INVENTORY';
      else if (tab === 'events')
        this.title = 'GALAXY SHOP';
      else
        this.title = 'OPEN BOX';
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
    sortStoreItems(items) {
      const order = {
        Common: 1,
        Rare: 2,
        Mythic: 3,
        Legendary: 4,
      }

      return items.sort((a, b) => {
        return order[a.rareness] - order[b.rareness]
      })
    },
    async buy(item) {
      const confirmed = await this.confirm()

      if (confirmed) {
        this.selectCard(null)
        this.buying = true

        const service = BlockchainConnectService.getInstance()

        await service.store.BuyItem({
          telegramInitData: String(service.telegramInitData),
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
      this.showBoxConent = true
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
        service.store.GetUserItemBalanceAll(String(service.telegramAuthData.id))
      ])

      const balancesMap = Object.fromEntries(balances.map((item) => [item.itemId, item.balance]))
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

      const recalcEvents = events.map(event => ({
        ...event,
        per_user: event.per_user ? event.per_user - (balancesMap[event.id] || 0) : event.per_user
      }))

      this.balance = userAssets.token || 0
      this.assets = [...mapAssets(userAssets), ...storeAssets]
      this.events = this.sortStoreItems(recalcEvents)

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
      this.showBoxConent = false
      this.$emit('close')
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
