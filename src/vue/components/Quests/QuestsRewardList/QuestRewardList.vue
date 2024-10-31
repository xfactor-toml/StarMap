<template>
    <div  class="QuestRewardList">
        <div v-show="rewardsList.length > 4" 
            class="QuestRewardList-gradient" 
            :class="gradientClass"/>
        <div class="QuestRewardList-container" :class="{'change-flex-start': rewardsList.length < 4}">
            <div v-for="i in rewardsList.length" 
                class="QuestRewardList-item" 
                :class="{'is-last': i%4 === 0, 'is-clickable': canClick(i)}" 
                :style="{ transform: `translateX(${-currentIndex * 100}%)` }">
                <RewardItem
                :isRewardDay="rewardsList[i - 1]?.isRewardDay || false"
                :isBonusDay="rewardsList[i - 1]?.isBonusDay || false"
                :bonusCount="rewardsList[ i - 1]?.bonusCount || 0"
                :canClick="canClick(i)"
                />
                <div class="QuestRewardList-rewardConnectLine">
                    <div v-if ="rewardsList[i - 1]?.isBonusDay && rewardsList[i]?.isBonusDay" class="QuestRewardList-rewardConnectLine-inner"></div>
                </div>
            </div>
            <div class="QuestRewardList-btn">
                <div class="QuestRewardList-btn-container">
                    <div class="QuestRewardList-previous-btn" 
                        v-show="currentIndex > 0" 
                        @click="handlePrevious">
                        <img src="/gui/images/quests/previous-button.svg" alt="">
                    </div>
                    <div class="QuestRewardList-next-btn" 
                        v-show="this.rewardsList.length - 4 > 0 && currentIndex < rewardsList.length - 4"
                        @click="handleNext"
                        >
                        <img src="/gui/images/quests/next-button.svg"   alt="">
                    </div>
                </div>
            </div>
        </div>
    </div> 
</template>
<script lang="ts">
import { BonusType } from '@/types/quest';
import RewardItem from '../QuestsItem/RewardItem';
export default {
    name: 'QuestRewardList',
    components: {
        RewardItem
    },
    props: {
        rewardsList: {
            type: Array as () => BonusType[],
            default: () => []
        }
    },
    computed: {
        gradientClass() {  
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
            currentIndex: 0
        }
    },
    methods: {
        handlePrevious() {
            this.currentIndex--;
        },
        handleNext() {
            this.currentIndex++;
        },
        canClick(index: number) {
            return  index > this.currentIndex + 1 && index < this.currentIndex + 4;
        },
    }
    

}
</script>
<style scoped src="./QuestRewardList.css"></style>