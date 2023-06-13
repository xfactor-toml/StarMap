<template>
  <div class="StarCreationTooltip" :class="tooltipClasses" :style="tooltipStyle" ref="tooltip">
    <img class="StarCreationTooltip__preview" :src="preview" />
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
import { StarPosition } from '@/models';
import { PropType } from 'vue';

export default {
  name: 'StarCreationTooltip',
  props: {
    starPosition: {
      type: Object as PropType<StarPosition>
    }
  },
  data: () => ({
    intersection: { x: false, y: false },
    computedScale: 1,
    preview: './gui/images/phantom-star.png'
  }),
  computed: {
    tooltipStyle() {
      return {
        top: `${this.starPosition.screen.y}px`,
        left: `${this.starPosition.screen.x}px`,
        transform: `
          translateX(-10px)
          translateY(-86px)
          scaleX(${this.computedScale * (this.intersection.x ? -1 : 1)})
        `
      };
    },
    tooltipClasses() {
      return {
        'is-reflect': this.intersection.x
      };
    }
  },
  methods: {
    recalcIntersection() {
      const { innerWidth, innerHeight } = window;
      const { width, height } = this.$refs.tooltip.getBoundingClientRect();

      return {
        x: width > innerWidth - this.starPosition.screen.x,
        y: height > innerHeight - this.starPosition.screen.y
      };
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
  }
};
</script>

<style scoped src="./StarCreationTooltip.css"></style>
