import { defineStore } from 'pinia';

import { ClientView, ClientViewName, GuiMode, GuiModeName, GuiScreen, GuiScreenName } from '@/types';
import { SCREENS } from '@/constants';
import { reactive } from 'vue';

export const useScreensStore = defineStore('screens', () => {
  const current = reactive<{
    screen: GuiScreen
    mode: GuiMode | null
    view: ClientView | null
  }>({
    screen: SCREENS.preloader,
    mode: null,
    view: null,
  })

  const setClientView = (viewName: ClientViewName) => {
    current.view = current.mode?.views.find(view => view.name === viewName) || null
  }

  const setScreenMode = (modeName: GuiModeName) => {
    current.mode = current.screen.modes?.find(mode => mode.name === modeName) || null
    current.view = current.mode?.views.find(view => view.enabled) || null
  }

  const setScreen = (screenName: GuiScreenName) => {
    current.screen = SCREENS[screenName]
    setScreenMode(current.screen.defaultMode)
  }


  return {
    current,
    setClientView,
    setScreenMode,
    setScreen
  }
});
