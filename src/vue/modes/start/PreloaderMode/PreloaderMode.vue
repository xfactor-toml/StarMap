<template>
  <div class="PreloaderMode">
    <div class="PreloaderScene__logo" />
    <div class="PreloaderScene__circles">
      <svg width="226" height="226" viewBox="0 0 246 274" fill="none">
        <circle cx="123" cy="148" r="122" stroke="#00F0FF" stroke-width="2" />
        <circle cx="123" cy="148" r="49" fill="black" stroke="#00F0FF" stroke-width="2" />
        <circle cx="123" cy="148" r="85" stroke="#00F0FF" stroke-width="2" />
        <circle
          class="rotation-inner"
          cx="123"
          cy="62"
          r="14"
          fill="black"
          stroke="#00F0FF"
          stroke-width="2"
        />
        <g filter="url(#filter0_d_149_2)" class="rotation-outer">
          <circle cx="123" cy="25" r="5" fill="black" />
          <circle cx="123" cy="25" r="4" stroke="#00F0FF" stroke-width="2" />
        </g>
        <defs>
          <filter
            id="filter0_d_149_2"
            x="98"
            y="0"
            width="50"
            height="50"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="10" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.39681 0 0 0 0 0.84 0 0 0 0 0.520903 0 0 0 1 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_149_2" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_149_2"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
    <div class="PreloaderScene__text dots">Interface loading</div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PreloaderMode'
};
</script>

<style scoped src="./PreloaderMode.css"></style>
