<template>
    <div class="StarDefenderButton">
        <div class="StarDefenderButton__container" ref="container">
            <div class="StarDefenderButton__connectLine">
                <img src="/gui/images/star-defender/connect-line.svg" />
                <div class="StarDefenderButton__content">
                    <div class="StarDefenderButton__bg">
                        <img src="/gui/images/star-defender/bg.svg" />
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
import { PropType } from 'vue';
import { StarScreenPosition } from '@/models';

export default {
    name: 'StarDefenderButton',
    props: {
        starId: {
            type: Number,
        },
        name: {
            type: String,
        },
        title: {
            type: String,
        },
        position: {
            type: Object as PropType<StarScreenPosition>,
        },
    },
    data() {
        return {
            currentX: 0,  
            currentY: 0, 
            targetX: 0,   
            targetY: 0, 
            isMoving: false, 
        };
    },
    mounted() {
        this.currentX = this.position.x;
        this.currentY = this.position.y;
        this.targetX = this.position.x;
        this.targetY = this.position.y;
    },
    watch: {
        position: {
            handler(newPos) {
                this.targetX = newPos.x;
                this.targetY = newPos.y;
                this.startInterpolation(); 
            },
            deep: true,
        },
    },
    methods: {
        handleClick() {
            this.$emit('click');
        },
        showStarTooltip() {
            this.$client.onGamePlateStarNameClick(this.starId);
        },
        startInterpolation() {
            if (!this.isMoving) {
                this.isMoving = true;
                this.interpolatePosition();
            }
        },
        interpolatePosition() {
            const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

            const speed = 0.1; 
            const threshold = 0.5; 

            const update = () => {
                const distX = this.targetX - this.currentX;
                const distY = this.targetY - this.currentY;

                // Update current positions using LERP
                this.currentX = lerp(this.currentX, this.targetX, speed);
                this.currentY = lerp(this.currentY, this.targetY, speed);

                // Update the actual container position
                if (this.$refs.container) {
                    this.$refs.container.style.width = `${this.currentX}px`;
                    this.$refs.container.style.height = `${this.currentY}px`;
                }

                if (Math.abs(distX) > threshold || Math.abs(distY) > threshold) {
                    requestAnimationFrame(update);
                } else {
                    this.currentX = this.targetX;
                    this.currentY = this.targetY;
                    this.$refs.container.style.width = `${this.targetX}px`;
                    this.$refs.container.style.height = `${this.targetY}px`;
                    this.isMoving = false; 
                }
            };

            update();
        },
    },
};
</script>



<style scoped src="./StarDefenderButton.css"></style>