<template>
    <div class="StarDefenderButton">
        <div class="StarDefenderButton__content">
            <div class="StarDefenderButton__content-box">
                <img src="/gui/images/star-defender/star-defender-bg.svg">
                <div class="StarDefenderButton__content-box-title">
                    Andrsen..
                </div>
                <div class="StarDefenderButton__content-box-name"
                    @click="$emit('click')">
                    STAR DEFENDER
                </div>
                <div class="StarDefenderButton__content-box-online">
                    onlineL4000469
                </div>
                <div class="StarDefenderButton__content-connect-line">
                    <img src="/gui/images/star-defender/star-defender-connectline.svg">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { formatDuration } from '@/utils';
export default {
    name: 'StarDefenderButton',
   
}
</script>

<style scoped src="./StarDefenderButton.css"></style>
