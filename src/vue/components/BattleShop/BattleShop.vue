<template>
  <div class="BattleShop">
    <header>
      <GoldScore
        :score="battleStore.process.state.gold"
        @click="scoreClose"
      />
    </header>
    <template
      v-for="(row, index) in rows"
      :key="index"
    >
      <hr
        v-if="index !== 0"
        class="BattleShop__interval"
      />
      <div class="BattleShop__row">
        <TradingItem
          v-for="item in row"
          :id="item.id"
          :detail="item.detail"
          :special="item.special"
          :hide="item.hide"
          :tradingStatus="getTradingStatus(item.id)"
          :loading="pendingList.has(item.id)"
          :canBuy="canBuy(item)"
          @itemShow="() => handleTradingShow(item)"
        >
          <BaseItem
            :name="item.name"
            :id="item.id"
            :detail="item.detail"
            :tradingStatus="getTradingStatus(item.id)"
            :descriptionText="item.description"
            @itemDescription="handleItemDescription"
            @itemViewClose="handleItemViewClose"
          />
        </TradingItem>
      </div>
    </template>
  </div>
  <BattleItemCard
    v-if="selectedItem"
    :title="selectedItem.name"
    :description="selectedItem.description"
    :icon="selectedItem.icon"
    :price="selectedItem.price"
    :canBuy="canBuy(selectedItem)"
    :tradingStatus="getTradingStatus(selectedItem.Id)"
    @buy="() => buy(selectedItem)"
    @sell="sell"
    @close="close"
  />
  <ConfirmPopup 
    v-if="confirmation"
    :title="'Are you sure you want to make this purchase?'"
    @close="confirmResolver(false)"
    @confirm="confirmResolver(true)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GoldScore } from './score/inex';
import { BaseItem } from './item';
import { TradingItem } from './trading';
import { BattleItemStatusType } from '@/types';
import { BattleItemCard } from '../BattleItemCard';
import { useBattleStore } from '@/stores';
import { mapStores } from 'pinia';
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup.vue';
import { toast } from 'vue3-toastify';

export default defineComponent({
  name: 'BattleShop',
  components: {
    BaseItem,
    TradingItem,
    GoldScore,
    BattleItemCard,
    ConfirmPopup,
  },
  data() {
    return {
      itemsStates: {} as Record<string, BattleItemStatusType>,
      confirmation: false,
      confirmResolver: null,
      selectedItem: null,
    };
  },
  computed: {
    items() {
      return this.battleStore.shop.items
    },
    pendingList() {
      return this.battleStore.shop.pendingList
    },
    rows() {
      const itemsInRows = 4

      return this.items.reduce((rows, item) => {
        const lastList = rows[rows.length - 1]
        const createNew = !lastList || lastList.length >= itemsInRows
        const currentList = createNew ? [] : lastList

        currentList.push(item)

        return createNew ? [...rows, currentList] : rows
      }, [])
    },
    ...mapStores(useBattleStore)
  },
  emits: ['scoreClose'],
  methods: {
    getTradingStatus(itemId) {
      return false
    },
    handleItemDescription(id: number) {
      const hideMap = {
        0: [1, 2],
        1: [2, 3],
        2: [0, 1],
        3: [1, 2],
        4: [5, 6],
        5: [6, 7],
        6: [4, 5],
        7: [5, 6],
      };
      Object.keys(this.itemsStates).forEach((key) => {
        this.itemsStates[key].hide = false;
        this.itemsStates[key].detail = false;
        this.itemsStates[key].special = false;
      });
      if (hideMap[id]) {
        if (id == 2 || id == 6) {
          this.itemsStates[id + 1].special = true
        }
        this.itemsStates[id].detail = true;
        hideMap[id].forEach((hideId) => {
          this.itemsStates[hideId].hide = true;
        });
      }
    },
    handleItemViewClose() {
      Object.keys(this.itemsStates).forEach((key) => {
        this.itemsStates[key].hide = false;
        this.itemsStates[key].detail = false;
        this.itemsStates[key].special = false;
      });
    },
    handleTradingShow(item) {
      this.selectedItem = item
    },
    async buy(item) {
      const confirmed = await this.confirm();

      if (confirmed) {
        this.battleStore.shop.addToPendingList(item.id);
        this.$client.onBuyBattleItemClick(item.id)
        this.close()
      }
    },
    async sell() {
      // const confirmed = await this.confirm();
      // if (confirmed) {
      //   const gold = this.battleStore.process.state.gold + BattleItemCards[this.selectedItemId].price;
      //   this.battleStore.shop.sellItem(this.selectedItemId);
      //   this.battleStore.process.setGold(gold);
      //   toast('Sell successful!', {
      //     type: 'success',
      //     autoClose: 2000,
      //   });
      // }
    },
    async confirm() {
      this.confirmation = true
      const confirmed = await new Promise(resolve => {
        this.confirmResolver = resolve
      })
      this.confirmation = false
      return confirmed
    },
    close() {
      this.selectedItem = null
    },
    scoreClose() {
      this.$emit('scoreClose')
    },
    canBuy(item) {
      return this.battleStore.process.state.gold >= item.price
    }
  },
  beforeMount() {
    this.itemsStates = Object.fromEntries(
      this.items.map((item) => [item.id, item])
    )
  }
});
</script>

<style scoped src="./BattleShop.css"></style>
