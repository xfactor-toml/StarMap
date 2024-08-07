<template>
  <div class="BattleShop">
    <header>
      <GoldScore :score="battleStore.process.state.gold" @click="scoreClose" />
    </header>
    <div class="BattleShop__row">
      <div v-for="item in array1" :key="item.id">
        <TradingItem :id="item.id" :detail="item.detail" :special="item.special" :hide="item.hide" @itemShow="handleTradingShow"
          :tradingStatus="getTradingStatus(item.id)">
          <BaseItem :name="item.name" :id="item.id" :detail="item.detail"
            :tradingStatus="getTradingStatus(item.id)" :descriptionText="BattleItemCards[item.id].description"
            @itemDescription="handleItemDescription" @itemViewClose="handleItemViewClose" />
        </TradingItem>
      </div>
    </div>
    <hr class="BattleShop__interval">
    <div class="BattleShop__row">
      <div v-for="item in array2" :key="item.id">
        <TradingItem :id="item.id" :detail="item.detail" :special="item.special" :hide="item.hide" @itemShow="handleTradingShow"
          :tradingStatus="getTradingStatus(item.id)">
          <BaseItem :name="item.name" :id="item.id" :detail="item.detail"
            :tradingStatus="getTradingStatus(item.id)" :descriptionText="BattleItemCards[item.id].description"
            @itemDescription="handleItemDescription" @itemViewClose="handleItemViewClose" />
        </TradingItem>
      </div>
    </div>
  </div>
  <BattleItemCard v-if="itemCardShow" :title="this.BattleItemCards[selectedItemId].name"
    :description="this.BattleItemCards[selectedItemId].description" :image="this.BattleItemCards[selectedItemId].src"
    :price="this.BattleItemCards[selectedItemId].price" :tradingStatus="getTradingStatus(selectedItemId)" @close="close"
    @buy="buy" @sell="sell" />
  <ConfirmPopup v-if="confirmation" :title="'Are you sure you want to make this purchase?'"
    @close="confirmResolver(false)" @confirm="confirmResolver(true)" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GoldScore } from './score/inex';
import { BaseItem } from './item';
import { TradingItem } from './trading';
import { BattleItemStatusType } from '@/types';
import { BattleItemCard } from '../BattleItemCard';
import { BattleItemCards } from '@/constants';
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
      items: [
        { name: 'thunder', hide: false, detail: false, special: false, id: 0 },
        { name: 'velocityVector', hide: false, detail: false, special: false, id: 1 },
        { name: 'nuclearOrb', hide: false, detail: false, special: false, id: 2 },
        { name: 'spiralSentinel', hide: false, detail: false, special: false, id: 3 },
        { name: 'accelerationAmulet', hide: false, detail: false, special: false, id: 4 },
        { name: 'surgesSpire', hide: false, detail: false, special: false, id: 5 },
        { name: 'momentumMatrix', hide: false, detail: false, special: false, id: 6 },
        { name: 'quantumBooster', hide: false, detail: false, special: false, id: 7 }
      ] as BattleItemStatusType[],
      itemCardShow: false,
      confirmation: false,
      confirmResolver: null,
      selectedItemId: null,
      BattleItemCards
    };
  },
  computed: {
    array1() {
      return this.items.filter(item => item.id < 4);
    },
    array2() {
      return this.items.filter(item => item.id >= 4);
    },
    ...mapStores(useBattleStore)
  },
  emits: ['scoreClose'],
  methods: {
    getTradingStatus(itemId) {
      return this.battleStore.shop.state.items.some(status => status.id === itemId);
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
      this.items.forEach((item) => {
        item.hide = false;
        item.detail = false;
        item.special = false;
      });
      if (hideMap[id]) {
        if (id == 2 || id == 6) {
          this.items[id + 1].special = true
        }
        this.items[id].detail = true;
        hideMap[id].forEach((hideId) => {
          this.items[hideId].hide = true;
        });
      }
      this.items = [...this.items];

    },

    handleItemViewClose(id: number) {
      this.items.forEach((item) => {
        item.hide = false;
        item.detail = false;
        item.special = false;
      });
      this.items = [...this.items];
    },

    handleTradingShow(id) {
      this.itemCardShow = true,
        this.selectedItemId = id
    },

    async buy() {
      const confirmed = await this.confirm();
      if (confirmed) {
        if (this.battleStore.shop.state.items.length < 2) {
          if (this.battleStore.process.state.gold >= BattleItemCards[this.selectedItemId].price) {
            const gold = this.battleStore.process.state.gold - BattleItemCards[this.selectedItemId].price;
            this.battleStore.shop.addItem(this.selectedItemId);
            this.battleStore.process.setGold(gold);
            this.itemCardShow = false;
            toast('Buy successful!', {
              type: 'success',
              autoClose: 2000,
            });
          }
          else {
            this.itemCardShow = false;
            toast('Insufficient gold!', {
              type: 'error',
              autoClose: 2000,
            });
          }
        }
        else {
          this.itemCardShow = false;
          toast('You can not buy two more items!', {
            type: 'error',
            autoClose: 2000,
          });
        }
      }
    },

    async sell() {
      const confirmed = await this.confirm();
      if (confirmed) {
        const gold = this.battleStore.process.state.gold + BattleItemCards[this.selectedItemId].price;
        this.battleStore.shop.sellItem(this.selectedItemId);
        this.battleStore.process.setGold(gold);
        this.itemCardShow = false;
        toast('Sell successful!', {
          type: 'success',
          autoClose: 2000,
        });
      }
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
      this.itemCardShow = false,
        this.selectedItemId = null
    },

    scoreClose() {
      this.$emit('scoreClose')
    }
  }
}
);
</script>

<style scoped src="./BattleShop.css"></style>