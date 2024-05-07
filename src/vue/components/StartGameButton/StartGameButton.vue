<template>
  <button
    class="StartGameButton"
    @click="$emit('click')"
  >
    <slot/>
  </button>
</template>

<script lang="ts">
export default {
  name: 'StartGameButton',
  emits: ['click']
};
</script>

<style scoped src="./StartGameButton.css"></style>
