<template>
  <div class="volume-control" :class="dragging && 'is-dragging'">
    <button class="volume-control__indicator" type="button" @click="mute">
      <span v-if="volume === 0" class="volume-control__icon is-mute" />
      <span v-else class="volume-control__icon" />
    </button>
    <div class="volume-control__line" ref="line" @mousedown="handleMousedown($event), offset($event as any, 'click')"
      @touchstart="handleMousedown($event as any), offset($event as any, 'click')">
      <div class="volume-control__level" :style="`width: ${volume}%`" />
      <div class="volume-control__point" :style="`left: ${volume}%`" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "VolumeControl",
  props: {
    initialVolume: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      position: 50,
      prevPosition: 50,
      drag: 0,
      dragging: false,
      lineWidth: 0,
      muted: false,
      volume: this.initialVolume,
      states: [
        { value: 0, icon: "volumeMute" },
        { value: 1, icon: "volumeMin" },
        { value: 50, icon: "volumeHalf" },
        { value: 90, icon: "volumeFull" }
      ],
      firstCoords: { x: 0, y: 0 },
      lastCoords: { x: 0, y: 0 }
    };
  },
  computed: {
    level() {
      const position = this.position + this.drag;
      const percent = (position / this.lineWidth) * 100;
      const value = percent < 0 ? 0 : percent > 100 ? 100 : percent;

      return value;
    },
    currentState() {
      const currentIndex = this.states.reduce(
        (findedIndex, item, index, list) => {
          const currentValue = Math.abs(item.value - this.level);
          const findedValue = Math.abs(list[findedIndex].value - this.level);

          return currentValue < findedValue ? index : findedIndex;
        },
        0
      );

      return this.states[currentIndex];
    }
  },
  watch: {
    position(value) {
      if (value > this.lineWidth) {
        this.position = this.lineWidth;
      }
      if (value < 0) {
        this.position = 0;
      }
    },
    level(value) {
      this.muted = value < 1;
    }
  },
  methods: {
    mute() {
      if (this.muted) {
        this.position = this.prevPosition;
      } else {
        this.prevPosition = this.position;
        this.position = 0;
      }

      this.volume = Math.trunc(this.level);
      this.$emit("change", this.volume);
    },
    offset({ offsetX = 0, first, last }, type) {
      if (type === "drag") {
        if (first || last) {
          this.position = this.position + this.drag;
          this.drag = 0;
        } else {
          this.drag = offsetX;
        }
      }

      if (type === "click") {
        this.position = offsetX;
      }

      this.volume = Math.trunc(this.level);
      this.$emit("change", this.volume);
    },
    handleMousedown(event: MouseEvent) {
      const { clientX, clientY } = event;

      this.dragging = true;
      this.lastCoords = this.firstCoords = {
        x: clientX,
        y: clientY
      };

      this.offset(
        {
          first: true,
          clientX,
          clientY
        },
        "drag"
      );
    },
    handleMousemove(event: MouseEvent) {
      if (!this.dragging) return;

      event.preventDefault();

      const { clientX, clientY } = event;

      if (this.lastCoords) {
        const deltaX = clientX - this.lastCoords.x;
        const deltaY = clientY - this.lastCoords.y;
        const offsetX = clientX - this.firstCoords.x;
        const offsetY = clientY - this.firstCoords.y;

        this.offset(
          {
            deltaX,
            deltaY,
            offsetX,
            offsetY,
            clientX,
            clientY
          },
          "drag"
        );

        this.lastCoords = {
          x: clientX,
          y: clientY
        };
      }
    },
    handleMouseup(event: MouseEvent) {
      if (!this.dragging) return;

      event.preventDefault();

      const { clientX, clientY } = event;

      this.offset(
        {
          last: true,
          clientX,
          clientY
        },
        "drag"
      );

      this.dragging = false;
      this.lastCoords = null;
    }
  },
  mounted() {
    document.documentElement.addEventListener(
      "mousemove",
      this.handleMousemove
    );
    document.documentElement.addEventListener(
      "touchmove",
      this.handleMousemove
    );
    document.documentElement.addEventListener("mouseup", this.handleMouseup);
    document.documentElement.addEventListener("touchend", this.handleMouseup);

    this.lineWidth = this.$refs.line.clientWidth;
    this.position = this.volume;
  },
  unmounted() {
    document.documentElement.removeEventListener(
      "mousemove",
      this.handleMousemove
    );
    document.documentElement.removeEventListener(
      "touchmove",
      this.handleMousemove
    );
    document.documentElement.removeEventListener("mouseup", this.handleMouseup);
    document.documentElement.removeEventListener(
      "touchend",
      this.handleMouseup
    );
  }
};
</script>

<style scoped src="./VolumeControl.css"></style>
