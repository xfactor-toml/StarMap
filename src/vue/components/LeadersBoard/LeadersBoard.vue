<template>
    <div class="LeadersBoard">
        <div class="LeadersBoard__container">
            <img src="/gui/images/leaders-board/bg.png" alt="">
            <div class="LeadersBoard__container-content">
                <div class="LeadersBoard__header">
                    <div class="LeadersBoard__header-menu">
                        <div class="LeadersBoard__header-previous" @click="goBack">
                            <img src="/gui/images/duel-previous.svg">
                        </div>
                        <div class="LeadersBoard__header-title --bold">
                           LEADERS BOARD
                        </div>
                        <div class="LeadersBoard__header-close" @click="close">
                            <img src="/gui/images/user-inventory/inventory/close.svg" alt="">
                        </div>
                    </div>
                    <div class="LeadersBoard__navbar">
                        <div
                            v-for="(item, index) in navbarItems"
                            :key="index"
                            class="LeadersBoard__navbar-item --bold"
                            :class="{ 'active': activeNavItem === index }"
                            @click="setActiveNavItem(index)"
                        >
                            {{ item }}
                        </div>
                    </div>
                </div>
                <div class="LeadersBoard__body">
                    <div class="LeadersBoard__content">
                        <div class="LeadersBoard__info">
                            <div class="LeadersBoard__info-avatar">
                                <img src="/gui/images/leaders-board/main-avatar.png" alt="">
                                <div class="LeadersBoard__info-avatar-animation" v-for="(item, index) in 3" :key="index">
                        
                                </div>    
                            </div>
                            <div class="LeadersBoard__info-details">
                                <h3 class="--bold">ivemaker</h3>
                                <p class="exo2-font">My position: 10543</p>
                                <p class="exo2-font">
                                    {{ getMyInfoLabel(activeNavItem) }}:
                                    {{ getMyInfoValue(activeNavItem) }}
                                </p>
                            </div>
                        </div>
                        <div class="LeadersBoard__hero-list">
                            <div v-for="(leader, index) in leaders.slice(0, 3)"  :class="['LeadersBoard__hero', getCrownType(index)]">
                                <LeadersHero  
                                :avatar="leader.avatar" 
                                :uniqueDuels="leader.uniqueDuels" 
                                :name="leader.name" 
                                :crown="getCrown(index)" 
                                :crownType="getCrownType(index)" 
                                :activeNavItem="activeNavItem"
                                />
                            </div>
                        </div>
                        <div class="LeadersBoard__ranking-list">
                            <div v-for="(leader, index) in displayedLeaders.slice(3)" class="LeadersBoard__ranking-item">
                                <div class="LeadersBoard__ranking-item-avatar">
                                    <img :src="getRankingAvatar(activeNavItem)" alt="">
                                </div>
                                <div class="LeadersBoard__ranking-item-details">
                                    <div class="LeadersBoard__ranking-item-details-text">
                                        <h3 class="exo2-font">{{ getRankingName(activeNavItem, index) }}</h3>
                                        <p class="exo2-font">
                                            {{ getMyInfoLabel(activeNavItem) }}: {{ getRankingDetail(activeNavItem, index) }}
                                        </p>
                                    </div>
                                </div>
                                <div class="LeadersBoard__ranking-item-ranking exo2-font">
                                    {{ getRankingValue(activeNavItem, index) }}
                                </div>
                            </div>
                        </div>

                        <div class="LeadersBoard__load-more" v-if="hasMoreLeaders">
                            <button class="LeadersBoard__load-more-button --bold" @click="loadMore">
                                Load more
                            </button>
                            <div class="LeadersBoard__load-more-animation">
                                <div class="LeadersBoard__load-more-animation-container">
                                    <div v-for="(item, index) in 12" :key="index" class="LeadersBoard__load-more-animation-item">
                                        <img src="/gui/images/leaders-board/btn-animation.svg" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </div>          
    </div>
</template>
<script lang="ts">
import LeadersHero from './LeadersHero/LeadersHero.vue';
export default {
    components: {
        LeadersHero
    },
    data() {
        return {
            myInfo: {
                name: 'ivemaker',
                position: 10543,
                duels: 10543,
                ratings: 'soon',
                friends: 0,
                avatar: '/gui/images/leaders-board/main-avatar.png',
            }, 
            leaders: [
                {
                    name: 'ivemaker',
                    uniqueDuels: 7678,
                    avatar: '/gui/images/leaders-board/avatar-hero1.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 9928,
                    avatar: '/gui/images/leaders-board/avatar-hero2.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 8327,
                    avatar: '/gui/images/leaders-board/avatar-hero3.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 7678,
                    avatar: '/gui/images/leaders-board/avatar-hero1.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 9928,
                    avatar: '/gui/images/leaders-board/avatar-hero2.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 8327,
                    avatar: '/gui/images/leaders-board/avatar-hero3.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 7678,
                    avatar: '/gui/images/leaders-board/avatar-hero1.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 9928,
                    avatar: '/gui/images/leaders-board/avatar-hero2.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 8327,
                    avatar: '/gui/images/leaders-board/avatar-hero3.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 7678,
                    avatar: '/gui/images/leaders-board/avatar-hero1.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 9928,
                    avatar: '/gui/images/leaders-board/avatar-hero2.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 8327,
                    avatar: '/gui/images/leaders-board/avatar-hero3.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 9928,
                    avatar: '/gui/images/leaders-board/avatar-hero2.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 8327,
                    avatar: '/gui/images/leaders-board/avatar-hero3.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 9928,
                    avatar: '/gui/images/leaders-board/avatar-hero2.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 8327,
                    avatar: '/gui/images/leaders-board/avatar-hero3.png',
                },
                {
                    name: 'ivemaker',
                    uniqueDuels: 8327,
                    avatar: '/gui/images/leaders-board/avatar-hero3.png',
                }
            ],
            navbarItems: ['RAITING', 'DUELS', 'FRIENDS'],
            activeNavItem: 1, // Default to 'DUELS'
            displayCount: 10, // Initial number of leaders to display
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
                case 0: return  '/gui/images/leaders-board/raiting.png';
                case 1: return  "/gui/images/leaders-board/other-avatar.png";
                case 2: return  '/gui/images/leaders-board/main-avatar.png';
                default: return  "/gui/images/leaders-board/other-avatar.png";
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
                return '/gui/images/leaders-board/silver-crown.png';
            }
            if (index === 1) {
                return '/gui/images/leaders-board/gold-crown.png';
            }
            if (index === 2) {
                return '/gui/images/leaders-board/bronze-crown.png';
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
            const leadersBoardElement = this.$el.querySelector('.LeadersBoard__content');
            const lastItem = this.$el.querySelector('.LeadersBoard__ranking-item:last-child');
            if (leadersBoardElement && lastItem) {
                lastItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
        }
    }
}
</script>
<style scoped src="./LeadersBoard.css">
    
</style>