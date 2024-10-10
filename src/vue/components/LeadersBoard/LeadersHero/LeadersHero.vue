<template >
    <div class="LeadersHero">   
        <div class="LeadersHero__crown">
            <img :src="crown" alt="">
        </div>
        <div :class="['LeadersHero__avatar', crownTypeClass]">
            <img :src="getHeroAvatar(activeNavItem)" alt="Avatar Image">
        </div>
        <div class="LeadersHero__info exo2-font">
            <h3>{{ getHeroName(activeNavItem) }}</h3>
            <p > {{ getHeroLabel(activeNavItem) }}:</p>
            <p>{{ getHeroValue(activeNavItem) }}</p>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    props: {
        avatar: {
            type: String,
            required: true
        },
        crown: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        uniqueDuels: {
            type: Number,
            required: true
        },
        crownType: { 
            type: String,
            required: true
        }, 
        activeNavItem: {
            type: Number,
            required: true
        }
    },
    computed: {
        crownTypeClass(): string {
            switch (this.crownType) {
                case 'gold':
                    return 'gold';
                case 'silver':
                    return 'silver';
                case 'bronze':
                    return 'bronze';
                default:
                    return '';
            }
        }
    },
    methods: {
        getHeroName(activeNavItem: number) {
            switch (activeNavItem) {
                case 0: return  'unknown';
                case 1: return  this.name;
                default: return  this.name;
            }
        },
        getHeroLabel(activeNavItem: number) {
            switch (activeNavItem) {
                case 0: return  'Raiting';
                case 1: return  'Unique duels';
                default: return  'unique duels';
            }
        },  
        getHeroValue(activeNavItem: number) {
            switch (activeNavItem) {
                case 0: return  'soon';
                case 1: return  this.uniqueDuels;
                default: return  this.uniqueDuels;
            }
        },
        getHeroAvatar(activeNavItem: number) {
            switch (activeNavItem) {
                case 0: return  '/gui/images/leaders-board/raiting.png';
                case 1: return  this.avatar;
                default: return  this.avatar;
            }
        }
    }
}
</script>
<style scoped src="./LeadersHero.css">
    
</style>