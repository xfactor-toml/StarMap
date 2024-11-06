<template>
    <div class="StarDefenderButton">
      <div class="StarDefenderButton__wrapper" ref="wrapper">
        <div class="StarDefenderButton__container">
          <div class="StarDefenderButton__connectLine">
            <img src="/gui/images/star-defender/connect-line.svg"/>
            <div class="StarDefenderButton__content">
              <div class="StarDefenderButton__bg">
                <img src="/gui/images/star-defender/bg.svg"/>
                <template v-if="isSearching">
                  <div class="StarDefenderButton__name">
                    Star Defender
                  </div>
                  <div class="StarDefenderButton__search">
                    <h4 class="StarDefenderButton__search-title --bold">
                      {{ displayText }}
                    </h4>
                    <div class="StarDefenderButton__loading">
                      <div
                        v-for="dot in dotsAmount"
                        :key="dot"
                        class="StarDefenderButton__dot"
                        :class="{
                          'is-active': dot === activeDot,
                          'is-disabled': interval === null,
                        }"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="StarDefenderButton__name" @click.stop="showStarTooltip">
                    {{ name }}
                  </div>
                  <div class="StarDefenderButton__title --bold" @click="handleClick">
                    {{ title }}
                  </div>
                  <div class="StarDefenderButton__online exo2-font">
                    on line: 4000469
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { StarScreenPosition } from '@/models';
  
  export default defineComponent({
    name: 'StarDefenderButton',
    props: {
      starId: Number,
      name: String,
      title: String,
      position: Object as PropType<StarScreenPosition>,
      selectedMenu: {
        type: String,
      },
      updateInterval: {
        type: Number,
        default: 143, // milliseconds per dot
      },
    },
    data() {
      return {
        activeDot: 1,
        dotsAmount: 7,
        initialTime: Date.now(),
        interval: null as number | null,
        passedTime: 0,
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
        animationFrame: null as number | null,
        wrapperEl: null as HTMLElement | null,
        isAnimating: false,
        loadedImages: {
          connectLine: false,
          bg: false,
        },
      };
    },
    computed: {
      displayText() {
        if (this.selectedMenu === 'SEARCH GAME') return 'SEARCHING';
        else if (this.selectedMenu === 'DUEL') return 'DUEL WAITING';
        else return 'BOT WAITING';
      },
      isSearching() {
        return (
          this.selectedMenu === 'SEARCH GAME' ||
          this.selectedMenu === 'PLAY WITH A BOT' ||
          this.selectedMenu === 'DUEL'
        );
      },
    },
    mounted() {
      // Initialize the loading dots animation
      this.interval = setInterval(() => {
        const nextDot = this.activeDot + 1;
        this.passedTime = Date.now() - this.initialTime;
        this.activeDot = nextDot > this.dotsAmount ? 1 : nextDot;
      }, this.updateInterval);
  
      // Set up the initial positions
      this.wrapperEl = this.$refs.wrapper as HTMLElement;
      if (this.wrapperEl && this.position) {
        this.currentX = this.position.x;
        this.currentY = this.position.y;
        this.targetX = this.position.x;
        this.targetY = this.position.y;
        this.updateTransform();
      }
  
      // Start the continuous animation loop
      this.isAnimating = true;
      this.animate();
    },
    beforeUnmount() {
      // Stop the loading dots interval
      if (this.interval) {
        clearInterval(this.interval);
      }
  
      // Stop the animation loop
      this.isAnimating = false;
    },
    watch: {
      position(newPos) {
        if (newPos) {
          this.targetX = newPos.x;
          this.targetY = newPos.y;
          // No need to start or stop animation; it's continuous
        }
      },
    },
    methods: {
      handleClick() {
        this.$emit('click');
      },
      showStarTooltip() {
        this.$client.onGamePlateStarNameClick(this.starId);
      },
      animate() {
        if (!this.isAnimating) return;
  
        this.interpolatePosition();
  
        this.animationFrame = requestAnimationFrame(this.animate);
      },
      interpolatePosition() {
        const speed = 0.5; // Adjust speed for smoothness
        const threshold = 0.1; // Threshold to stop updating when close enough
        const distX = this.targetX - this.currentX;
        const distY = this.targetY - this.currentY;

  
        // Update current positions towards target positions
        this.currentX += distX * speed;
        this.currentY += distY * speed;
  
        this.updateTransform();
  
        // Optionally, you can check if the object has reached the target
        // and skip updating to improve performance
        if (Math.abs(distX) < threshold && Math.abs(distY) < threshold) {
          this.currentX = this.targetX;
          this.currentY = this.targetY;
          this.updateTransform();
        }
      },
      updateTransform() {
        if (this.wrapperEl) {
          this.wrapperEl.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
        }
      },
      handleImageLoad(imageKey: string) {
        this.loadedImages[imageKey] = true;
      },
    },
  });
  </script>
  
  <style scoped src="./StarDefenderButton.css"></style>
  