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
                       v-for="(item, index) in questNames" 
                       :key="index" 
                       :name="questNames[index]" /> 

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
       </div>          
    </div>
</template>

<script lang="ts">
import QuestsItem from './QuestsItem';
export default {
    name: 'Quests',
    components: {
        QuestsItem
    },
    data() {
        return {
            navbarItems: ['DAILY', 'WEEKLY', 'UNIQUE'],
            questNames: ['redTriangle', 'rockAlliance', 'moaiHeads', 'vorpal'],
            activeNavItem: 2, 
            displayCount: 10,  
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
        getMyInfoLabel(activeNavItem: number) {
            switch (activeNavItem) {
                case 0: return 'Rating';
                case 1: return 'Unique duels';
                case 2: return 'Friends';
                default: return 'Unique duels';
            }
        },
        getMyInfoValue(activeNavItem: number) {
            switch (activeNavItem) {
                case 0: return  this.myInfo.ratings;
                case 1: return  this.myInfo.duels;
                case 2: return  this.myInfo.friends;
                default: return this.myInfo.duels;
            }
        },

        getRankingAvatar(activeNavItem: number) {
            switch (activeNavItem) {
                case 0: return  '/gui/images/leaders-board/raiting.svg';
                case 1: return  "/gui/images/leaders-board/other-avatar.svg";
                case 2: return  '/gui/images/leaders-board/main-avatar.svg';
                default: return  "/gui/images/leaders-board/other-avatar.svg";
            }
        },

        getRankingName(activeNavItem: number, index: number) {
            switch (activeNavItem) {
                case 0: return  'unknown';
                case 1: return  this.leaders[index].name;
                case 2: return  'unknown';
                default: return  this.leaders[index].name;
            }
        },

        getRankingDetail(activeNavItem: number, index: number) {
            switch (activeNavItem) {
                case 0: return  'soon';
                case 1: return  this.leaders[index].uniqueDuels;
                case 2: return   this.leaders[index].uniqueDuels;
                default: return  this.leaders[index].uniqueDuels;
            }
        },

        getRankingValue(activeNavItem: number, index: number) {
            switch (activeNavItem) {
                case 0: return  'soon';
                case 1: return  index+4;
                case 2: return   3;
                default: return  index+4;
            }
        },
        getCrown(index: number) {
            if (index === 0) {
                return '/gui/images/leaders-board/silver-crown.svg';
            }
            if (index === 1) {
                return '/gui/images/leaders-board/gold-crown.svg';
            }
            if (index === 2) {
                return '/gui/images/leaders-board/bronze-crown.svg';
            }
            return null;
        },
        getCrownType(index: number) {
            if (index === 0) {
                return 'silver';
            } else if (index === 1) {
                return 'gold';
            } else if (index === 2) {
                return 'bronze';
            }
        },
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