<template >
    <div class="EnemyModelControl__row">
        <div class="EnemyModelControl__item">
            <BaseControl  :disabled="true" />
        </div>
        <div class="EnemyModelControl">
            <img src="/gui/images/pre-game-countdown/model-border.svg" />
            <div class="EnemyModelControl__img">
                <img src="/gui/images/battle-player-list/player4.png" />
            </div>
            <div class="EnemyModelControl__boxshadow"/>
            <div class="EnemyModelControl__level orbitron-font --semi-bold">
                {{ level }}
            </div>
        </div>
        <div class="EnemyModelControl__item">
            <BaseControl  :disabled="true" />
        </div>
    </div>
</template>

<script lang="ts">
import { BaseControl } from '../BattleControlPanel/controls/BaseControl';
export default {
    name: 'EnemyModelControl',
    components: {
        BaseControl
    },
    props: {
        level: {
            type: Number,
            required: true,
        },
    
    }
}
</script>

<style scoped src="./EnemyModelControl.css">
</style>
