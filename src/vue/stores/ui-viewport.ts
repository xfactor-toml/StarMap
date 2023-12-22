import { WINDOW_MOBILE_BREAKPOINT } from '@/constants';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUiViewportStore = defineStore('uiViewport', () => {
  const windowWidth = ref(window.innerWidth)

  const isMobile = computed(() => windowWidth.value <= WINDOW_MOBILE_BREAKPOINT)

  const setWindowWidth = (width: number) => {
    windowWidth.value = width;
  }

  return {
    isMobile,
    windowWidth,
    setWindowWidth
  }
});
