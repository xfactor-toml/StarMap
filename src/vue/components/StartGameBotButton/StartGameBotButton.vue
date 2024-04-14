<template>
  <button class="StartGameBotButton" @click="$emit('click')">Play<br>With Bot</button>
</template>

<script lang="ts">
export default {
  name: 'StartGameBotButton',
  emits: ['click']
};
</script>

<style scoped src="./StartGameBotButton.css"></style>
