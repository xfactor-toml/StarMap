<template>
    <div class="BattleShop"> 
      <header>
        <GoldScore :score="0" />
      </header>
      <div class="BattleShop__row">
        <div v-for="item in items" :key="item.id" :class="{ isHide: item.hide }">
          <TradingItem :id="item.id" :detail="item.detail">
            <BaseItem 
              :name="item.name" 
              :hide="item.hide" 
              :id="item.id" 
              :detail="item.detail"
              @itemDescription="handleItemDescription" 
              @itemViewClose="handleItemViewClose"
            />
          </TradingItem>
        </div>
      </div>
  
      <hr class="BattleShop__interval">
  
      <div class="BattleShop__row">
        <AccelerationAmuletTrading />
        <SurgeSpiresTrading />
        <MomentumMatrixTrading />
        <QuantumBoosterTrading />
      </div>
    </div>
    
    <BattleItemCard
      v-if="itemCardShow"
      :title="this.BattleItemCards[this.id].name"
      :description="this.BattleItemCards[this.id].description"
      :image="this.BattleItemCards[this.id].src"
      :price="this.BattleItemCards[this.id].price"
      @close=""
      @buy="buy"
      @sell=""
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
  import { BattleItemCards } from '@/constants';
  import { useBattleStore } from '@/stores';
  import { mapStores } from 'pinia'; 
  import ConfirmPopup from '../ConfirmPopup/ConfirmPopup.vue';

  
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
          { name: 'thunder', hide: false, detail: false, buy: false, id: 0 },
          { name: 'velocityVector', hide: false, detail: false, buy: false, id: 1 },
          { name: 'surgesSpire', hide: false, detail: false, buy: false, id: 2 },
          { name: 'spiralSentinel', hide: false, detail: false, buy: false, id: 3 }
        ] as BattleItemStatusType[],
        itemCardShow: false,
        confirmation: false,
        confirmResolver: null,
        BattleItemCards
      };
    },
    computed: mapStores(useBattleStore),
    methods: {
      handleItemDescription(id: number) {
        const hideMap = {
          0: [1, 2],
          1: [2, 3],
          2: [0, 1],
          3: [1, 2]
        };
        this.items.forEach((item) => {
          item.hide = false;
          item.detail = false;
        });
        if (hideMap[id]) {
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
        });
        this.items = [...this.items];
      },
      handleBuyClick() {
      this.itemCardShow = true   
    },
    async buy() {
      const confirmed = await this.confirm();

      if(confirmed) {

      }
    },
    
    async confirm() {
        this.confirmation = true
        const confirmed = await new Promise(resolve => {
        this.confirmResolver = resolve
      })
      this.confirmation = false
      return confirmed
    }
  }
    }
  );
  </script>
  
  <style scoped src="./BattleShop.css"></style>
  