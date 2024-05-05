<template>
  <div class="UserInventoryPopup">
    <div
      class="UserInventoryPopup__overlay"
      @click="$emit('close')"
    />
    <div class="UserInventoryPopup__box">
      <div class="UserInventoryPopup__head">
        <div class="UserInventoryPopup__title">Open box</div>
      </div>
      <div class="UserInventoryPopup__balance">Balance VRP: {{  balance  }}</div>
      <div class="UserInventoryPopup__body">
        <div class="UserInventoryPopup__tabs">
          <button 
            v-for="tab in tabs"
            :key="tab"
            :class="['UserInventoryPopup__tab', tab, currentTab === tab ? 'active' : '']"
            @click="selectTab(tab)"
          />
        </div>
        <div :class="`UserInventoryPopup__content ${currentTab}`">
          <template v-if="currentTab === 'inventory'">
            <template v-for="item in inventory" :key="item.id">
              <div
                class="UserInventoryPopup__card"
                @click="selectCard(item)"
              >
                <div class="UserInventoryPopup__cardFigure">
                  <img class="UserInventoryPopup__cardImage" :src="item.icon"/>
                </div>
                <div class="UserInventoryPopup__cardCaption">{{ item.count }}</div>
              </div>
            </template>
          </template>
          <template v-if="currentTab === 'events'">
            <template v-for="item in events" :key="item.id">
              <div
                class="UserInventoryPopup__card"
                @click="selectCard(item)"
              >
                <div class="UserInventoryPopup__cardFigure">
                  <img class="UserInventoryPopup__cardImage" :src="item.icon"/>
                </div>
                <div class="UserInventoryPopup__cardCaption">{{ item.price }} vrp</div>
              </div>
            </template>
          </template>
          <template v-if="currentTab === 'unboxing'">
            <template v-if="rewards.waitingBox">
              <div class="UserInventoryPopup__loader">
                <Loader/>
              </div>
            </template>
            <template v-else>
              <div class="UserInventoryPopup__count">{{ userBoxes }}</div>
              <button
                class="UserInventoryPopup__button"
                @click="openBox"
              />
            </template>
          </template>
        </div>
      </div>
    </div>
    <InventoryCardPopup
      v-if="selectedCard"
      :title="selectedCard.title"
      :description="selectedCard.description"
      :image="selectedCard.image"
      :type="selectedCard.type"
      @close="selectCard(null)"
    />
    <BoxContentPopup
      v-if="boxContent.length > 0"
      :list="boxContent"
      @close="resetBoxes()"
    />
  </div>
</template>

<script lang="ts">
import { inventory, events } from './data'
import { BoxContentPopup, InventoryCardPopup, Loader } from '@/components'
import { useBattleStore } from '@/stores';
import { mapStores } from 'pinia';

const baseTabs = ['inventory','events']

export default {
  name: 'UserInventoryPopup',
  components: {
    BoxContentPopup,
    InventoryCardPopup,
    Loader,
  },
  data() {
    return {
      inventory,
      events,
      balance: 2180923,
      currentTab: 'inventory',
      selectedCard: null,
      boxContent: []
    }
  },
  computed: {
    ...mapStores(
      useBattleStore,
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
  methods: {
    selectTab(tab) {
      this.currentTab = tab
    },
    selectCard(card) {
      this.selectedCard = card
    },
    async openBox() {
      this.boxContent = await this.rewards.openBox()
    },
    resetBoxes() {
      this.boxContent = []
    }
  }
};
</script>

<style scoped src="./UserInventoryPopup.css"></style>
