<template>
  <button
    class="StartGameButton"
    @click="$emit('click')"
  >Start<br>game
  </button>
</template>

<script lang="ts">
export default {
  name: 'StartGameButton',
  emits: ['click']
};
</script>

<style scoped src="./StartGameButton.css"></style>
