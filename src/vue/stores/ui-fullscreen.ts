import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiFullscreenStore = defineStore('uiFullscreen', () => {
  const active = ref(false)

  const enable = () => {
    active.value = true;
  }

  const disable = () => {
    active.value = false;
  }

  return {
    active,
    enable,
    disable,
  }
});
