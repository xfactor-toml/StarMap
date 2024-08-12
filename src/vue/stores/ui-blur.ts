import { defineStore } from 'pinia';

const SELECTOR = '#game'

export const useUiBlurStore = defineStore('uiBlur', () => {
  const gameElement = document.querySelector(SELECTOR)

  const enable = () => {
    gameElement.classList.add('is-blured')
  }

  const disable = () => {
    gameElement.classList.remove('is-blured')
  }

  return {
    enable,
    disable,
  }
});
