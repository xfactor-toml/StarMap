<template>   
    <div class="StarDefenderButton">
        <div class="StarDefenderButton__container" ref="container">
                <div class="StarDefenderButton__connectLine">
                <img src="/gui/images/star-defender/connect-line.svg" />
                <div class="StarDefenderButton__content">
                    <div class="StarDefenderButton__bg" >
                        <img src="/gui/images/star-defender/bg.svg"/>
                        <div class="StarDefenderButton__name" @click.stop="showStarTooltip">
                            {{ name }}
                        </div>
                        <div class="StarDefenderButton__title --bold" @click="handleClick">
                            {{ title }}
                        </div>
                        <div class="StarDefenderButton__online exo2-font">
                            on line: 4000469
                        </div>
                    </div>
                </div>
                </div>
        </div>
    </div>
</template>

<script lang="ts">
import { formatDuration } from '@/utils';
import { PropType, watch } from 'vue';
import { StarScreenPosition } from '@/models';
import anime from 'animejs';

export default {
    name: 'StarDefenderButton',
    props: {
        name: {
            type: String
        },
        title: {
            type:String
        },
        position: {
        type: Object as PropType<StarScreenPosition>
        }
    },
    mounted() {
        this.updatePosition();
    },
    watch: {
        position: {
            handler() {
                this.updatePosition();
            },
            deep: true
        }
    },
    methods: {
        handleClick() {
            this.$emit('click')
        },
        showStarTooltip() {
            this.$emit('showStarTooltip')
        },
        updatePosition() {
            anime({
                targets: this.$refs.container,
                width: `${this.position.x}px`,
                height: `${this.position.y}px`,
                easing: 'easeOutQuad',
                duration: 500
            });
        }
    }
}
</script>

<style scoped src="./StarDefenderButton.css"></style>
