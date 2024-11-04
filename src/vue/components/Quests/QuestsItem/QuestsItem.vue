<template>
     <div class="Quests__item" :class="questClass(''), {'is-waiting': isWaiting}">
        <div class="Quests__item-cotainer" :class="{'expand': questType === 'UNIQUE'}" @click="handleExpand"> 
            <div class="Quests__item-body"> 
                <div class="Quests__item-icon" :class="questClass('icon'), questTypeClass('icon')">
                    <div class="Quests__item-outer-circle" :class="questClass('outer-circle'), questTypeClass('outer-circle')">
                        <div class="Quests__item-inner-circle" :class="questClass('inner-circle'), questTypeClass('inner-circle')">
                            <img :src="`/gui/images/quests/${name}.png`" alt="">
                        </div>
                    </div>
                    <div v-if="questType === 'UNIQUE'" class="Quests__item-count exo2-font" :class="questClass('count')">
                        {{ currentBonusDay  }} / {{ totalBonusDay }}
                    </div>
                    <div v-if="!isWaiting && questType !== 'UNIQUE'" class="Quests__item-refresh" @click="handleRefresh">
                        <img src="/gui/images/quests/refresh.svg" alt="refresh"> 
                    </div>
                </div>
                <div class="Quests__item-content exo2-font" :class="questTypeClass('content')">
                    {{ content }}
                </div>
                <div v-if="questType === 'UNIQUE'" class="Quests__item-external-Link">
                    <img src="/gui/images/quests/external-link.svg" alt="">
                </div>
                <div v-else class="Quests__item-reward-Link">
                    <RewardItem
                    @getReward="getReward" 
                    :isRewardDay="true" 
                    :bonusCount="1" 
                    :questType="questType" 
                    />
                </div>
            </div>
            <div class="Quests__item-bottom" :class="{'is-unique': questType === 'UNIQUE', 'is-expand': isExpand && questType === 'UNIQUE'}">      
                    <QuestsBottomSvg 
                    :questType="questType" 
                    :strokeColor="strokeColor"
                    />
            </div>
            <div v-if="questType === 'UNIQUE'" class="Quests__item-bottom-content exo2-font" :class="{'is-expand': isExpand}">
                NEWREWARD
            </div>
            <div v-else class="Quests__item-bottom-content exo2-font">
                <div v-if="isWaiting">
                    REWARD AVAIBLE
                </div>
                <div v-else>
                    {{ currentBonusDay  }} / {{ totalBonusDay }}
                </div>
            </div>
        </div>
  
        <div v-if="isExpand && questType === 'UNIQUE'" class="Quests__item-expand">
            <div v-show="rewardsList.length > 4" class="Quests__item-expand-gradient" :class="gradientClass"/>
            <div class="Quests__item-expand-container">
                <div v-for="i in rewardsList.length" 
                    class="Quests__item-rewardList" 
                    :class="{'is-last': i%4 === 0, 'is-clickable': canClick(i)}" 
                    :style="{ transform: `translateX(${-currentIndex * 100}%)` }">
                    <RewardItem
                    @getReward="getReward"
                    @missedReward="missedReward"
                    :isRewardDay="rewardsList[i - 1]?.isRewardDay"
                    :isReceived="rewardsList[i - 1]?.isReceived"
                    :isMissed="rewardsList[ i - 1]?.isMissed"
                    :bonusCount="rewardsList[ i - 1]?.bonusCount"
                    :day="rewardsList[ i - 1]?.day" 
                    />
                    <div class="Quests__item-rewardConnectLine">
                        <div v-if ="rewardsList[i - 1]?.isReceived && rewardsList[i]?.isReceived" class="Quests__item-rewardConnectLine-inner"></div>
                    </div>
                </div>
                <div class="Quests__item-expand-middleline"></div>
                <div class="Quests__item-rewardList-btn">
                   <div class="Quests__item-rewardList-btn-container">
                       <div class="Quests__item-rewardList-previous-btn" 
                            v-show="currentIndex > 0" 
                            @click="handlePrevious">
                           <img src="/gui/images/quests/previous-button.svg" alt="">
                       </div>
                       <div class="Quests__item-rewardList-next-btn" 
                            v-show="this.rewardsList.length - 4 > 0 && currentIndex < rewardsList.length - 4"
                            @click="handleNext"
                           >
                           <img src="/gui/images/quests/next-button.svg"   alt="">
                       </div>
                   </div>
                </div>
            </div>
        </div> 
    </div>
</template>
<script lang="ts">
import RewardItem from './RewardItem/RewardItem.vue';
import QuestsBottomSvg from './QuestsBottomSvg.vue';
import { RewardType } from '@/types/quest';
export default {
    name: 'QuestsItem',
    components: {
        RewardItem,
      QuestsBottomSvg
    },
    props:{
        name: String,
        content: String,
        rewardsList: Array<RewardType>,
        totalBonusDay: Number,
        currentBonusDay: Number,
        questType: String,
        isWaiting: Boolean,
        rarity: String,
    },
    emits: ["getReward", "missedReward", "refresh"],
    computed: {
        strokeColor() {
            switch(this.rarity) {
                case '':
                   return '#3F3F3F';
                case 'normal':
                    if (this.questType === 'UNIQUE') return '#474747';
                    return '#2E2E2E'
                case 'rare':
                    if (this.questType === 'UNIQUE') return '#0461B5';
                    return '#0461B5'
                case 'mythic':
                    if (this.questType === 'UNIQUE') return '#6732D4';
                    return '#4315B1';
                case 'legendary':
                    return '#F4771E' 
                case 'vorpal':
                    return '#104756'
                default:
                    return '#3F3F3F'  
            } 
        },
        gradientClass() {
            if (!this.isExpand) return '';
            
            const hasPrevious = this.currentIndex > 0;
            const hasNext = this.rewardsList.length - 4 > 0 && this.currentIndex < this.rewardsList.length - 4;
            
            if (hasPrevious && hasNext) return 'gradient-both';
            if (hasPrevious) return 'gradient-previous';
            if (hasNext) return 'gradient-next';
            return 'gradient-none';
        }
    },

    data() { 
        return {
            currentIndex: 0,
            isExpand: false,
        }
    },
    methods: {
        questClass(suffix: string) {
            if(suffix === '') {
                return `Quests__item--${this.questType.toLowerCase()}--${this.rarity}`;
            }
            return `Quests__item-${suffix}--${this.questType.toLowerCase()}--${this.rarity}`;
        },
        questTypeClass(suffix: string) {
            return `Quests__item-${suffix}--${this.questType.toLowerCase()}`;
        },
        handleRefresh() {
            // this.$emit('refresh')
        },
        handleNext() {
            console.log(this.rewardsList.length, "length")
            if (this.currentIndex < this.rewardsList.length-1 ) {
                this.currentIndex++;
            }
        },
        handlePrevious() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            }
        },
        handleExpand(){
            if (this.questType !== 'UNIQUE') return;
            this.isExpand = !this.isExpand;
        },
        canClick(index: number) {
            return  index > this.currentIndex + 1 && index < this.currentIndex + 4;
        },
        getReward() {
            if (this.isWaiting) {
                this.$emit('refresh')
            } else {
                this.$emit('getReward')
            }
        },
        missedReward() {
            this.$emit('missedReward')
        }

    },
      
}
</script>
<style scoped  src="./QuestsItem.css"></style>
