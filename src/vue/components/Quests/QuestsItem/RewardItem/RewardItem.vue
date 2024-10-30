<template>
    <div class="RewardItem" :class="{ 'is-processed': isReceived || isMissed || isRewardDay}">
        <div class="RewardItem-avatar" :class="{ 'is-reward-day': isRewardDay, 'is-received': isReceived , 'is-missed': isMissed}">
            <img v-if="!isNFT" src="/gui/images/quests/reward.png" alt="reward-item">
            <img v-else src="/gui/images/quests/nft-reward.png" alt="reward-item">
            <div class="RewardItem__count exo2-font" :class="{ 'is-reward-day': isRewardDay, 'is-received': isReceived , 'is-missed': isMissed}">
                X{{ bonusCount }}
            </div>

            <div v-if="isReceived || isMissed" class="RewardItem-status" :class="{ 'is-reward-day': isRewardDay, 'is-received': isReceived , 'is-missed': isMissed}">
                <img v-if="isReceived" src="/gui/images/quests/check-icon.svg" alt="reward-item">
                <img v-else-if="isMissed" src="/gui/images/quests/no-icon.svg" alt="reward-item">            
            </div>
        </div>
    
        <div class="RewardItem__day exo2-font" :class="{ 'is-reward-day': isRewardDay, 'is-received': isReceived , 'is-missed': isMissed}">
            {{ day }}
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'RewardItem',
    props: {
       isNFT: {
        type: Boolean,
        default: false
       },
       isRewardDay: {
        type: Boolean,
        default: false
       },
       isReceived: {
        type: Boolean,
        default: false
       } ,
       isMissed: {
        type: Boolean,
        default: false
       },
       bonusCount: {
        type: Number,
        default: 0
       },
       day: {
        type: String,
        default: ''
       }

    }
}
</script>
<style scoped src="./RewardItem.css"></style>