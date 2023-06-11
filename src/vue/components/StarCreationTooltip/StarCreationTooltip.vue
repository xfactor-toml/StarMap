<template>
  <div class="StarCreationTooltip" :class="tooltipClasses" :style="tooltipStyle" ref="tooltip">
    <img class="StarCreationTooltip__preview" :src="star.preview" />
    <button
      class="StarCreationTooltip__create"
      type="button"
      @click="create()"
      @mouseenter="createButtonHover()"
    >
      Create star
    </button>
    <button
      class="StarCreationTooltip__close"
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
  name: 'StarCreationTooltip',
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
          translateX(-10px)
          translateY(-86px)
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
    create() {
      this.$emit('create');
    },
    createButtonHover() {
      this.$emit('createButtonHover');
    }
  },
  mounted() {
    this.intersection = this.recalcIntersection();
    this.computedScale = this.calcScale();
  }
};
</script>

<style scoped src="./StarCreationTooltip.css"></style>
