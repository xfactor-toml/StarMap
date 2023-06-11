<template>
  <div class="StarTooltip" :class="tooltipClasses" :style="tooltipStyle" ref="tooltip">
    <img class="StarTooltip__preview" :src="star.preview" />
    <div class="StarTooltip__meta">
      <h3 class="StarTooltip__name">Star: {{ star.name }}</h3>
      <p class="StarTooltip__description">{{ star.description }}</p>
      <p class="StarTooltip__owner">Owner: {{ star.croppedOwner }}</p>
    </div>
    <button
      class="StarTooltip__divein"
      type="button"
      @click="diveIn()"
      @mouseenter="diveInButtonHover()"
    >
      Dive in
    </button>
    <button
      class="StarTooltip__close"
      type="button"
      title="close"
      @click="hide()"
      @mouseenter="hideButtonHover()"
    />
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
        transform: `
          translateX(-12px)
          translateY(-78px)
          scaleX(${this.computedScale * (this.intersection.x ? -1 : 1)})
        `
      };
    },
    tooltipClasses() {
      return {
        'is-reflect': this.intersection.x,
        [`is-level-${this.star.level}`]: true
      };
    }
  },
  methods: {
    recalcIntersection() {
      const { innerWidth, innerHeight } = window;
      const { width, height } = this.$refs.tooltip.getBoundingClientRect();

      return {
        x: width > innerWidth - this.star.position.x,
        y: height > innerHeight - this.star.position.y
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
