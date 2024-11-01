<template>
    <div class="RewardItem" :class="{ 'is-processed': isReceived || isMissed || isRewardDay || isBonusDay}">
        <div class="RewardItem-avatar" 
            :class="{ 'is-bonus-day': isBonusDay, 'is-reward-day': isRewardDay, 'is-received': isReceived , 'is-missed': isMissed}" 
            @click="handleClick">
            <img :src="imageSource" alt="reward-item">
            <div v-if="isReceived || isMissed" class="RewardItem-status" :class="{ 'is-reward-day': isRewardDay, 'is-received': isReceived , 'is-missed': isMissed}">
            <img v-if="isReceived" src="/gui/images/quests/check-icon.svg" alt="reward-item">
            <img v-else-if="isMissed" src="/gui/images/quests/no-icon.svg" alt="reward-item">            
        </div>
        </div>
        <div v-if="bonusCount" class="RewardItem__count exo2-font" :class="{ 'is-bonus-day': isBonusDay, 'is-reward-day': isRewardDay, 'is-received': isReceived , 'is-missed': isMissed}">
            X{{ bonusCount }}
        </div>

        <div v-if="hasCheck" class="RewardItem-check">
            <img src="/gui/images/quests/check-icon.svg" alt="reward-item">
        </div>

        <div v-if="hasCancel" class="RewardItem-check">
            <img src="/gui/images/quests/cancel-icon.svg" alt="reward-item">
        </div>

        <div v-if="isBonusDay" class="RewardItem-bonus-text exo2-font --bold">
            BONUS
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
        imageSrc: {
        type: String,
        default: 'reward'
        },
       isBonusDay: {
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
        default: null
       },
       hasCheck: {
        type: Boolean,
        default: false
       },
       hasCancel: {
        type: Boolean,
        default: false
       },
       day: {
        type: String,
        default: ''
       },

    },
    computed: {
        imageSource() {
            return `/gui/images/quests/${this.imageSrc}.png`
        }
    },
    methods: {
        handleClick() {
           if (this.isRewardDay) {
            this.$emit('getReward')
           }
           else if (this.isMissed){
            this.$emit('missedReward')
           }
        }
    }
}
</script>
<style scoped src="./RewardItem.css"></style>