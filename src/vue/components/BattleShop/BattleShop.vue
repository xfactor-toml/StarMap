<template>
    <div class="BattleShop">
      
      <header>
        <GoldScore />
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
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { GoldScore } from './score/inex';
  import { BaseItem } from './items/BaseItem';
  import { TradingItem } from './tradings/TradingItem';
  import { BattleItemStatusType } from '@/types';
  import {
    AccelerationAmuletTrading,
    SurgeSpiresTrading,
    MomentumMatrixTrading,
    QuantumBoosterTrading
  } from './tradings';
  
  export default defineComponent({
    name: 'BattleShop',
    components: {
      BaseItem,
      TradingItem,
      GoldScore,
      AccelerationAmuletTrading,
      SurgeSpiresTrading,
      MomentumMatrixTrading,
      QuantumBoosterTrading
    },
    data() {
      return {
        items: [
          { name: 'thunder', hide: false, detail: false, buy: false, id: 0 },
          { name: 'velocityVector', hide: false, detail: false, buy: false, id: 1 },
          { name: 'surgesSpire', hide: false, detail: false, buy: false, id: 2 },
          { name: 'spiralSentinel', hide: false, detail: false, buy: false, id: 3 }
        ] as BattleItemStatusType[]
      };
    },
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
      }
    }
  });
  </script>
  
  <style scoped src="./BattleShop.css"></style>
  