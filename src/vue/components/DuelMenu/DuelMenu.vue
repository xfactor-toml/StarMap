<template>
    <div class="DuelMenu__container">
        <div class="DuelMenu">
            <div class="DuelMenu__previous" @click="changeStatus">
                <img src="/gui/images/duel-previous.svg">
            </div>
            <div class="DuelMenu__title --bold">DUEL</div>
            <div class="DuelMenu__close" @click="$emit('close')"></div>
            <img src="/gui/images/main-menu/main-menu-background.png">
            <div class="DuelMenu__items">
                <div class="DuelMenu__link">
                    <div class="DuelMenu__link-text" ref="linkText">{{ uniqueIdLink }}</div>
                    <div class="DuelMenu__link-copy" @click="copyLinkText">
                        <img :src="src">
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


<script lang="ts">
import { toast } from 'vue3-toastify';
import { mapStores } from 'pinia';
import { useWalletStore } from '@/stores';
// Remove this line:
// import crypto from 'crypto';

export default {
    name: 'DuelMenu',
    data() {
        return {
            isCopied: false,
            src: '/gui/images/copy.svg',
            uniqueIdLink: ''
        
        }
    },
    computed: {
        ...mapStores(useWalletStore)
    },
    methods: {
    changeStatus() {
        this.$emit('previous', 'DUEL');
    },

    async generateUniqueId() {
        if(this.walletStore.connected) {
            const telegramId = this.walletStore.login; 
            if (telegramId) {
                // Generate a numeric ID based on the telegramId
                const numericId = this.generateNumericId(telegramId);
                return this.createInviteLink(numericId);
            } else {
                console.error('Telegram ID not found');
                return Promise.resolve(this.createInviteLink('00000000'));
            }
        }
        else {
            return Promise.resolve(this.createInviteLink('00000000'));
        }
    },

    generateNumericId(str) {
        let numericValue = 0;
        for (let i = 0; i < str.length; i++) {
            numericValue += str.charCodeAt(i);
        }
        // Ensure the ID is 8 digits long
        return numericValue.toString().padStart(8, '0').slice(-8);
    },

    createInviteLink(uniqueId) {
        return `https://t.me/vorpaldao_test_bot/vtester?startapp=inviterId_${uniqueId}`;
    },

    async copyLinkText() {
        const linkText = this.$refs.linkText as HTMLElement;
        try {
            // Using the Clipboard API to copy text
            await navigator.clipboard.writeText(linkText.textContent || '');
            toast('Copied!', {
                type: 'success',
                autoClose: 1000
            });
            this.isCopied = true;
            this.src = '/gui/images/copied-link.png';

            setTimeout(() => {
                    this.isCopied = false;
                    this.src = '/gui/images/copy.svg';
                }, 3000);
        } catch (err) {
            toast('Failed to copy', {
                type: 'error',
                autoClose: 1000
            });
        }
    }
},
async mounted() {
    this.uniqueIdLink = await this.generateUniqueId();
  }
}
</script>


<style scoped src="./DuelMenu.css"></style>