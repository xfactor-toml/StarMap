<template>
    <div class="Quests" :class="{ 'disabled': isModalOpen }">
        <div class="Quests__container">
            <img src="/gui/images/leaders-board/bg.png" alt="">
            <div class="Quests__container-content" >
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
                <div class="Quests__body" :class="{ 'disabled': isModalOpen }" ref="questsBody">
                    <div class="Quests__content">
                       <QuestsItem 
                       v-for="(item, index) in questItemList"
                       @refresh="refresh"
                       @getReward="getReward"
                       @missedReward="missedReward"
                       :questType="navbarItems[activeNavItem]"
                       :name="item.name" 
                       :content="item.content"
                       :rewardsList="item.rewardsList"
                       :totalBonusDay="item.totalBonusDay"
                       :currentBonusDay="item.currentBonusDay"
                       :isWaiting="item.isWaiting"
                       :rarity="item.rarity"
                       :key="index"/> 
                       
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
            </div>
            <div v-show="unstoppableRewards" class="Quests__modal">
                <QuestsModal 
                :rewardsList="BonusList" 
                @close="closeModal" />
            </div>
            <div v-show="canGetReward" class="Quests__modal">
                <QuestsModal 
                title="NICE WORK!" 
                :rewardsList="RewardList" 
                @close="closeModal" />
            </div>
            <div v-show="showCheckModal" class="Quests__modal">
                <BaseModal 
                bgColor="blue"
                title="NOTIFICATION"
                subtitle="SUBSCRIBE TO"
                buttonName="CHECK"
                buttonType="blue"
                @close="closeModal">
                    <div class="Quests__refresh-modal">
                        <RewardItem  :isRewardDay="true" imageSrc="vorpal" :hasCheck="true" />
                        <RewardItem  :isRewardDay="true" imageSrc="red-vector" :hasCancel="true" />
                    </div>
                </BaseModal>
            </div>
       </div>          
    </div>
</template>

<script lang="ts">
import QuestsItem from './QuestsItem';
import { QuestItemList, QuestDailyItemList, QuestWeeklyItemList, BonusList, RewardList } from '@/constants/quests';
import QuestsModal from './QuestsModal/QuestsModal.vue';
import RewardItem from './QuestsItem/RewardItem';
import BaseModal from './QuestsModal/BaseModal/BaseModal.vue';
export default {
    name: 'Quests',
    components: {
        QuestsItem,
        QuestsModal,
        RewardItem,
        BaseModal
    },
    data() {
        return {
            navbarItems: ['DAILY', 'WEEKLY', 'UNIQUE'],
            activeNavItem: 2, 
            displayCount: 10,  
            questItemList: QuestItemList,
            unstoppableRewards: false,
            canGetReward: false,
            showCheckModal: false,
            RewardList,
            BonusList
        }
    },
    mounted() {
        const questsBody = this.$refs.questsBody;
        let startY;

        questsBody.addEventListener('touchstart', (e) => {
            startY = e.touches[0].pageY;
        });

        questsBody.addEventListener('touchmove', (e) => {
            const moveY = e.touches[0].pageY - startY;
            questsBody.scrollTop -= moveY;
            startY = e.touches[0].pageY;
            e.preventDefault(); 
        });
    },
    computed: {
        displayedLeaders() {
            return this.leaders.slice(0, this.displayCount);
        },
        hasMoreLeaders() {
            return this.displayCount < this.leaders.length;
        },
        isModalOpen() {
            return this.unstoppableRewards || this.canGetReward || this.showCheckModal;
        }
    },

    methods: {
        refresh() {
            console.log('refresh')
            this.showCheckModal = true;
        },
        getReward() {
            console.log('getReward')
            this.canGetReward = !this.canGetReward;
        },
        missedReward() {
            console.log('missedReward')
            this.unstoppableRewards = true  
        },
        closeModal() {
            this.unstoppableRewards = false;
            this.canGetReward = false;
            this.showCheckModal = false;
        },
        goBack() {
            this.$emit('goBack', 'QUESTS');
        },
        close() {
            this.$emit('close');
        },
        setActiveNavItem(index: number) {
            this.activeNavItem = index;
            if(this.navbarItems[index] === 'DAILY') {
                this.questItemList = QuestDailyItemList;
            }
            else if(this.navbarItems[index] === 'WEEKLY') {
                this.questItemList = QuestWeeklyItemList;
            }
            else {
                this.questItemList = QuestItemList;
            }
            
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