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
                        v-for="(item, index) in 30"
                        :key="index"
                        class="ShopMenu__item"
                        @click="handleItemClick(index)"
                    >
                        <img src="/gui/images/shop-menu/item-background.svg" />
                        <div v-if="this.selectedItem == index" class="ShopMenu__item-trading">
                            <div class="ShopMenu__item-buy orbitron-font --semi-bold" @click="showInfo(index)">
                                BUY
                            </div>
                            <div class="ShopMenu__item-info orbitron-font --semi-bold" @click="showInfo(index)">
                                INFO
                            </div>
                        </div>
                        <div class="ShopMenu__item-content exo2-font">
                            <h5 class="ShopMenu__item-name">Name..</h5>
                            <p>10000</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="shopInfoVisible" class="ShopInfo__container">
                <div class="ShopInfo">
                    <img src="/gui/images/shop-menu/background.svg"/>
                    <div class="ShopInfo__close" @click="closeShopInfo">
                        <img src="/gui/images/shop-menu/close.svg" />
                    </div>
                     <div class="ShopInfo__content orbitron-font --semmi-bold">
                         <h3 class="ShopInfo__title orbitron-font --semmi-bold">INFO</h3>
                         <h4 class="ShopInfo__subtitle orbitron-font --semmi-bold">TITLE</h4>
                         <p class="ShopInfo__description">Amet, luctus leo, platea orci, cursus in nisi cursus dictum libero, ipsum nulla imperdiet nulla non molestie justo cursus dolor velit venenatis amet, vel consectetur dictum.</p>
                         <div class="ShopInfo__button">
                            <img src="/gui/images/shop-menu/shopInfo-btn.svg">
                            <div class="ShopInfo__button-name orbitron-font --semmi-bold">123 GOLD</div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
export default {
    name: "ShopMenu",
    data() {
        return {
            selectedItem: null, 
            shopInfoVisible: false,
            shopMenuVisible: true,
        };
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
        }
    }
}

</script>

<style scoped src="./ShopMenu.css"></style>