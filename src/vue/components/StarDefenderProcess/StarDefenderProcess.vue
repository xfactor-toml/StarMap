<template>
        <div class="StarDefenderProcess">
        <div class="StarDefenderProcess__container" :style="containerStyle">
            <div class="StarDefenderProcess__connectLine">
               <img src="/gui/images/star-defender/connect-line.svg" />
               <div class="StarDefenderProcess__content">
                   <div class="StarDefenderProcess__bg" >
                      <img src="/gui/images/star-defender/bg.svg" />
                      <div class="StarDefenderProcess__name">
                          Star Defender
                      </div>
                      <div class="StarDefenderProcess__search">
                        <h4 class="StarDefenderProcess__title --bold">
                            {{ displayText }}
                        </h4>
                        <div class="StarDefenderProcess__loading">
                            <div v-for="dot in dotsAmount" class="StarDefenderProcess__dot" :class="{
                                'is-active': dot === activeDot,
                                'is-disabled': interval === null,
                            }" />
                        </div>
                      </div>
                      <div class="StarDefenderProcess__online exo2-font">
                            on line: 4000469
                      </div>
                   </div>
               </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { formatDuration } from '@/utils';
import { PropType } from 'vue';
import { StarScreenPosition } from '@/models';

export default {
    name: 'StarDefenderProcess',
    props: {
        position: {
          type: Object as PropType<StarScreenPosition>
        },

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
        containerStyle() {
            return {
                width: `${this.position.x}px`,
                height: `${this.position.y}px`
            }
       },
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
