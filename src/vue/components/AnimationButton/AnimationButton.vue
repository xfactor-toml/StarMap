<template>
    <div class="AnimationButton" :class="buttonTypeClass">
       <h5 class="AnimationButton__title --bold"> {{ name }}</h5>
       <div class="AnimationButton-bg">
         <svg width="286" height="77" viewBox="0 0 286 77" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.6013 70.9737C16.3565 72.7289 18.4402 74.1212 20.7335 75.0711C23.0268 76.021 25.4848 76.51 27.967 76.51L258.034 76.5099C263.047 76.5099 267.854 74.5185 271.399 70.9737L279.229 63.1442C282.773 59.5994 284.765 54.7916 284.765 49.7785V27.6335C284.765 25.1513 284.276 22.6933 283.326 20.4C282.376 18.1068 280.984 16.023 279.229 14.2678L271.399 6.43835C267.854 2.89355 263.047 0.902106 258.034 0.9021L27.967 0.902149C22.9539 0.902135 18.1461 2.89357 14.6013 6.43835L6.77186 14.2678C5.01664 16.023 3.62433 18.1068 2.67442 20.4C1.7245 22.6933 1.23559 25.1513 1.2356 27.6335V49.7785C1.2356 52.2608 1.7245 54.7187 2.67442 57.012C3.62433 59.3053 5.01664 61.389 6.77185 63.1443L14.6013 70.9737Z" fill="url(#paint0_linear_90_159)" stroke="url(#paint1_linear_90_159)" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_90_159" x1="143" y1="0.9021" x2="143" y2="76.51" gradientUnits="userSpaceOnUse">
                <stop :stop-color="gradientStart"/>
                <stop offset="1" :stop-color="gradientEnd"/>
            </linearGradient>
            <linearGradient id="paint1_linear_90_159" x1="143" y1="76.51" x2="143" y2="0.9021" gradientUnits="userSpaceOnUse">
                <stop :stop-color="gradientStart"/>
                <stop offset="1" :stop-color="gradientEnd"/>
            </linearGradient>
            </defs>
         </svg>
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