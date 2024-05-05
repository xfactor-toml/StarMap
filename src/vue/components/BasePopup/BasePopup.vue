<template>
  <div class="BasePopup">
    <div
      class="BasePopup__overlay"
      @click="$emit('close')"
    />
    <div class="BasePopup__box">
      <button
        class="BasePopup__close"
        @click="$emit('close')"
      />
      <div v-if="title" class="BasePopup__head">
        <div class="BasePopup__title">{{ title }}</div>
      </div>
      <div class="BasePopup__body">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BasePopup',
  props: {
    title: {
      type: String
    }
  }
};
</script>

<style scoped src="./BasePopup.css"></style>
