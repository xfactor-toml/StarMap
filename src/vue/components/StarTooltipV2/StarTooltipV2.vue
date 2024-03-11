<template>
  <div class="StarTooltipV2" :class="tooltipClasses" :style="tooltipStyle" ref="tooltip">
    <svg class="StarTooltipV2__dot" viewBox="0 0 20.8 21">
      <path
        fill="#040809"
        stroke="currentColor"
        stroke-miterlimit="10"
        d="M10.4,20.4c5.5,0,9.9-4.4,9.9-9.9c0-5.5-4.4-9.9-9.9-9.9C5,0.6,0.5,5,0.5,10.5
        C0.5,16,5,20.4,10.4,20.4z"
      />
      <path
        style="opacity: 0.3"
        fill="currentColor"
        d="M10.4,14.5c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4c-2.2,0-4,1.8-4,4C6.4,12.7,8.2,14.5,10.4,14.5z"
      />
      <path
        style="opacity: 0.53"
        fill="currentColor"
        d="M10.4,13.5c1.7,0,3-1.3,3-3c0-1.7-1.3-3-3-3c-1.7,0-3,1.3-3,3C7.4,12.2,8.8,13.5,10.4,13.5z"
      />
      <path
        style="opacity: 0.77"
        fill="currentColor"
        d="M10.4,12.5c1.1,0,2-0.9,2-2s-0.9-2-2-2c-1.1,0-2,0.9-2,2S9.3,12.5,10.4,12.5z"
      />
      <path
        fill="currentColor"
        d="M10.4,11.5c0.6,0,1-0.4,1-1s-0.4-1-1-1c-0.6,0-1,0.4-1,1S9.9,11.5,10.4,11.5z"
      />
      <path
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        d="M10.4,18.5c4.4,0,8-3.6,8-8c0-4.4-3.6-8-8-8c-4.4,0-8,3.6-8,8C2.4,14.9,6,18.5,10.4,18.5z"
      />
    </svg>
    <div class="StarTooltipV2__line">
      <svg :viewBox="connectLine.viewBox" preserveAspectRatio="none">
        <path fill="none" stroke="currentColor" :d="connectLine.path" />
      </svg>
    </div>
    <div class="StarTooltipV2__body">
      <img class="StarTooltipV2__preview" :src="star.preview" />
      <div class="StarTooltipV2__meta">
        <h3 class="StarTooltipV2__name">Star: {{ star.name }}</h3>
        <p class="StarTooltipV2__description">{{ star.description }}</p>
        <p class="StarTooltipV2__owner">Owner: {{ star.croppedOwner }}</p>
      </div>
      <button
        class="StarTooltipV2__divein"
        type="button"
        @click="diveIn()"
        @mouseenter="diveInButtonHover()"
      >
        Dive in
      </button>
      <button
        class="StarTooltipV2__close"
        type="button"
        title="close"
        @click="hide()"
        @mouseenter="hideButtonHover()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { WINDOW_MOBILE_BREAKPOINT, WINDOW_MOBILE_SAFE_ZONE, WINDOW_SAFE_ZONE } from '@/constants';
import { Star, StarScreenPosition } from '@/models';
import { PropType } from 'vue';

const DEFAULT_BODY_SHIFT = -120;
const DOT_SIZE = 20;
const LINE_OFFSET = 50;

export default {
  name: 'StarTooltipV2',
  props: {
    star: {
      type: Object as PropType<Star>
    },
    position: {
      type: Object as PropType<StarScreenPosition>
    }
  },
  data: () => ({
    intersection: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    intersected: {
      x: false,
      y: false
    },
    dotSize: DOT_SIZE,
    bodyShift: 0
  }),
  computed: {
    connectLine() {
      const size = Math.abs(this.bodyShift + LINE_OFFSET);
      const p = factor => Math.trunc(size / factor);

      const startPoint = {
        horizontal: `M ${size - 1} 1`,
        vertical: `M 1 ${size - 1}`
      };

      const endPoint = {
        horizontal: `S ${p(6.2)} ${p(2.13)} 1 ${size - 1}`,
        vertical: `S ${size - 1} 1 ${size - 1} 1`
      };

      const curve = {
        horizontal: `L ${p(2.06)} 1 C ${p(3.44)} 1 ${p(3.87)} ${p(5.63)} ${p(5.16)} ${p(2.69)}`,
        vertical:
          size > 10 ? `L 1 ${p(1.73)} C 1 ${p(2.1)} ${p(20)} ${p(2.22)} ${p(5)} ${p(2.66)}` : ``
      };

      const path = {
        horizontal: `${startPoint.horizontal} ${curve.horizontal} ${endPoint.horizontal}`,
        vertical: `${startPoint.vertical} ${curve.vertical} ${endPoint.vertical}`
      };

      return {
        size,
        viewBox: `0 0 ${size} ${size}`,
        path: this.intersected.x || this.intersected.y ? path.vertical : path.horizontal
      };
    },
    tooltipStyle() {
      return {
        ['--dot-size']: `${this.dotSize}px`,
        ['--body-shift']: `${this.bodyShift}px`,
        ['--connect-line-width']: `${this.connectLine.size}px`,
        top: `${this.position.y}px`,
        left: `${this.position.x}px`
      };
    },
    tooltipClasses() {
      return {
        [`is-level-${this.star.params.level}`]: true,
        leftIntersection: this.intersection.left > Math.abs(DEFAULT_BODY_SHIFT) / 2,
        rightIntersection: this.intersection.right > 0,
        bottomIntersection: this.intersection.bottom > 0,
        topIntersection: this.intersection.top > 0,
        horizontalIntersection: this.intersected.x,
        verticalIntersection: this.intersected.y
      };
    }
  },
  methods: {
    getIntersection() {
      const { innerWidth, innerHeight } = window;
      const { width, height } = (this.$refs.tooltip as HTMLElement).getBoundingClientRect();

      const isMobileResolution = innerWidth <= WINDOW_MOBILE_BREAKPOINT;
      const safeZone = isMobileResolution ? WINDOW_MOBILE_SAFE_ZONE : WINDOW_SAFE_ZONE;
      const bottomSafeZone = safeZone + (this.intersected.x && isMobileResolution ? 100 : 0);

      const left = safeZone - this.position.x - this.bodyShift;
      const right = width - (innerWidth - safeZone - this.position.x);
      const top = this.intersected.x ? 0 : (this.position.y - 100 - safeZone) * -1;
      const bottom = height - (innerHeight - bottomSafeZone - this.position.y);

      return {
        top: Math.max(top, 0),
        bottom: Math.max(bottom, 0),
        left: Math.max(left, 0),
        right: Math.max(right, 0)
      };
    },
    async recalcIntersection() {
      this.intersection = this.getIntersection();

      if (this.intersection.right > 0 || this.intersection.left > 0) {
        this.bodyShift = DEFAULT_BODY_SHIFT;
        this.intersected.x = true;
      }

      await this.$nextTick();

      this.intersection = this.getIntersection();

      if (this.intersection.bottom > 0) {
        this.intersected.y = true;
      }

      if (this.intersection.right > 0) {
        this.bodyShift = this.intersection.right * -1 + DEFAULT_BODY_SHIFT;
      }

      await this.$nextTick();

      this.intersection = this.getIntersection();

      if (this.intersection.left > 0) {
        this.bodyShift = this.bodyShift + this.intersection.left;
      }
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
    this.recalcIntersection();
  }
};
</script>

<style scoped src="./StarTooltipV2.css"></style>
