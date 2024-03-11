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
import { BattleConnectIndicator } from '../BattleConnectIndicator'

export default {
  name: 'BattleAcceptButton',
  components: {
    BattleConnectIndicator
  },
  props: {
    progress: {
      type: Number,
      required: true,
    },
  },
  emits: ['click'],
};
</script>

<style scoped src="./BattleAcceptButton.css"/>
