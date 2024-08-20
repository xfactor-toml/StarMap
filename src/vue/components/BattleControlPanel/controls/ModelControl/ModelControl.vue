<template>
    <button class="ModelControl">
        <img src="/gui/images/pre-game-countdown/model-border.svg" />
        <div class="ModelControl__img">
            <img src="/gui/images/battle-player-list/player3.png" />
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


export default {
    name: 'ModelControl',
    props :{
        level: {
            type: Number,
            required: true,
        }
    }

}
</script>

<style scoped src="./ModelControl.css" />