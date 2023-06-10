<template>
  <div :class="tooltipClasses" :style="tooltipStyle" ref="tooltip">
    <div class="StarTooltip__star" />
    <div class="StarTooltip__info">
      <div class="StarTooltip__info-heading">
        <h2 class="StarTooltip__star-name">{{ star.name }}</h2>
        <span class="StarTooltip__star-level">Lv.{{ star.level }}</span>
      </div>
      <p ref="description" class="StarTooltip__star-description">
        {{ star.description }}
      </p>
    </div>
    <div class="StarTooltip__race">
      <img class="StarTooltip__race-image" :src="star.preview" />
      <p class="StarTooltip__race-name">{{ star.race }}</p>
    </div>
    <div class="StarTooltip__buttons">
      <button
        class="StarTooltip__button is-close"
        type="button"
        @click="hide()"
        @mouseenter="hideButtonHover()"
      >
        Close
      </button>
      <button
        class="StarTooltip__button is-dive-in"
        type="button"
        @click="diveIn()"
        @mouseenter="diveInButtonHover()"
      >
        Dive in
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Star } from '@/models';
import { PropType } from 'vue';

export default {
  name: 'StarTooltip',
  props: {
    star: {
      type: Object as PropType<Star>
    }
  },
  data: () => ({
    intersection: { x: false, y: false },
    computedScale: 1
  }),
  computed: {
    tooltipStyle() {
      return {
        top: `${this.star.position.y}px`,
        left: `${this.star.position.x}px`,
        transformOrigin: `${this.intersection.x ? 'calc(100% - 70px)' : '70px'} center`,
        transform: `
          translateX(${this.intersection.x ? 'calc(-100% + 70px)' : '-70px'})
          translateY(${this.intersection.y ? '-50%' : '-70px'})
          scale(${this.computedScale})
        `
      };
    },
    tooltipClasses() {
      return {
        StarTooltip: true,
        'is-reflect': this.intersection.x,
        [`is-${this.star.race.toLowerCase()}`]: true
      };
    }
  },
  methods: {
    recalcIntersection() {
      const { innerWidth, innerHeight } = window;

      return {
        x: this.star.position.x > innerWidth - this.star.position.x,
        y: this.star.position.y > innerHeight - this.star.position.y
      };
    },
    calcScale() {
      const { innerWidth } = window;
      const { width } = this.$refs.tooltip.getBoundingClientRect();

      const factor = 1.1;
      const area = this.intersection.x ? this.star.position.x : innerWidth - this.star.position.x;
      const scale = Math.min((area / width) * factor, 1) * this.star.scale;

      return scale;
    },
    hide() {
      this.$emit('hide');
    },
    hideButtonHover() {
      this.$emit('hideButtonHover');
    },
    diveIn() {
      this.$emit('diveIn');
    },
    diveInButtonHover() {
      this.$emit('diveInButtonHover');
    }
  },
  mounted() {
    this.intersection = this.recalcIntersection();
    this.computedScale = this.calcScale();
  }
};
</script>

<style scoped src="./StarTooltip.css"></style>
