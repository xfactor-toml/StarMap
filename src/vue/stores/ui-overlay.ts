import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiOverlayStore = defineStore('uiOverlay', () => {
  const visible = ref(false)
  const active = ref(false)

  const enable = (aActiveTimer = 0) => {
    visible.value = true;
    active.value = false;
    setTimeout(() => {
      active.value = true;
    }, aActiveTimer);
  }

  const disable = () => {
    active.value = false;
    visible.value = false;
  }

  return {
    visible,
    active,
    enable,
    disable,
  }
});
