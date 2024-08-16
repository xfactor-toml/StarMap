<template>
    <div class="BattleLoadingProgress">
        <BattleAcceptProgress 
          :increase="true"
          :totalTime="0"
          :maxTime="2"
        />
        <h3 class="BattleLoadingProgress__title --bold dots">LOADING</h3>
    </div>
</template>

<script  lang="ts">
    import { BattleAcceptProgress } from '../BattleAcceptProgress';
    export  default {
        name: 'BattleLoadingProgress',
        components: {
            BattleAcceptProgress,
        }
    }
</script>

<style scoped src="./BattleLoadingProgress.css">

</style>