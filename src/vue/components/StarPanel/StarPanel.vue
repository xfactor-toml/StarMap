<template>
  <div :class="panelClasses" :style="panelStyle">
    <div class="star-panel__info">
      <div class="star-panel__info-row is-heading">
        <div class="star-panel__info-key is-selectable">{{ name }}</div>
        <div class="star-panel__info-value is-selectable is-level">
          Lv.{{ level }}
        </div>
      </div>
      <div class="star-panel__info-row is-slots">
        <div class="star-panel__info-key is-selectable">Planet slots</div>
        <div class="star-panel__info-value is-selectable">
          {{ planetSlots }}
        </div>
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
        @mouseenter="playButtonHover()"
      />
    </div>
    <div class="star-panel__race">
      <button
        class="star-panel__close-button is-selectable"
        type="button"
        @click="hide()"
        @mouseenter="hideButtonHover()"
      />
      <img class="star-panel__race-image" :src="raceImageUrl" />
      <p class="star-panel__race-name is-selectable">{{ race }}</p>
      <p class="star-panel__race-description is-selectable">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "StarPanel",
  props: {
    name: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
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
      validation: (type) =>
        ["Robots", "Humans", "Simbionts", "Lizards", "Insects"].includes(type),
      default: "Robots"
    },
    raceImageUrl: {
      type: String,
      default: "./images/star-panel/race-insects.png"
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
        "star-panel": true,
        [`is-${this.race.toLowerCase()}`]: true
      };
    }
  },
  methods: {
    play() {
      this.$emit("play");
    },
    playButtonHover() {
      this.$emit("playButtonHover");
    },
    hide() {
      this.$emit("hide");
    },
    hideButtonHover() {
      this.$emit("hideButtonHover");
    }
  }
};
</script>

<style scoped src="./StarPanel.css"></style>
