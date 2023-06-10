<template>
  <div :class="tooltipClasses" :style="tooltipStyle" ref="tooltip">
    <div class="tooltip__star" />
    <div class="tooltip__info">
      <div class="tooltip__info-heading">
        <h2 class="tooltip__star-name">{{ name }}</h2>
        <span class="tooltip__star-level">Lv.{{ level }}</span>
      </div>
      <p ref="description" class="tooltip__star-description">
        {{ description }}
      </p>
    </div>
    <div class="tooltip__race">
      <img class="tooltip__race-image" :src="raceImageUrl" />
      <p class="tooltip__race-name">{{ race }}</p>
    </div>
    <div class="tooltip__buttons">
      <button
        class="tooltip__button is-close"
        type="button"
        @click="hide()"
        @mouseenter="hideButtonHover()"
      >
        Close
      </button>
      <button
        class="tooltip__button is-dive-in"
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
import textFit from 'textfit';

export default {
  name: 'Tooltip',
  props: {
    name: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    level: {
      type: Number,
      default: 1
    },
    race: {
      type: String,
      validation: type => ['Robots', 'Humans', 'Simbionts', 'Lizards', 'Insects'].includes(type),
      default: 'Robots'
    },
    position: {
      type: Object,
      default: { x: 0, y: 0 }
    },
    raceImageUrl: {
      type: String,
      default: './images/tooltip/ava.png'
    },
    scale: {
      type: Number,
      default: 1
    },
    textAutofit: {
      type: Boolean,
      default: false
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
        tooltip: true,
        'is-reflect': this.intersection.x,
        [`is-${this.race.toLowerCase()}`]: true
      };
    }
  },
  methods: {
    recalcIntersection() {
      const { innerWidth, innerHeight } = window;

      return {
        x: this.position.x > innerWidth - this.position.x,
        y: this.position.y > innerHeight - this.position.y
      };
    },
    calcScale() {
      const { innerWidth, innerHeight } = window;
      const { width } = this.$refs.tooltip.getBoundingClientRect();

      const factor = 1.1;
      const area = this.intersection.x ? this.position.x : innerWidth - this.position.x;
      const scale = Math.min((area / width) * factor, 1) * this.scale;

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

    if (this.textAutofit) {
      setTimeout(() => {
        textFit(this.$refs.description, {
          minFontSize: 10,
          maxFontSize: 14
        });
      });
    }
  }
};
</script>

<style scoped src="./Tooltip.css"></style>
