<template>
    <div class="AnimationButton" :class="buttonTypeClass">
       <h5 class="AnimationButton__title --bold"> {{ name }}</h5>
       <div class="AnimationButton__bg">
        <img :src="`/gui/images/animation-button/${buttonType}.png`" alt="animation-button">
       </div>
       <div v-for="i in 26" :key="i" class="AnimationButton__animation">
            <svg width="290" height="82" viewBox="0 0 290 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.9303 74.6441C18.9182 78.632 24.327 80.8724 29.9667 80.8724L260.033 80.8724C265.673 80.8724 271.082 78.632 275.07 74.6441L282.899 66.8147C286.887 62.8268 289.127 57.418 289.127 51.7783V29.6332C289.127 23.9935 286.887 18.5847 282.899 14.5968L275.07 6.76733C271.082 2.77943 265.673 0.539055 260.033 0.539063H29.9667C27.1742 0.539068 24.409 1.08912 21.8291 2.15778C19.2491 3.22643 16.9049 4.79276 14.9303 6.76738L7.10085 14.5968C3.11295 18.5847 0.872564 23.9935 0.872559 29.6332V51.7783C0.872569 57.418 3.11295 62.8268 7.10085 66.8147L14.9303 74.6441Z" :stroke="gradientEnd" stroke-opacity="0.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
       </div>
    </div>
</template>
<script lang="ts">
export default {
    name: 'AnimationButton',
    props: {
      buttonType: {
        type: String,
        default: 'yellow'
      },
       name: {
        type: String,
        default: 'OPEN BOX'
       }
    },
    computed: {
      buttonTypeClass() {
        return `--${this.buttonType}`;
      },
      gradientStart() {
        const colors = {
          yellow: '#FF9900',
          blue: '#00C6FB',
         
        };
        return colors[this.buttonType] || colors.yellow;
      },
      gradientEnd() {
        const colors = {
          yellow: '#FEE140',
          blue: '#005BEA',
        
        };
        return colors[this.buttonType] || colors.yellow;
      }
    }
}
</script>
<style scoped src="./AnimationButton.css"></style>