<template>
    <button class="ModelControl">
        <img src="/gui/images/pre-game-countdown/model-border.svg" />
        <div class="ModelControl__img">
            <img src="/gui/images/battle-player-list/player3.png" />
        </div>
        <div class="ModelControl__boxshadow"/>
        <div class="ModelControl__progress">
            <svg 
                xmlns="http://www.w3.org/2000/svg"
                width="76"
                height="87"
                viewBox="0 0 76 87" 
                fill="none" 
            >
                 <path 
                    v-if="progress"
                    :style="progressStyle"
                    d="M39.25 2.80978C38.87 2.59035 38.4388 2.47485 38 2.47485C37.5612 2.47485 37.13 2.59035 36.75 2.80978L3.25 22.151C2.86995 22.3704 2.55435 22.686 2.33492 23.0661C2.1155 23.4461 2 23.8772 2 24.3161V62.9986C1.99999 63.4374 2.1155 63.8685 2.33492 64.2486C2.55435 64.6286 2.86995 64.9442 3.25 65.1636L36.75 84.5049C37.1301 84.7243 37.5612 84.8398 38 84.8398C38.4388 84.8398 38.87 84.7243 39.25 84.5049L72.75 65.1636C73.1301 64.9442 73.4457 64.6286 73.6651 64.2486C73.8845 63.8685 74 63.4374 74 62.9986L74 24.3161C74 23.8772 73.8845 23.4461 73.6651 23.0661C73.4457 22.686 73.1301 22.3704 72.75 22.151L39.25 2.80978Z" 
                    stroke="#00FFFF" 
                    stroke-opacity="0.997664" 
                    stroke-width="4" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                  />
            </svg>
        </div>
        <div class="ModelControl__level orbitron-font --semi-bold">
            {{ level }}
        </div>
        <div class="ModelControl__shop" @click="$emit('click')">
            <img src="/gui/images/pre-game-countdown/shop.svg" />
            <div class="ModelControl__shop-name orbitron-font --semi-bold">
                SHOP
            </div>
        </div>
    </button>
</template>

<script lang="ts">
import { MyMath } from '~/monax/MyMath';
export default {
    name: 'ModelControl',
    props :{
        level: {
            type: Number,
            required: true,
        },
        progress: {
            type: Number,
            default: 0
        },
    },
    computed: {
        progressStyle() {
            const dasharray = 580
            const offset = dasharray - dasharray * this.progress / 100

            return {
                'stroke-dasharray': `${dasharray}px`,
                'stroke-dashoffset': `${MyMath.clamp(offset, 0, dasharray)}px`
            };
        }
    }


}
</script>

<style scoped src="./ModelControl.css" />