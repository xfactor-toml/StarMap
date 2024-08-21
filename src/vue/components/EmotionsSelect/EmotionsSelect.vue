<template>
  <div
    class="EmotionsSelect"
    v-click-outside="close"
    :style="{
      top: `${coords.y}px`,
      left: `${coords.x}px`,
    }"
  >
    <button
      v-for="emotion in emotions"
      ref="emotion"
      :data-emotion="emotion"
      :class="`EmotionsSelect__button is-${emotion}`"
      @click="select(emotion)"
    />
  </div>
</template>

<script lang="ts">
import { default as anime } from "animejs"
import { PropType } from 'vue'
import { default as vClickOutside } from 'click-outside-vue3';
import { Coords } from '@/stores/battle-emotions';
import { Emotion } from "~/game/battle/Types";

const SHOW_DURATION = 3000

const emotions: Emotion[] = ['smile', 'thinking', 'evil', 'angry', 'dead', 'sad']
const radius = 60
const offset = 30

const getRadians = (index: number) => {
  const degree = 120 / emotions.length * index + offset
  const radians = degree / 180 * Math.PI

  return radians
}

const getXOffset = (index: number) => {
  return Math.sin(getRadians(index)) * radius * -1
}

const getYOffset = (index: number) => {
  return Math.cos(getRadians(index)) * radius
}

export default {
  name: 'EmotionsSelect',
  props: {
    coords: Object as PropType<Coords>,
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      emotions,
      order: [1, 3, 5, 4, 2, 0],
      timer: null,
      animating: false,
    }
  },
  computed: {
    elementsRefs() {
      return this.order.map(emotionIndex => this.$refs.emotion[emotionIndex])
    }
  },
  methods: {
    show() {
      anime({
        targets: this.elementsRefs,
        translateX: (el, i) => [getXOffset(i), 0],
        translateY: (el, i) => [getYOffset(i), 0],
        scale: [0, 1],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(40),
        easing: 'easeOutElastic',
        complete: () => {
          this.timer = setTimeout(() => {
            this.close()
          }, SHOW_DURATION);
        }
      })
    },
    hide() {
      if (this.animating) {
        return Promise.resolve()
      }

      this.animating = true

      return anime({
        targets: this.elementsRefs,
        scale: [1, 0],
        opacity: [1, 0],
        translateX: (el, i) => getXOffset(i),
        translateY: (el, i) => getYOffset(i),
        duration: 600,
        delay: anime.stagger(40),
        easing: 'easeInBack',
        complete: () => {
          this.animating = false
        }
      }).finished
    },
    close() {
      if (this.animating) {
        return
      }

      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      this.hide().then(() => {
        this.$emit('close')
      })
    },
    select(emotion: string) {
      this.$emit('select', emotion)
      this.close()
    }
  },
  mounted() {
    this.show()
  }
};
</script>

<style scoped src="./EmotionsSelect.css"></style>
