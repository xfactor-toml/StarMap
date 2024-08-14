<template>
    <div class="DuelMenu__container">
        <div class="DuelMenu">
            <div class="DuelMenu__previous" @click="changeStatus">
                <img src="/gui/images/duel-previous.svg">
            </div>
            <div class="DuelMenu__title">DUEL</div>
            <div class="DuelMenu__close" @click="$emit('close')"></div>
            <img src="/gui/images/main-menu/main-menu-background.png">
            <div class="DuelMenu__items">
                <div class="DuelMenu__link">
                    <div class="DuelMenu__link-text"> https://vorpal.finance...</div>
                    <div class="DuelMenu__link-copy">
                        <img src="/gui/images/copy.svg">
                    </div>
                </div>

                <div class="DuelMenu__animation">
                    <div class="DuelMenu__button" @click="$emit('sendLink')">
                        <img src="/gui/images/duel-box.svg">
                        <div class="DuelMenu__button-text">
                            SEND A LINK
                        </div>
                    </div>
                    <div class="DuelMenu__button-animation" v-for="(item, index) in 30" :key="index">
                        <img src="/gui/images/user-inventory/open-box-border.svg" alt="logo">
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script  lang="ts">
 
 export default {
    name: 'DuelMenu',
    methods: {
        changeStatus() {
      this.$emit('previous', 'DUEL')
    }
    }
 }

</script>

<style scoped src="./DuelMenu.css"></style>