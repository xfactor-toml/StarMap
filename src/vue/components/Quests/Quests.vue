<template>
    <div class="Quests">
        <div class="Quests__container">
            <img src="/gui/images/leaders-board/bg.png" alt="">
            <div class="Quests__container-content">
                <div class="Quests__header">
                    <div class="Quests__header-menu">
                        <div class="Quests__header-previous" @click="goBack">
                            <img src="/gui/images/duel-previous.svg">
                        </div>
                        <div class="Quests__header-title --bold">
                           QUESTS
                        </div>
                        <div class="Quests__header-close" @click="close">
                            <img src="/gui/images/user-inventory/inventory/close.svg" alt="">
                        </div>
                    </div>
                    <div class="Quests__navbar">
                        <div
                            v-for="(item, index) in navbarItems"
                            :key="index"
                            class="Quests__navbar-item --bold"
                            :class="{ 'active': activeNavItem === index }"
                            @click="setActiveNavItem(index)"
                        >
                            {{ item }}
                        </div>
                    </div>
                </div>
                <div class="Quests__body">
                    <div class="Quests__content">
                       <QuestsItem 
                       v-for="(item, index) in QuestItemList" 
                       :key="index" 
                       :rewardsList="item.rewardsList"
                       :totalBonusDay="item.totalBonusDay"
                       :currentBonusDay="item.currentBonusDay"
                       :name="item.name" /> 

                        <!-- <div class="Quests__load-more">
                            <button class="Quests__load-more-button --bold" @click="loadMore">
                                Load more
                            </button>
                            <div class="Quests__load-more-animation">
                                <div class="Quests__load-more-animation-container">
                                    <div v-for="(item, index) in 12" :key="index" class="Quests__load-more-animation-item">
                                        <img src="/gui/images/leaders-board/btn-animation.svg" alt="">
                                    </div>
                                </div>
                            </div>
                        </div> -->
                    </div>
                </div>
                <BaseModal >
                    <div class="BaseModal__content-rewards-item">
                        <RewardItem :bonusCount="10" :isRewardDay="true" :isNFT="true" />
                    </div>
                </BaseModal>
            </div>
       </div>          
    </div>
</template>

<script lang="ts">
import QuestsItem from './QuestsItem';
import { QuestItemList } from '@/constants/quests';
import BaseModal from './BaseModal/BaseModal.vue';
import RewardItem from './QuestsItem/RewardItem';
export default {
    name: 'Quests',
    components: {
        QuestsItem,
        BaseModal,
        RewardItem
    },
    data() {
        return {
            navbarItems: ['DAILY', 'WEEKLY', 'UNIQUE'],
            questNames: ['red-triangle', 'star-defender', 'rock-alliance', 'moai-heads', 'vorpal'],
            activeNavItem: 2, 
            displayCount: 10,  
            QuestItemList,
        }
    },

    computed: {
        displayedLeaders() {
            return this.leaders.slice(0, this.displayCount);
        },
        hasMoreLeaders() {
            return this.displayCount < this.leaders.length;
        },
    },

    methods: {
       
        goBack() {
            this.$emit('goBack', 'LEADERS BOARD');
        },
        close() {
            this.$emit('close');
        },
        setActiveNavItem(index: number) {
            this.activeNavItem = index;
        },
        loadMore() {
            this.displayCount = Math.min(this.displayCount + 10, this.leaders.length);
            console.log(this.displayCount, 'displayCount', this.leaders.length);
            this.$nextTick(() => {
            const QuestsElement = this.$el.querySelector('.Quests__content');
            const lastItem = this.$el.querySelector('.Quests__ranking-item:last-child');
            if (QuestsElement && lastItem) {
                lastItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
        }
    }
}
</script>
<style scoped src="./Quests.css">
    
</style>