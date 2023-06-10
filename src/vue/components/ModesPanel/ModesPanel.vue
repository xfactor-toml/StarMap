<template>
  <div class="ModesPanel"></div>
</template>

<script lang="ts">
export default {
  name: 'ModesPanel',
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped src="./ModesPanel.css"></style>
