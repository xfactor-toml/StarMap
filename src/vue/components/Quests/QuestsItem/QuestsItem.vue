<template>
     <div class="Quests__item" :class="questTypeClass">
        <div class="Quests__item-cotainer" @click="handleExpand"> 
            <div class="Quests__item-body"> 
                <div class="Quests__item-icon" :class="questIconTypeClass">
                    <div class="Quests__item-outer-circle" :class="questOuterCircleTypeClass" >
                        <div class="Quests__item-inner-circle" :class="questInnerCircleTypeClass">
                            <img :src="`/gui/images/quests/${name}.png`" alt="">
                            <div class="Quests__item-count exo2-font">
                                {{ currentBonusDay  }} / {{ totalBonusDay }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Quests__item-content exo2-font">
                    Amet, luctus leo, platea orci, cursus in nisi cursus dictum libero, ipsum fgeb
                </div>
                <div class="Quests__item-external-Link">
                   <img src="/gui/images/quests/external-link.svg" alt="">
                </div>
            </div>
            <div class="Quests__item-bottom" :class="{'is-expand': isExpand}">      
                 <svg width="374" height="27" viewBox="0 0 374 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_i_76_338)">
                    <path d="M121.532 1C115.796 1 110.188 3.32638 106.133 7.38638L92.4453 22C90.9552 23.4919 87.4453 26 83.4453 26C80.6388 26 2.00001 26 -9.99999 26C-10.2156 62.5901 -9.99997 127.5 -10 157.5C11.5 157.5 359.5 157.5 384 157.5C384 143.5 384 58 384 26C377 26 294.32 26 292.445 26C287.945 26 283.857 23.4131 282.445 22L266.995 7.38638C262.911 3.29725 257.372 1.00001 251.596 1L121.532 1Z" fill="#1E1E1E"/>
                    </g> 
                    <path d="M121.532 1C115.796 1 110.188 3.32638 106.133 7.38638L92.4453 22C90.9552 23.4919 87.4453 26 83.4453 26C80.6388 26 2.00001 26 -9.99999 26C-10.2156 62.5901 -9.99997 127.5 -10 157.5C11.5 157.5 359.5 157.5 384 157.5C384 143.5 384 58 384 26C377 26 294.32 26 292.445 26C287.945 26 283.857 23.4131 282.445 22L266.995 7.38638C262.911 3.29725 257.372 1.00001 251.596 1L121.532 1Z" :stroke="strokeColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs>
                    <filter id="filter0_i_76_338" x="-11.0958" y="0" width="396.096" height="162.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="5"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_76_338"/>
                    </filter>
                    </defs>
                </svg> 
            </div>
            <div class="Quests__item-bottom-content exo2-font" :class="{'is-expand': isExpand}">
                NEWREWARD
            </div>
        </div>
  
        <div v-if="isExpand" class="Quests__item-expand">
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

    <div v-if="false" class="Quests__item-expand-bg">
        <svg width="374" height="150" viewBox="0 0 374 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_i_76_280)">
            <path d="M121.532 1C115.796 1 110.188 3.32638 106.133 7.38638L92.4453 22C90.9552 23.4919 87.4453 26 83.4453 26C80.6388 26 2.00003 26 -9.99997 26C-10.2156 62.5901 -9.99995 127.5 -9.99998 157.5C11.5 157.5 359.5 157.5 384 157.5C384 143.5 384 58 384 26C377 26 294.32 26 292.445 26C287.945 26 283.857 23.4131 282.445 22L266.995 7.38638C262.911 3.29725 257.372 1.00001 251.596 1L121.532 1Z" fill="#1E1E1E"/>
            </g>
            <path d="M121.532 1C115.796 1 110.188 3.32638 106.133 7.38638L92.4453 22C90.9552 23.4919 87.4453 26 83.4453 26C80.6388 26 2.00003 26 -9.99997 26C-10.2156 62.5901 -9.99995 127.5 -9.99998 157.5C11.5 157.5 359.5 157.5 384 157.5C384 143.5 384 58 384 26C377 26 294.32 26 292.445 26C287.945 26 283.857 23.4131 282.445 22L266.995 7.38638C262.911 3.29725 257.372 1.00001 251.596 1L121.532 1Z" stroke="#474747" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <filter id="filter0_i_76_280" x="-11.0958" y="0" width="396.096" height="162.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_76_280"/>
            </filter>
            </defs>
        </svg>
    </div>
   
</template>
<script lang="ts">
import { PropType } from 'vue'
import RewardItem from './RewardItem/RewardItem.vue';
import { RewardType } from '@/types/quest';
import { QuestItemType } from '@/types/quest';
export default {
    name: 'QuestsItem',
    components: {
        RewardItem
    },
    props:{
        name: String,
        rewardsList: Array<RewardType>,
        totalBonusDay: Number,
        currentBonusDay: Number,
    },
    emits: ["getReward", "missedReward"],
    computed: {
        questIconTypeClass() {
            return `Quests__item-icon--${this.name}`
        },
        questTypeClass() {
            return `Quests__item--${this.name}`
        },
        questOuterCircleTypeClass() {
            return `Quests__item-outer-circle--${this.name}`
        },
        questInnerCircleTypeClass() {
            return `Quests__item-inner-circle--${this.name}`
        },
        strokeColor() {
            switch(this.name) {
                case 'red-triangle':
                    return '#474747'
                case 'star-defender':
                    return '#0461B5'
                case 'rock-alliance':
                    return '#0461B5' 
                case 'moai-heads':
                    return '#F4771E' 
                case 'vorpal':
                    return '#104756'
                default:
                    return '#474747'  
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
            this.isExpand = !this.isExpand;
        },
        canClick(index: number) {
            return  index > this.currentIndex + 1 && index < this.currentIndex + 4;
        },
        getReward() {
            this.$emit('getReward')
        },
        missedReward() {
            this.$emit('missedReward')
        }

    },
    


    
}
</script>
<style scoped  src="./QuestsItem.css"></style>
