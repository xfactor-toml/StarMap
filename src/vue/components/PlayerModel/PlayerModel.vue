<template>
    <div class="PlayerModel" >
        <img :src="background"/>
        <div class="PlayerModel__pic">
            <img :src="player?.avatar"/>
        </div>
        <div class="PlayerModel__info" @click="click">
            <img :src="info"/>
        </div>

        <div class="PlayerModel__shadow" @click.stop="pick"/>

    </div>
</template>

<script lang="ts"> 
import { defineComponent, PropType } from 'vue';
import { PlayerType } from '@/types';
    export default {
        name: "PlayerModel",
        props: {
            background: {
                type: String
            },
            player: {
                type: Object as PropType<PlayerType>,
            },
            info: {
                type: String
            }
        },
        methods: {
           click() {
            this.$emit('click', this.player)
           },
           pick() {
             this.$emit('pick', this.player)
           }
        }
    }
</script>

<style scoped src="./PlayerModel.css">

</style>