function getTooltipComponent() {
  return {
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
        validation: type =>
          ['Robots', 'Humans', 'Simbionts', 'Lizards', 'Insects'].includes(
            type
          ),
        default: 'Robots'
      },
      position: {
        type: Object,
        default: { x: 0, y: 0 }
      },
      raceImageUrl: {
        type: String,
        default: 'public/imgs/ava.png'
      },
      scale: {
        type: Number,
        default: 1
      }
    },
    data: () => ({
      intersection: { x: false, y: false }
    }),
    computed: {
      tooltipStyle() {
        return {
          top: `${this.position.y}px`,
          left: `${this.position.x}px`,
          transform: `
            scale(${this.scale})
            translateX(${this.intersection.x ? '-100%' : '0'})
            translateY(${this.intersection.y ? '-100%' : '0'})
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
        const { width, height, top, left } = this.$el.getBoundingClientRect()
        const { innerWidth, innerHeight } = window

        this.intersection = {
          x: (width + left) > innerWidth,
          y: (height + top) > innerHeight
        }
      },
      hide() {
        this.$emit('hide');
      }
    },
    mounted() {
      this.recalcIntersection()
    },
    template: `
      <div
        :class="tooltipClasses"
        :style="tooltipStyle"
      >
        <div class="tooltip__star"/>
        <div class="tooltip__info">
          <div class="tooltip__info-heading">
            <h2 class="tooltip__star-name">{{ name }}</h2>
            <span class="tooltip__star-level">Lv.{{ level }}</span>
          </div>
          <p class="tooltip__star-description">{{ description }}</p>
        </div>
        <div class="tooltip__race">
          <img
            class="tooltip__race-image"
            :src="raceImageUrl"
          >
          <p class="tooltip__race-name">{{ race }}</p>
        </div>
        <div class="tooltip__buttons">
            <button
              class="tooltip__button is-close"
              type="button"
              @click="hide()"
            >Close
            </button>
            <button
              class="tooltip__button is-dive-in"
              type="button"
              @click="hide()"
            >Dive in
            </button>
        </div>
      </div>
    `
  };
}

function createGui() {
  const gui = Vue.createApp({
    data: () => ({
      tooltipVisible: false,
      tooltipData: null
    }),
    methods: {
      showTooltip(data) {
        if (this.tooltipData && this.tooltipData.name === data.name) {
          this.hideTooltip();
        } else {
          this.tooltipData = data;
          this.tooltipVisible = true;
        }
      },
      hideTooltip() {
        if (this.tooltipVisible) {
          this.tooltipData = null;
          this.tooltipVisible = false;
        }
      }
    },
    template: `
      <transition name="fade">
        <tooltip
          v-if="tooltipVisible"
          :name="tooltipData.name"
          :description="tooltipData.description"
          :level="tooltipData.level"
          :race="tooltipData.race"
          :position="tooltipData.pos2d"
          :scale="tooltipData.scale"
          @hide="hideTooltip"
        />
      </transition>
    `
  });

  gui.component('tooltip', getTooltipComponent());

  return gui.mount('#gui');
}
