<template>
     <div class="Quests__item" :class="questTypeClass">
        <div class="Quests__item-cotainer" @click="handleExpand"> 
            <div class="Quests__item-body"> 
                <div class="Quests__item-icon">
                    <div class="Quests__item-outer-circle">
                        <div class="Quests__item-inner-circle">
                            <img :src="`/gui/images/quests/${name}.png`" alt="">
                            <div class="Quests__item-count exo2-font">
                                0/1
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
                    <path d="M121.532 1C115.796 1 110.188 3.32638 106.133 7.38638L92.4453 22C90.9552 23.4919 87.4453 26 83.4453 26C80.6388 26 2.00001 26 -9.99999 26C-10.2156 62.5901 -9.99997 127.5 -10 157.5C11.5 157.5 359.5 157.5 384 157.5C384 143.5 384 58 384 26C377 26 294.32 26 292.445 26C287.945 26 283.857 23.4131 282.445 22L266.995 7.38638C262.911 3.29725 257.372 1.00001 251.596 1L121.532 1Z" stroke="#474747" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
            <div class="Quests__item-expand-container">
                <div v-for="i in 16" 
                    class="Quests__item-rewardList" 
                    :class="{'is-last': i%4 === 0}" 
                    :style="{ transform: `translateX(${-currentIndex * 100}%)` }">
                    <RewardItem 
                    :isRewardDay="rewardsList[currentIndex + i - 1]?.isRewardDay || false"
                    :isReceived="rewardsList[currentIndex + i - 1]?.isReceived || false"
                    :isMissed="rewardsList[currentIndex + i - 1]?.isMissed || false"
                    />
                    <div class="Quests__item-rewardConnectLine">
                        <div v-if ="rewardsList[currentIndex + i - 1]?.isReceived && rewardsList[currentIndex + i]?.isReceived" class="Quests__item-rewardConnectLine-inner"></div>
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
                            v-show="currentIndex < rewardsList.length"
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

import RewardItem from './RewardItem/RewardItem.vue';
export default {
    name: 'QuestsItem',
    components: {
        RewardItem
    },
    props:{
        name: String,

    },

    data() {
        return {
            currentIndex: 0,
            isExpand: false,
            rewardsList: [
                { isReceived: true, isMissed: false,isRewardDay: false },
                { isReceived: true, isMissed: false,isRewardDay: false },
                { isReceived: false, isMissed: true,isRewardDay: false },
                { isReceived: false, isMissed: true,isRewardDay: false },
                { isReceived: false, isMissed: false, isRewardDay: true },
                { isReceived: false, isMissed: false, isRewardDay: true },
                { isReceived: false, isMissed: false, isRewardDay: false },
                { isReceived: false, isMissed: false, isRewardDay: false },
                { isReceived: false, isMissed: false, isRewardDay: false },
                { isReceived: false, isMissed: false, isRewardDay: false },
            ],
        }
    },
    methods: {
    handleNext() {
        console.log(this.currentIndex);
        if (this.currentIndex < this.rewardsList.length ) {
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
   }

    },
    computed: {
        questTypeClass() {
            return `Quests__item--${this.name}`
        }
    }

    
}
</script>
<style scoped  src="./QuestsItem.css"></style>
