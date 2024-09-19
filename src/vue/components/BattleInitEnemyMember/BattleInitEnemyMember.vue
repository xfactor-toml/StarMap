<template>
    <div class="BattleInitEnemyMember">
        <div class="BattleInitEnemyMember__content ">
            <div class="BattleInitEnemyMember__content-container">
                <img src="/gui/images/battle-vs-enemy-info.svg">
                <div class="BattleInitEnemyMember__info orbitron-font">
                      <div class="BattleInitEnemyMember__starOwner">{{  truncatedStar }}</div>  
                      <div class="BattleInitEnemyMember__name --semi-bold">{{ truncatedName }}</div>  
                      <!-- <div class="BattleInitEnemyMember__wallet">Telegram id</div>   -->
                      <div class="BattleInitEnemyMember__telegram"> ivmaker </div>
                      <div class="BattleInitEnemyMember__race --semi-bold">{{ race }}</div>
                </div>
                <div class="BattleInitEnemyMember__pic">
                    <div class="BattleInitEnemyMember__pic__container">
                        <img src="/gui/images/battle-vs-enemy-bg.svg">
                        <div class="BattleInitEnemyMember__pic__img">
                            <img src="/gui/images/battle-vs-enemy-pic.png">
                        </div>
                        <div class="BattleInitEnemyMember__pic__shadow"></div>
                    </div>
                </div>
            </div>
        </div>
        <hr class="BattleInitEnemyMember__left-line">
        <hr class="BattleInitEnemyMember__right-line">
    </div>
</template>

<script  lang="ts">
export default {
    name: 'BattleInitEnemyMember',
    props: {
        name: {
            type: String,
            required: true,
        },
        race: {
            type: String,
            required: true,
        },
        star: {
            type: String,
            required: true,
        },
        isNick: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        truncatedStar() {
            if (this.star.length <= 8) {
                return this.star;
            }
            return `${this.star.slice(0, 4)}...${this.star.slice(-4)}`;
        },
        truncatedName() {
            if (this.name.length <= 8) {
                return this.name;
            }
            return `${this.name.slice(0, 8)}...`;
        }
    }
}
</script>

<style scoped src="./BattleInitEnemyMember.css">

</style>