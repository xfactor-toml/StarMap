<template>
  <div class="StarCreationTooltipV2" :class="tooltipClasses" :style="tooltipStyle" ref="tooltip">
    <svg class="StarCreationTooltipV2__dot" viewBox="0 0 20.8 21">
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
    <div class="StarCreationTooltipV2__line">
      <svg :viewBox="connectLine.viewBox" preserveAspectRatio="none">
        <path fill="none" stroke="currentColor" :d="connectLine.path" />
      </svg>
    </div>
    <div class="StarCreationTooltipV2__body">
      <svg viewBox="0 0 307.7 137">
        <path
          id="star-create-tooltip-bg"
          fill="currentColor"
          d="M68.1,132.9c-35.7,0-64.8-29.1-64.8-64.8c0-35.7,29.1-64.8,64.8-64.8c18.6,0,36.4,8,48.7,22.1
          c1.1,1.3,2.7,2,4.4,2h138c3-9.4,11.8-16,21.9-16c0.4,0,0.7,0,1,0c11.8,0.5,21.4,10.2,21.9,21.9c0.5,10.4-6.2,19.9-16,23v33.6
          c0,10.5-8.5,19-19,19H121.2c-1.7,0-3.3,0.7-4.4,2C104.4,124.8,86.7,132.9,68.1,132.9L68.1,132.9z"
        />
        <path
          id="star-create-tooltip-innerline"
          fill="currentColor"
          style="filter: brightness(0.7) saturate(1.2)"
          d="M284.7,52.9c-0.4,0.1-0.6,0.5-0.6,0.9v36c0,8.3-6.7,15-15,15H121.2c-2.8,0-5.6,1.2-7.4,3.3
          c-11.2,12.7-27.5,20.7-45.7,20.7c-33.5,0-60.8-27.3-60.8-60.8c0-33.5,27.3-60.8,60.8-60.8c18.2,0,34.5,8,45.7,20.7
          c1.9,2.1,4.6,3.3,7.4,3.3h140.4c0.4,0,0.8-0.3,0.9-0.6c1.7-8.9,9.6-15.4,18.6-15.4c0.3,0,0.6,0,0.9,0c9.7,0.4,17.6,8.4,18.1,18.1
          C300.5,42.7,293.9,51.2,284.7,52.9z"
        />
        <path
          id="star-create-tooltip-content-bg"
          fill="currentColor"
          d="M297.1,33.6c-0.4-8.1-7.1-14.8-15.2-15.2c-8.1-0.4-15,5.3-16.5,12.9c-0.3,1.8-2,3.1-3.8,3.1
          H133.9c-7,0-11.7,6.9-9.4,13.5c2.3,6.3,3.5,13.2,3.5,20.3s-1.3,14-3.5,20.3c-2.4,6.5,2.4,13.5,9.4,13.5h135.2c6.6,0,12-5.4,12-12
          v-36c0-1.8,1.3-3.5,3.1-3.8C291.7,48.5,297.4,41.7,297.1,33.6L297.1,33.6z"
        />
        <path
          id="star-create-tooltip-outline"
          fill="none"
          stroke="currentColor"
          d="M68.1,0.3c19.5,0,38,8.4,50.9,23.1c0.5,0.6,1.3,0.9,2.2,0.9h135.9c4-9.7,13.4-16,24-16
          c0.4,0,0.8,0,1.1,0c13.3,0.6,24.2,11.5,24.8,24.7c0.5,11-6,21-16,25.2v31.5c0,12.1-9.9,22-22,22H121.2c-0.9,0-1.6,0.3-2.2,0.9
          c-12.9,14.7-31.5,23.1-50.9,23.1c-37.4,0-67.8-30.4-67.8-67.8S30.7,0.2,68.1,0.3 M68.1,0C30.5,0,0,30.5,0,68.1s30.5,68.1,68.1,68.1
          c19.5,0,38.2-8.4,51.1-23.2c0.5-0.6,1.2-0.9,2-0.9h147.9c12.3,0,22.3-10,22.3-22.3V58.4c10.1-4.3,16.5-14.5,16-25.4
          c-0.6-13.4-11.6-24.4-25.1-25c-0.4,0-0.8,0-1.2,0c-10.6,0-20.1,6.3-24.2,16H121.2c-0.8,0-1.5-0.3-2-0.9C106.2,8.4,87.6,0,68.1,0
          L68.1,0z"
        />
        <g id="star-create-tooltip-preview">
          <path
            stroke="currentColor"
            stroke-width="2"
            d="M68.1,118.1c27.6,0,50-22.4,50-50c0-27.6-22.4-50-50-50c-27.6,0-50,22.4-50,50
            C18.1,95.7,40.5,118.1,68.1,118.1z"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.56"
            d="M68.1,120c28.7,0,52-23.3,52-51.9s-23.3-52-52-52c-28.7,0-52,23.3-52,52
            S39.4,120,68.1,120z"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.12"
            d="M68.1,122c29.8,0,53.9-24.1,53.9-53.9c0-29.8-24.1-53.9-53.9-53.9
            c-29.8,0-53.9,24.1-53.9,53.9C14.2,97.9,38.3,122,68.1,122z"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="0.69"
            d="M68.1,124c30.8,0,55.9-25,55.9-55.9c0-30.9-25-55.9-55.9-55.9
            c-30.9,0-55.9,25-55.9,55.9C12.2,99,37.2,124,68.1,124z"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="0.25"
            d="M68.1,125.9c31.9,0,57.8-25.9,57.8-57.8c0-31.9-25.9-57.8-57.8-57.8
            c-31.9,0-57.8,25.9-57.8,57.8C10.3,100,36.1,125.9,68.1,125.9z"
          />
        </g>
      </svg>
      <img class="StarCreationTooltipV2__preview" :src="preview" />
      <button
        class="StarCreationTooltipV2__create"
        type="button"
        @click="create()"
        @mouseenter="createButtonHover()"
      >
        Create star
      </button>
      <button
        class="StarCreationTooltipV2__close"
        type="button"
        title="close"
        @click="hide()"
        @mouseenter="hideButtonHover()"
      >
        <svg viewBox="0 0 28 28">
          <path d="M14,28c7.7,0,14-6.3,14-14S21.7,0,14,0S0,6.3,0,14S6.3,28,14,28z" />
          <path fill="none" stroke="currentColor" stroke-width="2" d="M6.9,21.1L21,6.9" />
          <path fill="none" stroke="currentColor" stroke-width="2" d="M6.9,7L21,21.2" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { WINDOW_MOBILE_BREAKPOINT, WINDOW_MOBILE_SAFE_ZONE, WINDOW_SAFE_ZONE } from '@/constants';
import { StarPosition } from '@/models';
import { PropType } from 'vue';

const DEFAULT_BODY_SHIFT = -120;
const DOT_SIZE = 20;
const LINE_OFFSET = 58;

export default {
  name: 'StarCreationTooltipV2',
  props: {
    starPosition: {
      type: Object as PropType<StarPosition>
    }
  },
  data: () => ({
    preview: './gui/images/phantom-star.png',
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
        leftIntersection: this.intersection.left > Math.abs(DEFAULT_BODY_SHIFT) / 2,
        rightIntersection: this.intersection.right > 0,
        bottomIntersection: this.intersection.bottom > 0,
        topIntersection: this.intersection.top > 0,
        horizontalIntersection: this.intersected.x,
        verticalIntersection: this.intersected.y
      };
    },
    position() {
      return this.starPosition.screen;
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
    create() {
      this.$emit('create');
    },
    createButtonHover() {
      this.$emit('createButtonHover');
    }
  },
  mounted() {
    this.recalcIntersection();
  }
};
</script>

<style scoped src="./StarCreationTooltipV2.css"></style>
