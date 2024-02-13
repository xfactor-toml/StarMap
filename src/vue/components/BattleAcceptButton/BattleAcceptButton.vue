<template>
  <button
    class="BattleAcceptButton"
    @click="$emit('click')"
  >
    <BattleConnectIndicator :progress="progress">
      Accept game
    </BattleConnectIndicator>
  </button>
</template>

<script lang="ts">
import { default as anime } from 'animejs'
import { BattleConnectIndicator } from '../BattleConnectIndicator'

export default {
  name: 'BattleAcceptButton',
  components: {
    BattleConnectIndicator
  },
  props: {
    // seconds
    duration: {
      type: Number,
      required: true,
    },
  },
  emits: ['click', 'timeout'],
  data: () => ({
    progress: 0,
  }),
  mounted() {
    anime({
      targets: this,
      progress: [0, 100],
      duration: this.duration * 1000,
      easing: 'linear',
      complete: () => {
        this.$emit('timeout')
      }
    })
  }
};
</script>

<style scoped src="./BattleAcceptButton.css"/>
