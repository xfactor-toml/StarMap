<template>
  <div :class="`BattleConnectIndicator is-${type}`">
    <div class="BattleConnectIndicator__svg">
      <svg viewBox="0 0 743 794" fill="none">
        <g class="BattleConnectIndicator__strokes">
          <template v-for="n in 10" :key="n">
            <path
              ref="stroke"
              stroke="#00FFFF" 
              stroke-width="10"
              stroke-miterlimit="10"
              d="M371.495 613.155C367.065 613.155 362.705 611.985 358.885 609.775L193.535 514.305C185.755 509.815 180.925 501.445 180.925 492.455V301.525C180.925 292.545 185.755 284.175 193.535 279.675L358.885 184.205C362.715 181.995 367.075 180.825 371.495 180.825C375.915 180.825 380.275 181.995 384.105 184.205L549.455 279.675C557.235 284.165 562.065 292.535 562.065 301.525V492.455C562.065 501.435 557.235 509.805 549.455 514.305L384.105 609.775C380.275 611.985 375.915 613.155 371.495 613.155Z"
            />
          </template>
        </g>
        <path d="M371.495 613.155C367.065 613.155 362.705 611.985 358.885 609.775L193.535 514.305C185.755 509.815 180.925 501.445 180.925 492.455V301.525C180.925 292.545 185.755 284.175 193.535 279.675L358.885 184.205C362.715 181.995 367.075 180.825 371.495 180.825C375.915 180.825 380.275 181.995 384.105 184.205L549.455 279.675C557.235 284.165 562.065 292.535 562.065 301.525V492.455C562.065 501.435 557.235 509.805 549.455 514.305L384.105 609.775C380.275 611.985 375.915 613.155 371.495 613.155Z" stroke="#00FFFF" stroke-width="10" stroke-miterlimit="10"/>
        <g filter="url(#filter0_i_70_2973)">
          <path d="M371.495 603.155C368.825 603.155 366.195 602.445 363.885 601.115L198.535 505.645C193.835 502.935 190.925 497.885 190.925 492.465V301.535C190.925 296.115 193.845 291.065 198.545 288.355L363.895 192.885C366.205 191.555 368.845 190.845 371.505 190.845C374.165 190.845 376.805 191.555 379.125 192.885L544.475 288.345C549.175 291.055 552.085 296.105 552.085 301.525V492.455C552.085 497.875 549.165 502.925 544.475 505.635L379.125 601.105C376.815 602.435 374.185 603.145 371.515 603.145L371.495 603.155Z" fill="#00FFFF" fill-opacity="0.01"/>
        </g>
        <path
          v-if="progress > 0 && progress < 100"
          class="BattleConnectIndicator__progress"
          d="M 384.515 131.745 C 384.515 131.745 397.355 135.185 408.635 141.685 L 574.005 237.165 V 237.175 C 596.925 250.415 611.165 275.075 611.165 301.535 V 492.465 C 611.165 518.935 596.925 543.595 574.005 556.825 L 408.655 652.295 C 397.375 658.805 384.525 662.245 371.495 662.245 C 358.465 662.245 345.625 658.805 334.345 652.295 L 168.985 556.825 C 146.065 543.595 131.825 518.935 131.825 492.465 V 301.535 C 131.825 275.075 146.065 250.415 168.975 237.175 L 334.335 141.705 C 345.625 135.185 358.475 131.745 371.495 131.745 Z"
          stroke-width="22"
          stroke-miterlimit="10"
          :stroke-dasharray="dasharray"
          :stroke-dashoffset="dashoffset"
        />
        <defs>
          <filter id="filter0_i_70_2973" x="190.925" y="190.845" width="361.16" height="412.31" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="50"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_70_2973"/>
          </filter>
        </defs>
      </svg>
    </div>
    <div class="BattleConnectIndicator__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { default as anime } from 'animejs';
import { wait } from '@/utils';

const createAnimation = async (elements) => {
  const duration = 3000
  const offset = duration / elements.length
  const animations = []

  elements.forEach(async (element, index) => {
    const animation = anime({
      targets: element,
      opacity: [1, 0],
      strokeWidth: [10, 0],
      scale: [1, 1.9],
      loop: true,
      duration,
      autoplay: false,
      easing: 'linear',
    })

    const seek = duration - (offset * (index + 1))

    animation.seek(seek)
    animations.push([animation, seek])
  })

  await wait()

  const play = () => animations.forEach(([animation]) => animation.play())

  const restart = () => animations.forEach(([animation, seek]) => {
    animation.pause()
    animation.seek(seek)
    animation.play()
  })

  return {
    play,
    restart,
  }
}

export default {
  name: 'BattleConnectIndicator',
  props: {
    progress: {
      type: Number,
      required: true,
    },
    type: {
      type: String as PropType<'accept' | 'connect' | 'loading'>,
      default: 'accept',
    },
    mode: {
      type: String as PropType<'timer' | 'loading'>,
      default: 'timer',
    },
  },
  data: () => ({
    animation: {},
    dasharray: 1611,
  }),
  computed: {
    dashoffset() {
      const direction = this.mode === 'timer' ? -1 : 1
      const fraction = this.dasharray / 100 * this.progress * direction

      return this.mode === 'timer' ? fraction : this.dasharray - fraction
    },
  },
  methods: {
    handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        this.animation.restart()
      }
    }
  },
  async mounted() {
    this.animation = await createAnimation(this.$refs.stroke)
    this.animation.play()

    addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  unmounted() {
    removeEventListener("visibilitychange", this.handleVisibilityChange);
  }
};
</script>

<style scoped src="./BattleConnectIndicator.css"/>
