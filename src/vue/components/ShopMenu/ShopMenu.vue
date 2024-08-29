<template>
    <div class="container">
        <div class="ShopMenu">
            <img src="/gui/images/shop-menu/background.svg" />
            <div class="ShopMenu__close" @click="closeShopMenu">
                <img src="/gui/images/shop-menu/close.svg" />
            </div>
            <div class="ShopMenu__content">
                <h3 class="ShopMenu__title orbitron-font --semi-bold">
                    SHOP
                </h3>
                <input class="ShopMenu__filter" placeholder="FILTER">
                <div class="ShopMenu__items">
                    <div
                        v-for="(item, index) in this.items"
                        @click="handleItemClick(index)"
                        :key="index"
                        class="ShopMenu__item"     
                    >
                        <img src="/gui/images/shop-menu/item-background.svg" />
                        <div class="ShopMenu__item-img">
                            <img :src="ImagePath[index]"/>
                        </div>
                        <div 
                            v-if="this.selectedItem == index && !pendingList.has(index)" 
                            class="ShopMenu__item-trading"
                        >
                            <div
                                v-if="!purchasedList.has(index)"
                                @click="buy(index)"
                                :class="['ShopMenu__item-buy orbitron-font --semi-bold', { 'disabled': !canBuy(items[index]) }]"
                            >
                                BUY
                            </div>

                            <div
                                v-else
                                @click="sell(index)"
                                :class="['ShopMenu__item-buy orbitron-font --semi-bold']"
                            >
                                SELL
                            </div>

                            <div
                                class="ShopMenu__item-info orbitron-font --semi-bold" 
                                @click="showInfo(index)"
                            >
                                INFO
                            </div>
                            
                        </div>
                        <div class="ShopMenu__item-content exo2-font" >
                            <h5 class="ShopMenu__item-name"> 
                                {{ item.name }}
                            </h5>
                            <Loader
                               v-if="pendingList.has(index)"
                               class="ShopMenu__loading"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div 
                v-if="shopInfoVisible" 
                class="ShopInfo__container"
            >
                <div class="ShopInfo">
                    <img src="/gui/images/shop-menu/background.svg"/>
                    <div class="ShopInfo__close" @click="closeShopInfo">
                        <img src="/gui/images/shop-menu/close.svg" />
                    </div>
                     <div class="ShopInfo__content orbitron-font --semmi-bold">
                         <h3 class="ShopInfo__title orbitron-font --semmi-bold">
                            INFO
                        </h3>
                         <h4 class="ShopInfo__subtitle orbitron-font --semmi-bold">
                            TITLE
                        </h4>
                         <p class="ShopInfo__description"> 
                            {{ items[this.selectedItem]?.description }}
                        </p>
                         <div class="ShopInfo__button">
                            <img src="/gui/images/shop-menu/shopInfo-btn.svg">
                            <div class="ShopInfo__button-name orbitron-font --semmi-bold">
                                {{ items[this.selectedItem]?.price }} GOLD
                            </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
    <ConfirmPopup 
        v-if="confirmation"
        :title="'Are you sure you want to make this purchase?'"
        @close="confirmResolver(false)"
        @confirm="confirmResolver(true)"
    />
</template>


<script lang="ts">
import { mapStores } from 'pinia';
import { useBattleStore } from '@/stores';
import { BattleItemStatusType } from '@/types';
import { ConfirmPopup } from '../ConfirmPopup';
import { Loader } from '../Loader';
import { default as vClickOutside } from 'click-outside-vue3';

export default {
    name: "ShopMenu",
    components: {
        ConfirmPopup,
        Loader
    },
    data() {
        return {
            itemsStates: {} as Record<string, BattleItemStatusType>,
            selectedItem: null, 
            shopInfoVisible: false,
            shopMenuVisible: true,
            confirmation: false,
            confirmResolver: null,
            ImagePath: [
                "/assets/battleIcon/thunder.png",
                "/assets/battleIcon/velocityVector.png",
                "/assets/battleIcon/nuclearOrb.png",
                "/assets/battleIcon/spiralSentinel.png"
            ]
        };
    },

    directives: {
         clickOutside: vClickOutside.directive
    },

    computed: {
        items() {
            return this.battleStore.shop.items
        },
        pendingList() {
            return this.battleStore.shop.pendingList
        },
        purchasedList() {
            return this.battleStore.shop.purchasedList
        },
        ...mapStores(useBattleStore)
    },
 
    methods: {
        handleItemClick(index: number) {
            this.selectedItem = index
        },
        showInfo(index: number) {
            this.shopInfoVisible = true;
        },
        closeShopMenu() {
            this.$emit('closeShopMenu')
        },
        closeShopInfo() {
            this.shopInfoVisible = false;
            this.selectedItem = null;
        },
        handleOutClick() {
            this.selectedItem = null
        },
        canBuy(item) {
            return this.battleStore.process.state.gold >= item.price && this.battleStore.shop.purchasedItemsArray.length < 2
        },
        async buy( index ) {
            const confirmed = await this.confirm();
            if (confirmed) {
                this.battleStore.shop.addToPendingList(index);
                this.$client.onBuyBattleItemClick(index);
            }
        },

        async sell( index) {
            const confirmed = await this.confirm();
            if (confirmed) {
                this.battleStore.shop.addToPendingList(index);
                this.$client.onSellBattleItemClick(index);
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
    },

}

</script>

<style scoped src="./ShopMenu.css"></style>