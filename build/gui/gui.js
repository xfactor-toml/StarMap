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
        default: '/gui/img/tooltip/ava.png'
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
      },
      diveIn() {
        this.$emit('diveIn');
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
              @click="diveIn()"
            >Dive in
            </button>
        </div>
      </div>
    `
  };
}

function getStarPanelComponent() {
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
      planetSlots: {
        type: Number,
        default: 0
      },
      energy: {
        type: Number,
        default: 0
      },
      life: {
        type: Number,
        default: 0
      },
      race: {
        type: String,
        validation: type =>
          ['Robots', 'Humans', 'Simbionts', 'Lizards', 'Insects'].includes(
            type
          ),
        default: 'Robots'
      },
      raceImageUrl: {
        type: String,
        default: '/gui/img/star-panel/race-insects.png'
      },
      scale: {
        type: Number,
        default: 1
      }
    },
    computed: {
      panelStyle() {
        return {
          transform: `scale(${this.scale})`
        };
      },
      panelClasses() {
        return {
          'star-panel': true,
          [`is-${this.race.toLowerCase()}`]: true
        };
      }
    },
    methods: {
      play() {
        this.$emit('play');
      },
      hide() {
        this.$emit('hide');
      },
    },
    template: `
      <div
        :class="panelClasses"
        :style="panelStyle"
      >
        <div class="star-panel__info">
          <div class="star-panel__info-row is-heading">
            <div class="star-panel__info-key is-selectable">{{ name }}</div>
            <div class="star-panel__info-value is-selectable is-level">Lv.{{ level }}</div>
          </div>
          <div class="star-panel__info-row is-slots">
            <div class="star-panel__info-key is-selectable">Planet slots</div>
            <div class="star-panel__info-value is-selectable">{{ planetSlots }}</div>
          </div>
          <div class="star-panel__info-row is-energy">
            <div class="star-panel__info-key is-selectable">Energy</div>
            <div class="star-panel__info-value is-selectable">{{ energy }}</div>
          </div>
          <div class="star-panel__info-row is-life">
            <div class="star-panel__info-key is-selectable">Life</div>
            <div class="star-panel__info-value is-selectable">{{ life }}</div>
          </div>
        </div>
        <div class="star-panel__star">
        <button
          class="star-panel__star-button is-selectable"
          type="button"
          @click="play()"
        />
        </div>
        <div class="star-panel__race">
          <button
            class="star-panel__close-button is-selectable"
            type="button"
            @click="hide()"
          />
          <img
            class="star-panel__race-image"
            :src="raceImageUrl"
          >
          <p class="star-panel__race-name is-selectable">{{ race }}</p>
          <p class="star-panel__race-description is-selectable">{{ description }}</p>
        </div>
      </div>
    `
  };
}

function createGui() {
  const gui = Vue.createApp({
    data: () => ({
      tooltipVisible: false,
      tooltipData: null,
      starPanelVisible: false,
      starPanelData: null,
      listeners: {},
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
      },
      showStarPanel(data) {
        if (this.starPanelData && this.starPanelData.name === data.name) {
          this.hideStarPanel();
        } else {
          this.starPanelData = data;
          this.starPanelVisible = true;
        }
      },
      hideStarPanel() {
        if (this.starPanelVisible) {
          this.starPanelData = null;
          this.starPanelVisible = false;
        }
      },
      on(eventName, callback) {
        if (!this.listeners[eventName]) {
          this.listeners[eventName] = []
        }
        
        this.listeners[eventName].push(callback)
      },
      once(eventName, callback) {
        const listener = (data) => {
          callback(data)
          this.off(eventName, listener)
        }
        this.on(eventName, listener)
      },
      off(eventName, callback) {
        this.listeners[eventName] = callback
          ? this.listeners[eventName].filter(listener => listener !== callback)
          : []
      },
      emit(eventName, data) {
        if (this.listeners[eventName]) {
          this.listeners[eventName].forEach(listener => {
            if (typeof listener === 'function') {
              listener(data)
            }
          })
        }
      }
    },
    template: `
      <transition name="fade">
        <star-panel
          v-if="starPanelVisible"
          :name="starPanelData.name"
          :description="starPanelData.description"
          :level="starPanelData.level"
          :race="starPanelData.race"
          :planetsSlots="starPanelData.planetsSlots"
          :energy="starPanelData.energy"
          :life="starPanelData.life"
          :scale="starPanelData.scale"
          @hide="emit('starPanelHide')"
          @play="emit('starPanelPlay')"
        />
      </transition>
      <transition name="fade">
        <tooltip
          v-if="tooltipVisible"
          :name="tooltipData.name"
          :description="tooltipData.description"
          :level="tooltipData.level"
          :race="tooltipData.race"
          :position="tooltipData.pos2d"
          :scale="tooltipData.scale"
          @hide="emit('tooltipHide')"
          @diveIn="emit('tooltipDiveIn')"
        />
      </transition>
      <button @click="showStarPanel({
          name: 'Test star',
          description: 'This is test star. Test star is amazing! Get it lick! Mmmm! Its tastet like crasy!',
          level: 1,
          race: ['Robots', 'Humans', 'Simbionts', 'Lizards', 'Insects'][~~(Math.random() * 4)], 
          planetsSlots: 100,
          energy: 1000,
          life: 300,
        })"
      >{{ starPanelVisible ? 'Hide' : 'Show' }} star panel
      </button>
    `
  });

  gui.component('tooltip', getTooltipComponent());
  gui.component('star-panel', getStarPanelComponent());

  return gui.mount('#gui');
}
