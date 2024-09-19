<template>
    <div class="BattleInitPlayerMember">
        <div class="BattleInitPlayerMember__content">
            <div class="BattleInitPlayerMember__content-container">
                <img src="/gui/images/battle-vs-player-info.svg">
                <div class="BattleInitPlayerMember__info orbitron-font">
                      <div class="BattleInitPlayerMember__race --semi-bold">{{ race }}</div>
                      <!-- <div class="BattleInitPlayerMember__wallet">Telegram id</div>   -->
                      <div class="BattleInitPlayerMember__telegram"> ivmaker</div>
                      <div class="BattleInitPlayerMember__name --semi-bold">{{ truncatedName }}</div>  
                      <div class="BattleInitPlayerMember__starOwner">{{  truncatedStar }}</div>  
                </div>
                <div class="BattleInitPlayerMember__pic">
                    <div class="BattleInitPlayerMember__pic__container">
                        <img src="/gui/images/battle-vs-enemy-bg.svg">
                        <div class="BattleInitPlayerMember__pic__img">
                            <img src="/gui/images/battle-vs-player-pic.png">
                        </div>
                        <div class="BattleInitPlayerMember__pic__shadow"></div>
                    </div>
                </div>
            </div>
        </div>
        <hr class="BattleInitPlayerMember__left-line">
        <hr class="BattleInitPlayerMember__right-line">
    </div>
</template>
  
<script  lang="ts">
export default {
    name: 'BattleInitPlayerMember',
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

<style scoped src="./BattleInitPlayerMember.css">

</style>