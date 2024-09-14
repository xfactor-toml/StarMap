<template>
    <div class="PreGameCountdown">
        <div class="PreGameCountdown__player">
            <div class="PreGameCountdown__player-info">
                <img src="/gui/images/pre-game-countdown/player-background.svg" />
                <div class="PreGameCountdown__player-img">
                    <img src="/gui/images/pre-game-countdown/image.png" />
                </div>
                <div class="PreGameCountdown__player-shadow"/>

            </div>
            <h4 class="PreGameCountdown__player-name orbitron-font --semiBold">NAME HERO</h4>
        </div>
        <div :key="currentTitleImage" class="PreGameCountdown__title">
            <img :src="currentTitleImage" class="title-image"/>
        </div>

        <BattleControlPanel 
          :skills="battleStore.process.state.skills"
          :skillsPendingList="battleStore.process.skillsPendingList"
          :cooldown="battleStore.process.cooldown"
          :level="battleStore.process.state.level"
          :gold="battleStore.process.state.gold"
          :items="battleStore.shop.items"
          @action="$client.onBattleAction" />

    </div>
</template>

<script lang="ts">
import { BattleControlPanel } from '../BattleControlPanel';
import { mapStores } from 'pinia';
import { useBattleStore, useSettingsStore, useUiStore } from '@/stores';

export default {
    name: 'PreGameCountdown',
    components: {
        BattleControlPanel
    },
    computed: {
        ...mapStores(useBattleStore, useSettingsStore, useUiStore),

        currentTitleImage() {
            return this.titleImages[this.currentImageIndex];
        }
    },

    data() {
        return {
            titleImages: [
                '/gui/images/pre-game-countdown/ready.svg',
                '/gui/images/pre-game-countdown/set.svg',
                '/gui/images/pre-game-countdown/go.svg'
            ],
            currentImageIndex: 0,
            intervalDuration: 1000, // Make this dynamic if needed
        };
    },

    mounted() {
        this.startCountdown();
    },

    methods: {
        startCountdown() {
            let counter = 0;
            const interval = setInterval(() => {
                this.currentImageIndex = counter;
                counter = (counter + 1) % this.titleImages.length;
                if (counter === 0) {
                    clearInterval(interval); // Stop after one cycle
                }
            }, this.intervalDuration);
        }
    }
};
</script>



<style scoped src="./PreGameCountdown.css"></style>