<template>
    <transition name="fade">
        <div class="StarDefenderProcess">
            <div class="StarDefenderProcess__content">
                <div class="StarDefenderProcess__content-box">
                    <img src="/gui/images/star-defender/star-defender-bg.svg">
                    <div class="StarDefenderProcess__content-box-name"
                        @click="$emit('click')">
                        STAR DEFENDER
                    </div>
                    <div class="StarDefenderProcess__content-search">
                        <span class="StarDefenderProcess__label">{{ displayText }}</span>
                        <div class="StarDefenderProcess__loading">
                            <div v-for="dot in dotsAmount" class="StarDefenderProcess__dot" :class="{
                                'is-active': dot === activeDot,
                                'is-disabled': interval === null,
                            }" />
                        </div>
                    </div>
    
    
                    <div class="StarDefenderProcess__content-box-online">
                        onlineL4000469
                    </div>
                    <div class="StarDefenderProcess__content-connect-line">
                        <img src="/gui/images/star-defender/star-defender-connectline.svg">
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { formatDuration } from '@/utils';
export default {
    name: 'StarDefenderProcess',
    props: {
        updateInterval: {
        type: Number,
        default: 143 // second / dots amount
        },
        selectedMenu: {
            type: String
        }
    },
    data: () => ({
    activeDot: 1,
    dotsAmount: 7,
    initialTime: Date.now(),
    interval: null,
    passedTime: 0,
     }),
    mounted() {
        this.interval = setInterval(() => {
        const nextDot = this.activeDot + 1
        this.passedTime = Date.now() - this.initialTime
        this.activeDot = nextDot > this.dotsAmount ? 1 : nextDot
        }, this.updateInterval);
    },
    unmounted() {
        clearInterval(this.interval)
    },

    computed: {
        displayText() {
            if ( this.selectedMenu == 'SEARCH GAME')
                return 'SEARCHING'
            else if ( this.selectedMenu == 'PLAY WITH A BOT')
                return 'WAITING'
            else 
                return 'DUEL WAITING'
        }
    },
}
</script>

<style scoped src="./StarDefenderProcess.css"></style>
