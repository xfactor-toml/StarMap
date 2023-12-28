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
import { Star, StarScreenPosition } from '@/models';
import { PropType } from 'vue';

export default {
  name: 'StarTooltip',
  props: {
    star: {
      type: Object as PropType<Star>
    },
    position: {
      type: Object as PropType<StarScreenPosition>
    }
  },
  data: () => ({
    intersection: { x: false, y: false },
    computedScale: 1
  }),
  computed: {
    tooltipStyle() {
      return {
        top: `${this.position.y}px`,
        left: `${this.position.x}px`,
        transform: `
          translateX(var(--offset-x))
          translateY(var(--offset-y))
          scaleY(${this.computedScale})
          scaleX(${this.computedScale * (this.intersection.x ? -1 : 1)})
        `
      };
    },
    tooltipClasses() {
      return {
        'is-reflect': this.intersection.x,
        [`is-level-${this.star.params.level}`]: true
      };
    }
  },
  methods: {
    recalcIntersection() {
      const { innerWidth, innerHeight } = window;
      const { width, height } = (this.$refs.tooltip as HTMLElement).getBoundingClientRect();

      return {
        x: width > innerWidth - this.position.x,
        y: height > innerHeight - this.position.y
      };
    },
    calcScale() {
      const { innerWidth } = window;
      const { width } = (this.$refs.tooltip as HTMLElement).getBoundingClientRect();

      const factor = 1.1;
      const area = this.intersection.x ? this.position.x : innerWidth - this.position.x;
      const scale = Math.min((area / width) * factor, 1);

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
    // this.computedScale = this.calcScale();
  }
};
</script>

<style scoped src="./StarTooltip.css"></style>
